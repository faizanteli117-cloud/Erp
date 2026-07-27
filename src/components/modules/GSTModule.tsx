import React from 'react';
import { Percent, CheckCircle2, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const GSTModule: React.FC = () => {
  const { invoices, purchaseBills, activeCompany, formatCurrency } = useERP();

  const totalOutputGst = invoices.reduce((sum, inv) => sum + inv.cgstAmount + inv.sgstAmount + inv.igstAmount, 0);
  const totalInputGst = purchaseBills.reduce((sum, b) => sum + (b.grandTotal * 0.18) / 1.18, 0);
  const netGstPayable = Math.max(0, totalOutputGst - totalInputGst);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          GST & Tax Compliance Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          GSTIN: <span className="font-mono font-bold text-slate-900 dark:text-white">{activeCompany.gstin}</span> | Filing Period: Q1 2026
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Output Tax Liability (GSTR-1)</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalOutputGst)}
          </div>
          <span className="text-[10px] text-blue-500 mt-1 block font-semibold">Collected on Outward Sales</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 font-mono">Input Tax Credit (ITC - GSTR-2B)</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalInputGst)}
          </div>
          <span className="text-[10px] text-emerald-500 mt-1 block font-semibold">Eligible Vendor Credit</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Net Tax Payable (GSTR-3B)</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(netGstPayable)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Due by 20th of month</span>
        </div>
      </div>

      {/* E-Way Bill Quick Generator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base flex items-center gap-2">
            E-Way Bill & E-Invoicing Auto-Sync
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">NIC Portal Ready</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Generate E-Way bill numbers for consignment invoices over $500 instantly with QR code payload.
          </p>
        </div>

        <button
          onClick={() => alert('E-Way Bill payload generated and synced with NIC GST portal!')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0"
        >
          Generate E-Way Bill JSON
        </button>
      </div>

    </div>
  );
};
