import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, Trash2, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const PurchaseModule: React.FC = () => {
  const { purchaseBills, parties, formatCurrency } = useERP();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Purchase Bills & Vendor Orders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log Vendor Invoices, Purchase Orders, Debit Notes & Input Tax Credit
          </p>
        </div>

        <button
          onClick={() => alert('New Purchase Bill entry wizard launched!')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log Purchase Bill
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50 dark:bg-slate-950/60">
                <th className="py-3 px-4">Bill Number</th>
                <th className="py-3 px-4">Vendor Supplier</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Bill Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {purchaseBills.map(bill => (
                <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{bill.billNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{bill.partyName}</td>
                  <td className="py-3 px-4 text-slate-500">{bill.date}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(bill.grandTotal)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-rose-500">
                    {formatCurrency(bill.balanceDue)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
