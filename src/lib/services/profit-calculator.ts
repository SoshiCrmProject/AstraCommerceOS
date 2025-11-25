/**
 * Profit Calculator Service
 * Calculates expected profit for dropshipping orders
 */

export interface ProfitCalculationInput {
  // Shopee order details
  shopeePrice: number;
  shopeeCommission: number; // Platform fee %
  shopeeShippingFee: number; // What customer paid
  
  // Amazon product details
  amazonPrice: number;
  amazonShipping: number; // Amazon shipping cost
  amazonTax: number; // Sales tax
  amazonPoints?: number; // Amazon points earned
  
  // Settings
  includeDomesticShipping: boolean;
  domesticShippingCost: number; // Warehouse → Shopee fulfillment center
  includeAmazonPoints: boolean;
}

export interface ProfitCalculationResult {
  shopeeRevenue: number; // What you receive from Shopee
  amazonCost: number; // What you pay to Amazon
  domesticShippingCost: number; // Domestic forwarding cost
  totalCost: number;
  grossProfit: number;
  netProfit: number; // After all fees
  profitMargin: number; // %
  breakdown: {
    shopeePrice: number;
    shopeeCommission: number;
    amazonPrice: number;
    amazonShipping: number;
    amazonTax: number;
    amazonPoints: number;
    domesticShipping: number;
  };
}

export class ProfitCalculator {
  /**
   * Calculate profit for a dropshipping order
   */
  static calculate(input: ProfitCalculationInput): ProfitCalculationResult {
    // Shopee revenue (what customer pays minus platform fees)
    const commissionAmount = input.shopeePrice * (input.shopeeCommission / 100);
    const shopeeRevenue = input.shopeePrice - commissionAmount;

    // Amazon cost
    const amazonProductCost = input.amazonPrice + input.amazonShipping + input.amazonTax;
    const amazonPointsValue = input.includeAmazonPoints && input.amazonPoints 
      ? input.amazonPoints 
      : 0;
    const amazonCost = amazonProductCost - amazonPointsValue;

    // Domestic shipping (warehouse to Shopee fulfillment center)
    const domesticShipping = input.includeDomesticShipping 
      ? input.domesticShippingCost 
      : 0;

    // Total costs
    const totalCost = amazonCost + domesticShipping;

    // Profits
    const grossProfit = shopeeRevenue - amazonProductCost;
    const netProfit = shopeeRevenue - totalCost;
    const profitMargin = (netProfit / input.shopeePrice) * 100;

    return {
      shopeeRevenue,
      amazonCost,
      domesticShippingCost: domesticShipping,
      totalCost,
      grossProfit,
      netProfit,
      profitMargin,
      breakdown: {
        shopeePrice: input.shopeePrice,
        shopeeCommission: commissionAmount,
        amazonPrice: input.amazonPrice,
        amazonShipping: input.amazonShipping,
        amazonTax: input.amazonTax,
        amazonPoints: amazonPointsValue,
        domesticShipping,
      },
    };
  }

  /**
   * Check if order meets profit requirements
   */
  static isEligible(
    calculation: ProfitCalculationResult,
    minProfit: number,
  ): boolean {
    return calculation.netProfit >= minProfit;
  }

  /**
   * Calculate Shopee commission (typical 2-5% + transaction fee)
   */
  static calculateShopeeCommission(price: number, category: string): number {
    // Simplified - actual rates vary by category and country
    const commissionRates: Record<string, number> = {
      'Electronics': 5,
      'Fashion': 4,
      'Home & Living': 3,
      'Health & Beauty': 4,
      'Baby & Toys': 3,
      'default': 3.5,
    };

    const rate = commissionRates[category] || commissionRates['default'];
    const commission = price * (rate / 100);
    const transactionFee = 0.50; // Flat fee per transaction
    
    return commission + transactionFee;
  }

  /**
   * Estimate Amazon tax based on state
   */
  static estimateAmazonTax(price: number, state: string): number {
    // Tax rates by state (simplified)
    const taxRates: Record<string, number> = {
      'CA': 7.25,
      'NY': 4.0,
      'TX': 6.25,
      'FL': 0, // No state income tax
      'WA': 6.5,
      // Add more states as needed
    };

    const rate = taxRates[state] || 6.0; // Default 6%
    return price * (rate / 100);
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Generate profit report
   */
  static generateReport(calculation: ProfitCalculationResult): string {
    const { breakdown, netProfit, profitMargin } = calculation;

    return `
Profit Calculation Report
=========================

Revenue:
  Shopee Sale Price:        ${this.formatCurrency(breakdown.shopeePrice)}
  Shopee Commission:       -${this.formatCurrency(breakdown.shopeeCommission)}
  ---
  Net Revenue:              ${this.formatCurrency(calculation.shopeeRevenue)}

Costs:
  Amazon Product:          -${this.formatCurrency(breakdown.amazonPrice)}
  Amazon Shipping:         -${this.formatCurrency(breakdown.amazonShipping)}
  Amazon Tax:              -${this.formatCurrency(breakdown.amazonTax)}
  Amazon Points:           +${this.formatCurrency(breakdown.amazonPoints)}
  Domestic Shipping:       -${this.formatCurrency(breakdown.domesticShipping)}
  ---
  Total Costs:             -${this.formatCurrency(calculation.totalCost)}

Profit:
  Gross Profit:             ${this.formatCurrency(calculation.grossProfit)}
  Net Profit:               ${this.formatCurrency(netProfit)}
  Profit Margin:            ${profitMargin.toFixed(2)}%
    `.trim();
  }
}
