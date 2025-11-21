'use client';

import { useState } from 'react';
import { FileEdit, Package, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

type AdjustmentReason = 'DAMAGE' | 'LOST' | 'FOUND' | 'CORRECTION' | 'EXPIRED' | 'THEFT';
type AdjustmentType = 'INCREASE' | 'DECREASE';

type Adjustment = {
  id: string;
  skuCode: string;
  productName: string;
  location: string;
  type: AdjustmentType;
  quantity: number;
  reason: AdjustmentReason;
  notes?: string;
  adjustedBy: string;
  adjustedAt: string;
  approved: boolean;
};

export function AdjustmentsContent({ locale }: { locale: string }) {
  const [reasonFilter, setReasonFilter] = useState<AdjustmentReason | 'ALL'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock adjustment data
  const adjustments: Adjustment[] = [
    {
      id: 'ADJ-001',
      skuCode: 'WH-BT-001',
      productName: 'Wireless Bluetooth Headphones Pro',
      location: 'Own Warehouse - NJ',
      type: 'DECREASE',
      quantity: 5,
      reason: 'DAMAGE',
      notes: 'Water damage during storage, units unsellable',
      adjustedBy: 'Sarah Smith',
      adjustedAt: '2025-11-20T09:30:00Z',
      approved: true
    },
    {
      id: 'ADJ-002',
      skuCode: 'USB-C-003',
      productName: 'USB-C Fast Charging Cable 6ft',
      location: 'Amazon FBA - US East',
      type: 'INCREASE',
      quantity: 12,
      reason: 'FOUND',
      notes: 'Found during physical count, not previously recorded',
      adjustedBy: 'Mike Johnson',
      adjustedAt: '2025-11-19T14:15:00Z',
      approved: true
    },
    {
      id: 'ADJ-003',
      skuCode: 'MS-WL-005',
      productName: 'Wireless Gaming Mouse',
      location: 'ShipBob 3PL - Chicago',
      type: 'DECREASE',
      quantity: 3,
      reason: 'LOST',
      notes: 'Missing after inventory count, suspected theft',
      adjustedBy: 'Emily Chen',
      adjustedAt: '2025-11-19T11:00:00Z',
      approved: true
    },
    {
      id: 'ADJ-004',
      skuCode: 'KB-MK-004',
      productName: 'Mechanical Keyboard RGB',
      location: 'Own Warehouse - NJ',
      type: 'DECREASE',
      quantity: 8,
      reason: 'CORRECTION',
      notes: 'System error correction - actual count was lower',
      adjustedBy: 'Tom Wilson',
      adjustedAt: '2025-11-18T16:45:00Z',
      approved: true
    },
    {
      id: 'ADJ-005',
      skuCode: 'BT-SP-010',
      productName: 'Bluetooth Speaker Waterproof',
      location: 'Amazon FBA - US West',
      type: 'INCREASE',
      quantity: 20,
      reason: 'CORRECTION',
      notes: 'Receiving error - units were received but not recorded',
      adjustedBy: 'John Doe',
      adjustedAt: '2025-11-18T10:20:00Z',
      approved: true
    },
    {
      id: 'ADJ-006',
      skuCode: 'PD-CH-007',
      productName: 'Fast Charging Power Bank 20000mAh',
      location: 'Own Warehouse - NJ',
      type: 'DECREASE',
      quantity: 15,
      reason: 'EXPIRED',
      notes: 'Battery expiration date passed, disposed per safety policy',
      adjustedBy: 'Sarah Smith',
      adjustedAt: '2025-11-17T13:30:00Z',
      approved: true
    },
    {
      id: 'ADJ-007',
      skuCode: 'TP-SC-012',
      productName: 'Smartphone Tripod Stand',
      location: 'Amazon FBA - US East',
      type: 'DECREASE',
      quantity: 7,
      reason: 'THEFT',
      notes: 'Warehouse security incident, police report filed',
      adjustedBy: 'Mike Johnson',
      adjustedAt: '2025-11-16T08:00:00Z',
      approved: true
    },
  ];

  const filteredAdjustments = reasonFilter === 'ALL' 
    ? adjustments 
    : adjustments.filter(a => a.reason === reasonFilter);

  const getReasonBadge = (reason: AdjustmentReason) => {
    const config = {
      DAMAGE: { label: 'Damage', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
      LOST: { label: 'Lost', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
      FOUND: { label: 'Found', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      CORRECTION: { label: 'Correction', color: 'bg-blue-100 text-blue-700', icon: FileEdit },
      EXPIRED: { label: 'Expired', color: 'bg-purple-100 text-purple-700', icon: AlertTriangle },
      THEFT: { label: 'Theft', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
    };

    const { label, color, icon: Icon } = config[reason];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    totalAdjustments: adjustments.length,
    totalIncreases: adjustments.filter(a => a.type === 'INCREASE').reduce((sum, a) => sum + a.quantity, 0),
    totalDecreases: adjustments.filter(a => a.type === 'DECREASE').reduce((sum, a) => sum + a.quantity, 0),
    netChange: adjustments.reduce((sum, a) => sum + (a.type === 'INCREASE' ? a.quantity : -a.quantity), 0)
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">Total Adjustments</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalAdjustments}</div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
            <TrendingUp className="h-3 w-3" />
            Total Increases
          </div>
          <div className="text-2xl font-bold text-green-600">+{stats.totalIncreases}</div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
            <TrendingDown className="h-3 w-3" />
            Total Decreases
          </div>
          <div className="text-2xl font-bold text-red-600">-{stats.totalDecreases}</div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">Net Change</div>
          <div className={`text-2xl font-bold ${stats.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.netChange >= 0 ? '+' : ''}{stats.netChange}
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by Reason:</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value as AdjustmentReason | 'ALL')}
          >
            <option value="ALL">All Reasons</option>
            <option value="DAMAGE">Damage</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
            <option value="CORRECTION">Correction</option>
            <option value="EXPIRED">Expired</option>
            <option value="THEFT">Theft</option>
          </select>
        </div>

        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />
          Create Adjustment
        </button>
      </div>

      {/* Adjustments Table */}
      <div className="bg-surface rounded-card border border-gray-200 shadow-token-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Adjustment ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Adjusted By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdjustments.map((adjustment) => (
                <tr key={adjustment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium text-gray-900">{adjustment.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{adjustment.productName}</div>
                        <div className="text-xs text-gray-500">{adjustment.skuCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{adjustment.location}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {adjustment.type === 'INCREASE' ? (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        Increase
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                        <TrendingDown className="h-4 w-4" />
                        Decrease
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-semibold ${adjustment.type === 'INCREASE' ? 'text-green-600' : 'text-red-600'}`}>
                      {adjustment.type === 'INCREASE' ? '+' : '-'}{adjustment.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getReasonBadge(adjustment.reason)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{adjustment.adjustedBy}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">{formatDate(adjustment.adjustedAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAdjustments.length === 0 && (
          <div className="py-12 text-center">
            <FileEdit className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No adjustments found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {filteredAdjustments.some(a => a.notes) && (
        <div className="bg-surface rounded-card border border-gray-200 shadow-token-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Adjustment Notes</h3>
          <div className="space-y-2">
            {filteredAdjustments.filter(a => a.notes).slice(0, 3).map((adjustment) => (
              <div key={adjustment.id} className="flex gap-3 text-sm">
                <span className="font-mono text-gray-500">{adjustment.id}</span>
                <span className="text-gray-700">{adjustment.notes}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Adjustment Modal (simplified placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Adjustment</h3>
            <p className="text-sm text-gray-600 mb-4">Adjustment creation form would go here</p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
