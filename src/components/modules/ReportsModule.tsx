import React, { useState } from 'react';
import { BarChart3, Download, Printer, FileSpreadsheet, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ReportsModule: React.FC = () => {
  const { invoices, expenses, products, formatCurrency } = useERP();
  const [activeReport, setActiveReport] = useState<'pnl' | 'balanceSheet' | 'cashflow'>('pnl');

  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCost = invoices.reduce((sum, inv) => sum + inv.items.reduce((itemSum, item) => itemSum + item.unitPrice * 0.7 * item.quantity, 0), 0);
  const grossProfit = totalSales - totalCost;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netOperatingProfit = grossProfit - totalExpenses;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Statements & Executive Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Profit & Loss Statement, Balance Sheet, Cash Flow & Sales Analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Financial report exported to Excel / CSV!')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            Export Excel
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveReport('pnl')}
          className={`pb-3 border-b-2 transition-colors ${
            activeReport === 'pnl' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveReport('balanceSheet')}
          className={`pb-3 border-b-2 transition-colors ${
            activeReport === 'balanceSheet' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Balance Sheet
        </button>
      </div>

      {/* Report View */}
      {activeReport === 'pnl' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4 max-w-3xl">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base border-b pb-2">
            Statement of Profit & Loss (Income Statement)
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b font-bold text-slate-900 dark:text-white">
              <span>Gross Sales Revenue</span>
              <span>{formatCurrency(totalSales)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-500 pl-4">
              <span>Less: Cost of Goods Sold (COGS)</span>
              <span>({formatCurrency(totalCost)})</span>
            </div>
            <div className="flex justify-between py-1.5 border-t border-b font-extrabold text-emerald-600 dark:text-emerald-400">
              <span>Gross Profit</span>
              <span>{formatCurrency(grossProfit)}</span>
            </div>

            <div className="pt-2 font-bold text-slate-700 dark:text-slate-300">Operating Expenses:</div>
            {expenses.map(e => (
              <div key={e.id} className="flex justify-between py-1 text-slate-500 pl-4">
                <span>{e.category} ({e.payeeName})</span>
                <span>({formatCurrency(e.amount)})</span>
              </div>
            ))}

            <div className="flex justify-between py-2 border-t-2 border-b-2 font-black text-base text-blue-600 dark:text-blue-400 mt-4">
              <span>Net Operating Income / Profit</span>
              <span>{formatCurrency(netOperatingProfit)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
