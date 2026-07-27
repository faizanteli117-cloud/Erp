import React, { useState } from 'react';
import {
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { StockTransaction } from '../../types';

export const InventoryModule: React.FC = () => {
  const {
    products,
    stockTransactions,
    adjustProductStock,
    formatCurrency,
    activeCompany
  } = useERP();

  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'audit'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Stock Adjustment Form State
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustType, setAdjustType] = useState<StockTransaction['type']>('Stock In');
  const [adjustReason, setAdjustReason] = useState('Stock Purchase');

  const lowStockItems = products.filter(p => p.currentStock <= p.minStockLevel);
  const totalValuation = products.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !adjustQty) return;

    const delta = adjustType === 'Stock In' || adjustType === 'Transfer' ? adjustQty : -adjustQty;
    adjustProductStock(selectedProductId, delta, adjustType, adjustReason);

    setIsAdjustModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Inventory & Warehouse Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stock In/Out, Godown Transfers, Physical Audit, Valuation & Reorder Alerts
          </p>
        </div>

        <button
          onClick={() => setIsAdjustModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Stock Adjustment / In-Out
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Asset Valuation</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalValuation)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Based on FIFO Purchase Price</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Active Stock Items</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {products.length} SKUs
          </div>
          <span className="text-[10px] text-emerald-500 mt-1 block font-semibold">Tracked across warehouses</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Reorder Alerts</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {lowStockItems.length} Low Stock
          </div>
          <span className="text-[10px] text-rose-500 mt-1 block font-semibold">Action required</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Stock Level Register
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'transactions' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Stock Movement Log ({stockTransactions.length})
        </button>
      </div>

      {/* Tab 1: Stock Register Table */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Warehouse Stock Availability</h3>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter stock by product..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50 dark:bg-slate-950/60">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">SKU / Barcode</th>
                  <th className="py-3 px-4 text-right">Purchase Price</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-right">Current Stock</th>
                  <th className="py-3 px-4 text-right">Total Asset Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(p => {
                    const isLow = p.currentStock <= p.minStockLevel;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{p.sku}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(p.purchasePrice)}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(p.retailPrice)}</td>
                        <td className="py-3 px-4 text-right font-extrabold text-sm">{p.currentStock} {p.unit}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                          {formatCurrency(p.currentStock * p.purchasePrice)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isLow ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}>
                            {isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Stock Movement Logs */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50 dark:bg-slate-950/60">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4">Reason / Ref</th>
                  <th className="py-3 px-4">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {stockTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                    <td className="py-3 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        tx.type === 'Stock In' ? 'bg-emerald-100 text-emerald-800' :
                        tx.type === 'Stock Out' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{tx.productName}</td>
                    <td className="py-3 px-4 text-right font-extrabold">{tx.quantity}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.reason}</td>
                    <td className="py-3 px-4 text-slate-400">{tx.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAdjustModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Record Stock Movement</h3>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.currentStock} {p.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Transaction Type</label>
                  <select
                    value={adjustType}
                    onChange={e => setAdjustType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Stock In">Stock In (+)</option>
                    <option value="Stock Out">Stock Out (-)</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Damage">Damage (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={adjustQty}
                    onChange={e => setAdjustQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason / Reference Notes</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. GRN-9021 or Damaged during transit"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
              >
                Apply Stock Movement
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
