/**
 * Amazon Browser Automation Service
 * Handles headless browser automation for Amazon.com purchasing
 * 
 * ⚠️ WARNING: This violates Amazon's Terms of Service
 * Use at your own risk. Account suspension possible.
 */

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface AmazonCredentials {
  email: string;
  password: string;
}

export interface AmazonProduct {
  asin: string;
  url: string;
  price?: number;
  shippingDays?: number;
  available?: boolean;
}

export interface AmazonAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

export class AmazonAutomationService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private sessionPath: string;

  constructor(orgId: string) {
    // Store session per organization
    this.sessionPath = join(process.cwd(), '.sessions', `amazon-${orgId}.json`);
  }

  /**
   * Initialize headless browser with stealth settings
   */
  async initialize(): Promise<void> {
    console.log('Initializing headless browser...');
    
    this.browser = await chromium.launch({
      headless: true, // Set to false for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    // Load saved session if exists
    const sessionData = this.loadSession();
    
    this.context = await this.browser.newContext({
      ...sessionData,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
    });

    this.page = await this.context.newPage();
    
    // Add stealth techniques
    await this.page.addInitScript(() => {
      // Override navigator.webdriver
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    console.log('Browser initialized successfully');
  }

  /**
   * Login to Amazon account
   */
  async login(credentials: AmazonCredentials): Promise<boolean> {
    if (!this.page) throw new Error('Browser not initialized');

    console.log('Attempting Amazon login...');

    try {
      await this.page.goto('https://www.amazon.com/ap/signin', {
        waitUntil: 'networkidle',
      });

      // Enter email
      await this.page.fill('input[name="email"]', credentials.email);
      await this.randomDelay(500, 1500);
      await this.page.click('input#continue');
      await this.page.waitForLoadState('networkidle');

      // Enter password
      await this.page.fill('input[name="password"]', credentials.password);
      await this.randomDelay(500, 1500);
      await this.page.click('input#signInSubmit');
      await this.page.waitForLoadState('networkidle');

      // Check if login successful
      const isLoggedIn = await this.checkLoginStatus();
      
      if (isLoggedIn) {
        console.log('Login successful');
        await this.saveSession();
        return true;
      }

      // Check for 2FA/CAPTCHA
      const needs2FA = await this.page.locator('text=Two-Step Verification').count() > 0;
      const needsCaptcha = await this.page.locator('#auth-captcha-image').count() > 0;

      if (needs2FA) {
        console.error('2FA required - manual intervention needed');
        return false;
      }

      if (needsCaptcha) {
        console.error('CAPTCHA detected - manual intervention needed');
        return false;
      }

      console.error('Login failed - unknown reason');
      return false;

    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  /**
   * Check if currently logged in
   */
  private async checkLoginStatus(): Promise<boolean> {
    if (!this.page) return false;

    try {
      await this.page.goto('https://www.amazon.com', { waitUntil: 'networkidle' });
      
      // Check for "Hello, Sign in" vs "Hello, [Name]"
      const signInText = await this.page.locator('#nav-link-accountList').textContent();
      return !signInText?.includes('Sign in');
    } catch {
      return false;
    }
  }

  /**
   * Search for product and get details
   */
  async searchProduct(query: string): Promise<AmazonProduct | null> {
    if (!this.page) throw new Error('Browser not initialized');

    console.log(`Searching for: ${query}`);

    try {
      await this.page.goto('https://www.amazon.com', { waitUntil: 'networkidle' });
      
      // Search
      await this.page.fill('input#twotabsearchtextbox', query);
      await this.randomDelay(300, 800);
      await this.page.click('input#nav-search-submit-button');
      await this.page.waitForLoadState('networkidle');

      // Get first result
      const firstResult = this.page.locator('[data-component-type="s-search-result"]').first();
      
      if (await firstResult.count() === 0) {
        console.log('No results found');
        return null;
      }

      // Extract product details
      const asin = await firstResult.getAttribute('data-asin');
      const priceWhole = await firstResult.locator('.a-price-whole').first().textContent();
      const priceFraction = await firstResult.locator('.a-price-fraction').first().textContent();
      
      if (!asin) return null;

      const price = priceWhole && priceFraction 
        ? parseFloat(`${priceWhole}.${priceFraction}`.replace(/,/g, ''))
        : undefined;

      return {
        asin,
        url: `https://www.amazon.com/dp/${asin}`,
        price,
        available: true,
      };

    } catch (error) {
      console.error('Search error:', error);
      return null;
    }
  }

  /**
   * Get product details from ASIN
   */
  async getProductDetails(asin: string): Promise<AmazonProduct | null> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      const url = `https://www.amazon.com/dp/${asin}`;
      await this.page.goto(url, { waitUntil: 'networkidle' });

      // Check availability
      const outOfStock = await this.page.locator('text=Currently unavailable').count() > 0;
      if (outOfStock) {
        return { asin, url, available: false };
      }

      // Get price
      const priceElement = await this.page.locator('.a-price .a-offscreen').first();
      const priceText = await priceElement.textContent();
      const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : undefined;

      // Get shipping estimate
      const shippingText = await this.page.locator('#deliveryBlockMessage').textContent();
      const shippingMatch = shippingText?.match(/(\d+)/);
      const shippingDays = shippingMatch ? parseInt(shippingMatch[1]) : undefined;

      return {
        asin,
        url,
        price,
        shippingDays,
        available: true,
      };

    } catch (error) {
      console.error('Get product details error:', error);
      return null;
    }
  }

  /**
   * Add product to cart
   */
  async addToCart(asin: string, quantity: number = 1): Promise<boolean> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      await this.page.goto(`https://www.amazon.com/dp/${asin}`, { waitUntil: 'networkidle' });

      // Set quantity if needed
      if (quantity > 1) {
        await this.page.selectOption('#quantity', quantity.toString());
        await this.randomDelay(300, 700);
      }

      // Click "Add to Cart"
      await this.page.click('input#add-to-cart-button');
      await this.page.waitForLoadState('networkidle');

      // Verify added
      const successMessage = await this.page.locator('text=Added to Cart').count() > 0;
      
      console.log(successMessage ? 'Added to cart successfully' : 'Failed to add to cart');
      return successMessage;

    } catch (error) {
      console.error('Add to cart error:', error);
      return false;
    }
  }

  /**
   * Complete checkout with address
   */
  async checkout(address: AmazonAddress): Promise<{ success: boolean; orderId?: string }> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      // Go to cart
      await this.page.goto('https://www.amazon.com/gp/cart/view.html', { waitUntil: 'networkidle' });

      // Proceed to checkout
      await this.page.click('input[name="proceedToRetailCheckout"]');
      await this.page.waitForLoadState('networkidle');

      // Add/select shipping address
      const addNewAddress = await this.page.locator('text=Add a new address').count() > 0;
      
      if (addNewAddress) {
        await this.page.click('text=Add a new address');
        await this.fillAddress(address);
        await this.page.click('input[name="address-ui-widgets-enterAddressFormSubmit"]');
        await this.page.waitForLoadState('networkidle');
      }

      // Continue to payment
      await this.page.click('input[name="shipToThisAddress"]');
      await this.page.waitForLoadState('networkidle');

      // Place order (if default payment method is set)
      await this.page.click('input[name="placeYourOrder1"]');
      await this.page.waitForLoadState('networkidle');

      // Get order ID from confirmation page
      const orderIdElement = await this.page.locator('text=/Order #.*/).first();
      const orderIdText = await orderIdElement.textContent();
      const orderIdMatch = orderIdText?.match(/Order #([\d-]+)/);
      const orderId = orderIdMatch ? orderIdMatch[1] : undefined;

      if (orderId) {
        console.log('Order placed successfully:', orderId);
        return { success: true, orderId };
      }

      return { success: false };

    } catch (error) {
      console.error('Checkout error:', error);
      return { success: false };
    }
  }

  /**
   * Fill address form
   */
  private async fillAddress(address: AmazonAddress): Promise<void> {
    if (!this.page) return;

    await this.page.fill('input[name="address-ui-widgets-enterAddressFullName"]', address.name);
    await this.randomDelay(200, 500);
    
    await this.page.fill('input[name="address-ui-widgets-enterAddressLine1"]', address.addressLine1);
    await this.randomDelay(200, 500);
    
    if (address.addressLine2) {
      await this.page.fill('input[name="address-ui-widgets-enterAddressLine2"]', address.addressLine2);
      await this.randomDelay(200, 500);
    }
    
    await this.page.fill('input[name="address-ui-widgets-enterAddressCity"]', address.city);
    await this.randomDelay(200, 500);
    
    await this.page.selectOption('select[name="address-ui-widgets-enterAddressStateOrRegion"]', address.state);
    await this.randomDelay(200, 500);
    
    await this.page.fill('input[name="address-ui-widgets-enterAddressPostalCode"]', address.zipCode);
    await this.randomDelay(200, 500);
    
    await this.page.fill('input[name="address-ui-widgets-enterAddressPhoneNumber"]', address.phoneNumber);
    await this.randomDelay(200, 500);
  }

  /**
   * Random delay to simulate human behavior
   */
  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Save session cookies for reuse
   */
  private async saveSession(): Promise<void> {
    if (!this.context) return;

    const cookies = await this.context.cookies();
    const sessionData = {
      cookies,
      storageState: await this.context.storageState(),
    };

    writeFileSync(this.sessionPath, JSON.stringify(sessionData, null, 2));
    console.log('Session saved');
  }

  /**
   * Load saved session
   */
  private loadSession(): any {
    if (!existsSync(this.sessionPath)) {
      return {};
    }

    try {
      const sessionData = JSON.parse(readFileSync(this.sessionPath, 'utf-8'));
      console.log('Session loaded');
      return sessionData.storageState || {};
    } catch {
      return {};
    }
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    
    this.page = null;
    this.context = null;
    this.browser = null;
    
    console.log('Browser closed');
  }
}
