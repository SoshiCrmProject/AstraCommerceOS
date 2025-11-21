/**
 * Amazon Headless Purchase Types
 * Defines interfaces for browser-based automated Amazon purchasing
 */

export type AmazonHeadlessPurchaseResult =
  | {
      ok: true;
      amazonOrderId: string;
      placedAt: string;
      totalPaid: number;
      pointsEarned: number;
    }
  | {
      ok: false;
      errorCode:
        | 'LOGIN_REQUIRED'
        | 'TWO_FACTOR_REQUIRED'
        | 'CART_FAILED'
        | 'CHECKOUT_FAILED'
        | 'DOM_CHANGED'
        | 'CAPTCHA'
        | 'OUT_OF_STOCK'
        | 'PRICE_CHANGED'
        | 'ADDRESS_INVALID'
        | 'PAYMENT_FAILED'
        | 'TIMEOUT'
        | 'UNKNOWN';
      errorMessage: string;
      screenshot?: string; // base64 screenshot for debugging
    };

export type AmazonHeadlessPurchaseRequest = {
  orgId: string;
  candidateId: string; // auto-fulfillment candidate ID
  amazonMarketplace: string; // 'AMAZON_JP', 'AMAZON_US', etc.
  asin: string;
  quantity: number;
  destinationAddressId: string; // refers to stored fulfillment warehouse address
  maxPriceThreshold?: number; // abort if price exceeds this
};

export type AmazonSessionConfig = {
  orgId: string;
  marketplace: string;
  sessionCookies: string; // encrypted session cookies
  lastValidated: string;
  accountEmail: string;
  twoFactorEnabled: boolean;
};

export type HeadlessPurchaseLog = {
  timestamp: string;
  step: 'INIT' | 'LOGIN' | 'ADD_TO_CART' | 'CHECKOUT' | 'CONFIRM' | 'COMPLETE' | 'ERROR';
  message: string;
  screenshot?: string;
  metadata?: Record<string, unknown>;
};
