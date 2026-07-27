import React, { useState } from 'react';
import { Calculator, Plus, ArrowUpRight, ArrowDownRight, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AccountingModule: React.FC = () => {
  const { chartOfAccounts, formatCurrency } = useERP();
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  const filteredAccounts = chartOfAccounts.filter(a => selectedGroup === 'All' || a.type === selectedGroup);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Double-Entry Accounting & Chart of Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            General Ledger Accounts, Journal Vouchers, Cash/Bank Books & Trial Balance
          </p>
        </div>

        <button
          onClick={() => alert('New Double-Entry Journal Voucher created!')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Journal Entry
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {['All', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              selectedGroup === group
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {group}s
          </button>
        ))}
      </div>

      {/* Chart of Accounts Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50 dark:bg-slate-950/60">
                <th className="py-3 px-4">Account Code</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Classification Group</th>
                <th className="py-3 px-4 text-right">Debit Balance</th>
                <th className="py-3 px-4 text-right">Credit Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredAccounts.map(acc => (
                <tr key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{acc.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{acc.name}</td>
                  <td className="py-3 px-4 text-slate-500 font-semibold">{acc.type}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    {acc.balanceType === 'Debit' ? formatCurrency(acc.balance) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    {acc.balanceType === 'Credit' ? formatCurrency(acc.balance) : '-'}
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
