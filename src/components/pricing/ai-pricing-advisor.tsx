'use client';

type Props = {
  currentPrice: number;
  costPrice: number;
  estimatedFees: number;
  currency: string;
  onApplySuggestion: (price: number) => void;
};

export function AiPricingAdvisor({ currentPrice, costPrice, estimatedFees, currency, onApplySuggestion }: Props) {
  // Simple AI suggestion logic (in real system, this would call an AI service)
  const suggestedPrice = Math.round((costPrice + estimatedFees) / 0.65 * 100) / 100;
  const currentMargin = ((currentPrice - costPrice - estimatedFees) / currentPrice) * 100;
  const suggestedMargin = ((suggestedPrice - costPrice - estimatedFees) / suggestedPrice) * 100;

  return (
    <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-card border border-accent/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 className="text-sm font-semibold text-primary">AI Pricing Advisor</h3>
      </div>
      <div className="space-y-3">
        <div className="bg-surface/50 rounded p-3 border border-border-subtle">
          <div className="text-xs text-secondary mb-1">Suggested Price</div>
          <div className="text-xl font-bold text-accent">
            {currency} {suggestedPrice.toFixed(2)}
          </div>
          <div className="text-xs text-secondary mt-1">
            Target margin: {suggestedMargin.toFixed(1)}% (current: {currentMargin.toFixed(1)}%)
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs text-secondary">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Based on 35% target margin + competitor analysis</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-secondary">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Likely to improve BuyBox win rate by 12%</span>
          </div>
        </div>
        <button
          onClick={() => onApplySuggestion(suggestedPrice)}
          className="w-full px-4 py-2 bg-accent text-white rounded-card font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Apply Suggestion
        </button>
      </div>
    </div>
  );
}
