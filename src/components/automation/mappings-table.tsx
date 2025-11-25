'use client';

import { useState, useEffect } from 'react';

interface Mapping {
  id: string;
  shopeeSku: string;
  shopeeProductId: string;
  amazonAsin: string;
  amazonUrl: string | null;
  mappingType: string;
  confidence: number;
  verificationStatus: string;
  isActive: boolean;
  lastVerified: string | null;
}

export default function MappingsTable({ dict }: { dict: any }) {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMapping, setNewMapping] = useState({
    shopeeSku: '',
    shopeeProductId: '',
    amazonAsin: '',
    amazonUrl: '',
    confidence: 1.0,
  });
  
  useEffect(() => {
    loadMappings();
  }, []);
  
  const loadMappings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/automation/mappings?isActive=true');
      if (res.ok) {
        const data = await res.json();
        setMappings(data.mappings);
      }
    } catch (error) {
      console.error('Failed to load mappings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = async () => {
    try {
      const res = await fetch('/api/automation/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMapping),
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setNewMapping({ shopeeSku: '', shopeeProductId: '', amazonAsin: '', amazonUrl: '', confidence: 1.0 });
        loadMappings();
      } else {
        alert('Failed to add mapping');
      }
    } catch (error) {
      console.error('Add mapping error:', error);
      alert('Failed to add mapping');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mapping?')) return;
    
    try {
      const res = await fetch(`/api/automation/mappings/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        loadMappings();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {dict.automation.mappings.addButton}
        </button>
      </div>
      
      {mappings.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{dict.automation.mappings.empty}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{dict.automation.mappings.emptyDescription}</p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.mappings.table.shopeeSku}</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.mappings.table.amazonAsin}</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.mappings.table.mappingType}</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.mappings.table.confidence}</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.mappings.table.status}</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.mappings.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                    {mapping.shopeeSku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <a
                      href={mapping.amazonUrl || `https://www.amazon.com/dp/${mapping.amazonAsin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                    >
                      {mapping.amazonAsin}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {dict.automation.mappings.mappingType[mapping.mappingType]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {(mapping.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      mapping.verificationStatus === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      mapping.verificationStatus === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {dict.automation.mappings.verificationStatus[mapping.verificationStatus]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(mapping.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      {dict.automation.mappings.actions.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {dict.automation.mappings.addModal.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dict.automation.mappings.addModal.shopeeSkuLabel}
                </label>
                <input
                  type="text"
                  value={newMapping.shopeeSku}
                  onChange={(e) => setNewMapping(prev => ({ ...prev, shopeeSku: e.target.value, shopeeProductId: e.target.value }))}
                  placeholder={dict.automation.mappings.addModal.shopeeSkuPlaceholder}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dict.automation.mappings.addModal.amazonAsinLabel}
                </label>
                <input
                  type="text"
                  value={newMapping.amazonAsin}
                  onChange={(e) => setNewMapping(prev => ({ ...prev, amazonAsin: e.target.value }))}
                  placeholder={dict.automation.mappings.addModal.amazonAsinPlaceholder}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dict.automation.mappings.addModal.amazonUrlLabel}
                </label>
                <input
                  type="url"
                  value={newMapping.amazonUrl}
                  onChange={(e) => setNewMapping(prev => ({ ...prev, amazonUrl: e.target.value }))}
                  placeholder={dict.automation.mappings.addModal.amazonUrlPlaceholder}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {dict.automation.mappings.addModal.cancelButton}
              </button>
              <button
                onClick={handleAdd}
                disabled={!newMapping.shopeeSku || !newMapping.amazonAsin}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dict.automation.mappings.addModal.saveButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
