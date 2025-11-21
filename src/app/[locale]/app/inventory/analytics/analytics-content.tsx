'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, BarChart3, PieChart } from 'lucide-react';

export function AnalyticsContent({ locale }: { locale: string }) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock analytics data
  const turnoverRate = 4.2;
  const stockoutRate = 2.1;
  const overstockRate = 8.5;
  const inventoryAccuracy = 97.3;
  const avgDaysToSell = 45;
  const deadStockValue = 12450;

  const topMovers = [
    { sku: 'WH-BT-001', name: 'Wireless Headphones Pro', units: 1350, trend: 'up', change: '+28%' },
    { sku: 'USB-C-003', name: 'USB-C Cable 6ft', units: 1860, trend: 'up', change: '+42%' },
    { sku: 'TB-PT-007', name: 'Power Bank 20000mAh', units: 1560, trend: 'up', change: '+18%' },
    { sku: 'BT-SP-010', name: 'Bluetooth Speaker', units: 1140, trend: 'up', change: '+35%' },
    { sku: 'MS-WL-005', name: 'Gaming Mouse', units: 960, trend: 'up', change: '+12%' },
  ];

  const slowMovers = [
    { sku: 'KB-MK-004', name: 'Mechanical Keyboard RGB', units: 240, daysOnHand: 187 },
    { sku: 'LT-ST-008', name: 'Laptop Stand Aluminum', units: 180, daysOnHand: 210 },
    { sku: 'HD-ST-009', name: 'Headphone Stand RGB', units: 132, daysOnHand: 156 },
  ];

  const categoryBreakdown = [
    { category: 'Audio', value: 45, units: 4250, color: 'bg-blue-500' },
    { category: 'Accessories', value: 30, units: 2840, color: 'bg-green-500' },
    { category: 'Peripherals', value: 15, units: 1420, color: 'bg-purple-500' },
    { category: 'Storage', value: 10, units: 950, color: 'bg-orange-500' },
  ];

  const stockLevelTrends = [
    { week: 'Week 1', healthy: 42, low: 8, out: 2 },
    { week: 'Week 2', healthy: 44, low: 6, out: 1 },
    { week: 'Week 3', healthy: 40, low: 9, out: 3 },
    { week: 'Week 4', healthy: 45, low: 5, out: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeRange === '7d'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeRange === '30d'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeRange === '90d'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface rounded-card border border-gray-200 p-5 shadow-token-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Inventory Turnover Rate</span>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{turnoverRate}x</div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+0.3 vs last period</span>
          </div>
        </div>

        <div className="bg-surface rounded-card border border-gray-200 p-5 shadow-token-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Stockout Rate</span>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stockoutRate}%</div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            <span>-0.8% vs last period</span>
          </div>
        </div>

        <div className="bg-surface rounded-card border border-gray-200 p-5 shadow-token-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Overstock Rate</span>
            <Package className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{overstockRate}%</div>
          <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+1.2% vs last period</span>
          </div>
        </div>

        <div className="bg-surface rounded-card border border-gray-200 p-5 shadow-token-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Inventory Accuracy</span>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{inventoryAccuracy}%</div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+1.1% vs last period</span>
          </div>
        </div>

        <div className="bg-surface rounded-card border border-gray-200 p-5 shadow-token-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Avg Days to Sell</span>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{avgDaysToSell}</div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            <span>-3 days vs last period</span>
          </div>
        </div>

        <div className="bg-surface rounded-card border border-gray-200 p-5 shadow-token-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Dead Stock Value</span>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${deadStockValue.toLocaleString()}</div>
          <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+$850 vs last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movers */}
        <div className="bg-surface rounded-card border border-gray-200 shadow-token-md">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Movers ({timeRange})
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {topMovers.map((item, index) => (
                <div key={item.sku} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{item.units.toLocaleString()} units</div>
                    <div className="text-xs text-green-600 font-medium">{item.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slow Movers */}
        <div className="bg-surface rounded-card border border-gray-200 shadow-token-md">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Slow Movers
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {slowMovers.map((item) => (
                <div key={item.sku} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{item.units} units</div>
                    <div className="text-xs text-red-600">{item.daysOnHand} days on hand</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-surface rounded-card border border-gray-200 shadow-token-md">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-500" />
            Inventory by Category
          </h3>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-900 font-semibold">{cat.units.toLocaleString()} units</span>
                    <span className="text-sm text-gray-600">{cat.value}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${cat.color} transition-all`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Level Trends */}
      <div className="bg-surface rounded-card border border-gray-200 shadow-token-md">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Stock Level Trends</h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Period</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Healthy</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Low Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Out of Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stockLevelTrends.map((week) => (
                  <tr key={week.week} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{week.week}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {week.healthy} SKUs
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {week.low} SKUs
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {week.out} SKUs
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
