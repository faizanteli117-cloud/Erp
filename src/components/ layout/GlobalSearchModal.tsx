import React, { useEffect, useState } from 'react';
import { Search, X, FileText, Package, Users, Receipt, Kanban, ArrowRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ActiveTab } from './Sidebar';

interface GlobalSearchModalProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ onNavigateTab }) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    products,
    invoices,
    parties,
    expenses,
    leads,
    formatCurrency
  } = useERP();

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = globalSearchQuery.trim().toLowerCase();

  const matchedProducts = q
    ? products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q))
    : [];

  const matchedInvoices = q
    ? invoices.filter(inv => inv.invoiceNumber.toLowerCase().includes(q) || inv.partyName.toLowerCase().includes(q))
    : [];

  const matchedParties = q
    ? parties.filter(p => p.name.toLowerCase().includes(q) || p.phone.includes(q) || (p.gstin && p.gstin.toLowerCase().includes(q)))
    : [];

  const matchedExpenses = q
    ? expenses.filter(e => e.payeeName.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
    : [];

  const matchedLeads = q
    ? leads.filter(l => l.contactName.toLowerCase().includes(q) || l.companyName.toLowerCase().includes(q) || l.title.toLowerCase().includes(q))
    : [];

  const totalResults = matchedProducts.length + matchedInvoices.length + matchedParties.length + matchedExpenses.length + matchedLeads.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search products, invoices, customers, expenses, CRM leads..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!q ? (
            <div className="py-8 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Type anything to search across the entire ApexERP database.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  "UltraBook"
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  "INV-2026-001"
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  "Acme"
                </span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p>No records found matching "{globalSearchQuery}"</p>
            </div>
          ) : (
            <>
              {/* Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Package className="w-3.5 h-3.5" />
                    Products ({matchedProducts.length})
                  </div>
                  <div className="space-y-1">
                    {matchedProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateTab('products');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">{p.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">SKU: {p.sku} | Barcode: {p.barcode}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.retailPrice)}</span>
                          <span className="text-[10px] text-emerald-500 block font-semibold">{p.currentStock} in stock</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {matchedInvoices.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    Invoices ({matchedInvoices.length})
                  </div>
                  <div className="space-y-1">
                    {matchedInvoices.map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          onNavigateTab('sales');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">
                            {inv.invoiceNumber} - {inv.partyName}
                          </span>
                          <span className="text-[10px] text-slate-500">Date: {inv.date} | Status: {inv.status}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(inv.grandTotal)}</span>
                          <span className="text-[10px] text-rose-500 block">Due: {formatCurrency(inv.balanceDue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parties */}
              {matchedParties.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Users className="w-3.5 h-3.5" />
                    Parties & Customers ({matchedParties.length})
                  </div>
                  <div className="space-y-1">
                    {matchedParties.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateTab('parties');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">{p.name}</span>
                          <span className="text-[10px] text-slate-500">{p.type} | Phone: {p.phone}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(p.currentBalance)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expenses */}
              {matchedExpenses.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Receipt className="w-3.5 h-3.5" />
                    Expenses ({matchedExpenses.length})
                  </div>
                  <div className="space-y-1">
                    {matchedExpenses.map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onNavigateTab('expenses');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">{e.payeeName} ({e.category})</span>
                          <span className="text-[10px] text-slate-500">{e.description}</span>
                        </div>
                        <span className="font-bold text-rose-500">{formatCurrency(e.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leads */}
              {matchedLeads.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Kanban className="w-3.5 h-3.5" />
                    CRM Leads ({matchedLeads.length})
                  </div>
                  <div className="space-y-1">
                    {matchedLeads.map(l => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onNavigateTab('crm');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">{l.title}</span>
                          <span className="text-[10px] text-slate-500">{l.companyName} | Stage: {l.stage}</span>
                        </div>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(l.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-400 flex items-center justify-between">
          <span>ApexERP Spotlight Search</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
