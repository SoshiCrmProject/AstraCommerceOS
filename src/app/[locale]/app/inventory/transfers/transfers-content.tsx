'use client';

import { useState } from 'react';
import { ArrowRightLeft, Package, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

type TransferStatus = 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

type Transfer = {
  id: string;
  skuCode: string;
  productName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  status: TransferStatus;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  notes?: string;
};

export function TransfersContent({ locale }: { locale: string }) {
  const [statusFilter, setStatusFilter] = useState<TransferStatus | 'ALL'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock transfer data
  const transfers: Transfer[] = [
    {
      id: 'TRF-001',
      skuCode: 'WH-BT-001',
      productName: 'Wireless Bluetooth Headphones Pro',
      quantity: 100,
      fromLocation: 'Own Warehouse - NJ',
      toLocation: 'Amazon FBA - US West',
      status: 'COMPLETED',
      requestedBy: 'John Doe',
      requestedAt: '2025-11-18T10:30:00Z',
      completedAt: '2025-11-19T14:20:00Z',
      notes: 'Regular stock replenishment'
    },
    {
      id: 'TRF-002',
      skuCode: 'USB-C-003',
      productName: 'USB-C Fast Charging Cable 6ft',
      quantity: 200,
      fromLocation: 'Own Warehouse - NJ',
      toLocation: 'Amazon FBA - US East',
      status: 'IN_TRANSIT',
      requestedBy: 'Sarah Smith',
      requestedAt: '2025-11-19T08:00:00Z',
      notes: 'Urgent - Low stock alert'
    },
    {
      id: 'TRF-003',
      skuCode: 'MS-WL-005',
      productName: 'Wireless Gaming Mouse',
      quantity: 75,
      fromLocation: 'Amazon FBA - US East',
      toLocation: 'Amazon FBA - US West',
      status: 'PENDING',
      requestedBy: 'Mike Johnson',
      requestedAt: '2025-11-20T09:15:00Z',
      notes: 'Balancing stock levels between regions'
    },
    {
      id: 'TRF-004',
      skuCode: 'KB-MK-004',
      productName: 'Mechanical Keyboard RGB',
      quantity: 50,
      fromLocation: 'Own Warehouse - NJ',
      toLocation: 'ShipBob 3PL - Chicago',
      status: 'IN_TRANSIT',
      requestedBy: 'Emily Chen',
      requestedAt: '2025-11-19T11:45:00Z',
    },
    {
      id: 'TRF-005',
      skuCode: 'BT-SP-010',
      productName: 'Bluetooth Speaker Waterproof',
      quantity: 120,
      fromLocation: 'Amazon FBA - US West',
      toLocation: 'Amazon FBA - US East',
      status: 'CANCELLED',
      requestedBy: 'Tom Wilson',
      requestedAt: '2025-11-17T14:00:00Z',
      notes: 'Cancelled due to stock reallocation'
    },
  ];

  const filteredTransfers = statusFilter === 'ALL' 
    ? transfers 
    : transfers.filter(t => t.status === statusFilter);

  const getStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            <ArrowRightLeft className="h-3 w-3" />
            In Transit
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
    }
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
    pending: transfers.filter(t => t.status === 'PENDING').length,
    inTransit: transfers.filter(t => t.status === 'IN_TRANSIT').length,
    completed: transfers.filter(t => t.status === 'COMPLETED').length,
    totalQuantity: transfers.reduce((sum, t) => sum + t.quantity, 0)
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">Pending Transfers</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">In Transit</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">Total Units</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalQuantity.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TransferStatus | 'ALL')}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />
          Create Transfer
        </button>
      </div>

      {/* Transfers Table */}
      <div className="bg-surface rounded-card border border-gray-200 shadow-token-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Transfer ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Route</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Requested By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium text-gray-900">{transfer.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transfer.productName}</div>
                        <div className="text-xs text-gray-500">{transfer.skuCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-900">{transfer.quantity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-700">{transfer.fromLocation}</span>
                      <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-700">{transfer.toLocation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(transfer.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{transfer.requestedBy}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-600">
                      <div>Requested: {formatDate(transfer.requestedAt)}</div>
                      {transfer.completedAt && (
                        <div className="text-green-600">Completed: {formatDate(transfer.completedAt)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransfers.length === 0 && (
          <div className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No transfers found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Create Transfer Modal (simplified placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Transfer</h3>
            <p className="text-sm text-gray-600 mb-4">Transfer creation form would go here</p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
