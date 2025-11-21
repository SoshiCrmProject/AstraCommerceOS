/**
 * Billing Settings Tab
 */

'use client';

import type { BillingSummary } from '@/lib/services/settings-types';
import { Download, CreditCard } from 'lucide-react';

type BillingSettingsProps = {
  billing: BillingSummary;
  dict: any;
};

export function BillingSettings({ billing, dict }: BillingSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{dict.billing.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{dict.billing.subtitle}</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{dict.billing.currentPlan}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{billing.currentPlan.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {dict.billing.monthlyPrice}: ¥{billing.currentPlan.pricePerMonth.toLocaleString()}/月
            </p>
            <p className="text-sm text-gray-600">
              {dict.billing.nextBillingDate}: {new Date(billing.nextBillingDate).toLocaleDateString()}
            </p>
          </div>
          <button className="px-4 py-2 bg-white text-blue-600 text-sm font-medium border border-blue-300 rounded-lg hover:bg-blue-50">
            {dict.billing.changePlan}
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{dict.billing.paymentMethod}</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
            <CreditCard className="w-4 h-4" />
            {dict.billing.updatePayment}
          </button>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <CreditCard className="w-6 h-6 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">•••• •••• •••• {billing.paymentMethod.last4}</p>
            <p className="text-xs text-gray-600">Expires {billing.paymentMethod.expiryMonth}/{billing.paymentMethod.expiryYear}</p>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{dict.billing.invoices}</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.billing.invoiceId}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.billing.date}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.billing.amount}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.billing.status}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.billing.download}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {billing.invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-900">{invoice.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">¥{invoice.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    invoice.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {dict.billing.invoiceStatus[invoice.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
