/**
 * Browser Automation for Amazon Auto-Fulfillment
 * Uses Playwright for headless browser automation
 * 
 * This is the same method used by:
 * - DSM Tool
 * - AutoDS
 * - HustleGotReal
 * - Zik Pro
 * - Most Japan/Thai dropship tools
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';

export interface AmazonCredentials {
  email: string;
  password: string;
}

export interface ShippingAddress {
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export class BrowserAutomation {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  /**
   * Launch browser instance
   */
  async launch(headless: boolean = true) {
    this.browser = await chromium.launch({
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'ja-JP',
    });

    this.page = await this.context.newPage();
  }

  /**
   * Close browser instance
   */
  async close() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  /**
   * Login to Amazon buyer account
   */
  async loginToAmazon(credentials: AmazonCredentials) {
    if (!this.page) throw new Error('Browser not launched');

    // Navigate to Amazon Japan
    await this.page.goto('https://www.amazon.co.jp/', {
      waitUntil: 'networkidle',
    });

    // Click sign in
    await this.page.click('#nav-link-accountList');

    // Wait for login page
    await this.page.waitForSelector('#ap_email');

    // Enter email
    await this.page.fill('#ap_email', credentials.email);
    await this.page.click('#continue');

    // Wait for password field
    await this.page.waitForSelector('#ap_password');

    // Enter password
    await this.page.fill('#ap_password', credentials.password);
    await this.page.click('#signInSubmit');

    // Wait for navigation after login
    await this.page.waitForNavigation({ waitUntil: 'networkidle' });

    // Check if 2FA is required
    const has2FA = await this.page.$('#auth-mfa-otpcode');
    if (has2FA) {
      // In production, would need to handle 2FA
      // Could use SMS API, TOTP generator, or manual intervention
      throw new Error('2FA required - not implemented in this version');
    }

    // Verify login success
    const isLoggedIn = await this.page.$('#nav-link-accountList-nav-line-1');
    if (!isLoggedIn) {
      throw new Error('Amazon login failed');
    }
  }

  /**
   * Navigate to product page by ASIN
   */
  async navigateToProduct(asin: string) {
    if (!this.page) throw new Error('Browser not launched');

    const url = `https://www.amazon.co.jp/dp/${asin}`;
    await this.page.goto(url, { waitUntil: 'networkidle' });

    // Wait for product title to ensure page loaded
    await this.page.waitForSelector('#productTitle', { timeout: 10000 });
  }

  /**
   * Check if product is in stock
   */
  async checkStock(): Promise<boolean> {
    if (!this.page) throw new Error('Browser not launched');

    // Check for out of stock indicators
    const outOfStock = await this.page.$('#availability .a-color-price');
    if (outOfStock) {
      const text = await outOfStock.textContent();
      if (text?.includes('在庫切れ') || text?.includes('Out of Stock')) {
        return false;
      }
    }

    // Check for "Add to Cart" button
    const addToCartButton = await this.page.$('#add-to-cart-button');
    if (!addToCartButton) {
      // Might be used-only or unavailable
      return false;
    }

    return true;
  }

  /**
   * Add item to cart
   */
  async addToCart(quantity: number = 1) {
    if (!this.page) throw new Error('Browser not launched');

    // Set quantity if needed
    if (quantity > 1) {
      const quantitySelector = await this.page.$('#quantity');
      if (quantitySelector) {
        await this.page.selectOption('#quantity', quantity.toString());
      }
    }

    // Click "Add to Cart"
    await this.page.click('#add-to-cart-button');

    // Wait for confirmation
    await this.page.waitForSelector('#attachDisplayAddBaseAlert, #huc-v2-order-row-confirm-text', {
      timeout: 5000,
    });

    // Give Amazon a moment to update cart
    await this.page.waitForTimeout(1000);
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    if (!this.page) throw new Error('Browser not launched');

    await this.page.click('#nav-cart');
    await this.page.waitForNavigation({ waitUntil: 'networkidle' });
  }

  /**
   * Set shipping address
   */
  async setShippingAddress(address: ShippingAddress) {
    if (!this.page) throw new Error('Browser not launched');

    // Click proceed to checkout
    await this.page.click('#sc-buy-box-ptc-button');

    // Wait for address page
    await this.page.waitForSelector('#address-ui-widgets-enterAddressFullName, #address-book-entry-0', {
      timeout: 10000,
    });

    // Check if we need to add new address or select existing
    const existingAddress = await this.page.$('#address-book-entry-0');

    if (existingAddress) {
      // Select first address (would need logic to match customer address)
      await this.page.click('#address-book-entry-0');
      await this.page.click('#shippingAddressButtonId');
    } else {
      // Fill in new address
      await this.page.fill('#address-ui-widgets-enterAddressFullName', address.name);
      await this.page.fill('#address-ui-widgets-enterAddressLine1', address.address.line1);

      if (address.address.line2) {
        await this.page.fill('#address-ui-widgets-enterAddressLine2', address.address.line2);
      }

      await this.page.fill('#address-ui-widgets-enterAddressCity', address.address.city);
      await this.page.fill('#address-ui-widgets-enterAddressStateOrRegion', address.address.state);
      await this.page.fill('#address-ui-widgets-enterAddressPostalCode', address.address.postalCode);

      // Submit address
      await this.page.click('#address-ui-widgets-form-submit-button');
    }

    // Wait for navigation to payment/review page
    await this.page.waitForNavigation({ waitUntil: 'networkidle' });
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    if (!this.page) throw new Error('Browser not launched');

    // Usually address is already set, now on payment page
    // Select delivery option (typically fastest)
    const deliveryOptions = await this.page.$$('[name="shipoptionid"]');
    if (deliveryOptions.length > 0) {
      await deliveryOptions[0].click();
      await this.page.waitForTimeout(1000);
    }

    // Click continue to payment
    const continueButton = await this.page.$('#shippingOptionFormId button[type="submit"], #continue-top');
    if (continueButton) {
      await continueButton.click();
      await this.page.waitForNavigation({ waitUntil: 'networkidle' });
    }
  }

  /**
   * Complete purchase
   */
  async completePurchase(): Promise<string> {
    if (!this.page) throw new Error('Browser not launched');

    // On review/payment page
    // Select payment method (assumes default card is set)
    const paymentMethods = await this.page.$$('[name="ppw-instrumentRowSelection"]');
    if (paymentMethods.length > 0) {
      await paymentMethods[0].click();
      await this.page.waitForTimeout(500);
    }

    // Click "Place your order" button
    const placeOrderButton = await this.page.$(
      '#placeYourOrder, #submitOrderButtonId, input[name="placeYourOrder1"]'
    );

    if (!placeOrderButton) {
      throw new Error('Place order button not found');
    }

    // Take screenshot before placing order (for debugging)
    await this.page.screenshot({ path: '/tmp/amazon-checkout-before.png' });

    // Place order
    await placeOrderButton.click();

    // Wait for order confirmation page
    await this.page.waitForSelector('#widget-purchaseConfirmationStatus, .a-box-inner h1', {
      timeout: 30000,
    });

    // Take screenshot of confirmation
    await this.page.screenshot({ path: '/tmp/amazon-checkout-after.png' });

    // Extract order ID
    const orderIdElement = await this.page.$('.order-id, [data-test-id="order-id"]');
    if (!orderIdElement) {
      throw new Error('Order ID not found on confirmation page');
    }

    const orderIdText = await orderIdElement.textContent();
    const orderIdMatch = orderIdText?.match(/(\d{3}-\d{7}-\d{7})/);

    if (!orderIdMatch) {
      throw new Error('Could not parse Amazon order ID');
    }

    return orderIdMatch[1];
  }

  /**
   * Get tracking number for order
   */
  async getTrackingNumber(amazonOrderId: string): Promise<string> {
    if (!this.page) throw new Error('Browser not launched');

    // Navigate to orders page
    await this.page.goto('https://www.amazon.co.jp/gp/css/order-history', {
      waitUntil: 'networkidle',
    });

    // Search for order
    const orderCards = await this.page.$$('.order-card, .a-box-group.order');

    for (const card of orderCards) {
      const text = await card.textContent();
      if (text?.includes(amazonOrderId)) {
        // Click track package
        const trackButton = await card.$('.track-package-button, a[href*="trackPackage"]');
        if (trackButton) {
          await trackButton.click();
          await this.page.waitForNavigation({ waitUntil: 'networkidle' });

          // Extract tracking number
          const trackingElement = await this.page.$('.tracking-number, [data-test-id="tracking-id"]');
          if (trackingElement) {
            const trackingText = await trackingElement.textContent();
            const trackingMatch = trackingText?.match(/([A-Z0-9]{10,})/);

            if (trackingMatch) {
              return trackingMatch[1];
            }
          }
        }
        break;
      }
    }

    throw new Error('Tracking number not available yet');
  }

  /**
   * Clear cart (cleanup)
   */
  async clearCart() {
    if (!this.page) throw new Error('Browser not launched');

    await this.goToCart();

    // Delete all items
    const deleteButtons = await this.page.$$('[data-action="delete"]');
    for (const button of deleteButtons) {
      await button.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Get current price from product page
   */
  async getCurrentPrice(): Promise<number> {
    if (!this.page) throw new Error('Browser not launched');

    const priceElement = await this.page.$(
      '.a-price[data-a-color="price"] .a-offscreen, #priceblock_ourprice, #priceblock_dealprice'
    );

    if (!priceElement) {
      throw new Error('Price not found on page');
    }

    const priceText = await priceElement.textContent();
    const priceMatch = priceText?.replace(/[^0-9]/g, '');

    if (!priceMatch) {
      throw new Error('Could not parse price');
    }

    return parseInt(priceMatch);
  }

  /**
   * Get estimated delivery date
   */
  async getEstimatedDelivery(): Promise<string | null> {
    if (!this.page) throw new Error('Browser not launched');

    const deliveryElement = await this.page.$(
      '#deliveryBlockMessage, #mir-layout-DELIVERY_BLOCK, [data-csa-c-delivery-time]'
    );

    if (!deliveryElement) {
      return null;
    }

    const deliveryText = await deliveryElement.textContent();
    return deliveryText?.trim() || null;
  }

  /**
   * Check if product has Prime shipping
   */
  async hasPrimeShipping(): Promise<boolean> {
    if (!this.page) throw new Error('Browser not launched');

    const primeElement = await this.page.$('.a-icon-prime, #primeLogoImage');
    return !!primeElement;
  }

  /**
   * Take screenshot (for debugging)
   */
  async screenshot(path: string) {
    if (!this.page) throw new Error('Browser not launched');
    await this.page.screenshot({ path, fullPage: true });
  }
}
