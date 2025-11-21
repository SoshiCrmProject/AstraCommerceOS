'use client';

export function SentimentChart({ positive, neutral, negative, dict }: {
  positive: number;
  neutral: number;
  negative: number;
  dict: any;
}) {
  const total = positive + neutral + negative;
  const posPercent = (positive / total) * 100;
  const neuPercent = (neutral / total) * 100;
  const negPercent = (negative / total) * 100;

  return (
    <div className="space-y-4">
      {/* Simple Donut Chart */}
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Positive */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#10b981"
            strokeWidth="20"
            strokeDasharray={`${posPercent * 2.51} 251`}
            strokeDashoffset="0"
          />
          {/* Neutral */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#6b7280"
            strokeWidth="20"
            strokeDasharray={`${neuPercent * 2.51} 251`}
            strokeDashoffset={`-${posPercent * 2.51}`}
          />
          {/* Negative */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ef4444"
            strokeWidth="20"
            strokeDasharray={`${negPercent * 2.51} 251`}
            strokeDashoffset={`-${(posPercent + neuPercent) * 2.51}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">{dict.charts.total}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <LegendItem color="bg-green-500" label={dict.sentiment.positive} value={positive} percent={posPercent} />
        <LegendItem color="bg-gray-500" label={dict.sentiment.neutral} value={neutral} percent={neuPercent} />
        <LegendItem color="bg-red-500" label={dict.sentiment.negative} value={negative} percent={negPercent} />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value, percent }: {
  color: string;
  label: string;
  value: number;
  percent: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        <span className="text-xs text-gray-500">({percent.toFixed(0)}%)</span>
      </div>
    </div>
  );
}
