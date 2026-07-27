import React, { useState } from 'react';
import { Settings, Download, Database, ShieldCheck, CheckCircle2, RefreshCw, Trash2, Globe, Edit3, Save } from 'lucide-react';
import { useERP, currencies } from '../../context/ERPContext';

export const SettingsModule: React.FC = () => {
  const {
    resetToBlankERP,
    resetToDemoData,
    currentCurrency,
    setCurrentCurrency,
    updateCustomCurrencyConfig,
    exportDataJSON,
    importDataJSON
  } = useERP();

  const [backedUp, setBackedUp] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // Custom Currency Form
  const activeCurrencyConfig = currencies[currentCurrency] || {
    code: currentCurrency,
    symbol: '₹',
    name: 'Indian Rupee',
    rateAgainstUSD: 85.5,
    useIndianFormat: true
  };

  const [customSymbol, setCustomSymbol] = useState(activeCurrencyConfig.symbol);
  const [customCode, setCustomCode] = useState(activeCurrencyConfig.code);
  const [customName, setCustomName] = useState(activeCurrencyConfig.name);
  const [customRate, setCustomRate] = useState(activeCurrencyConfig.rateAgainstUSD);
  const [useIndianFormat, setUseIndianFormat] = useState(!!activeCurrencyConfig.useIndianFormat);
  const [currencySavedMsg, setCurrencySavedMsg] = useState(false);

  const handleSaveCustomCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomCurrencyConfig({
      code: customCode.toUpperCase(),
      symbol: customSymbol,
      name: customName,
      rateAgainstUSD: Number(customRate) || 1,
      useIndianFormat: useIndianFormat
    });
    setCurrencySavedMsg(true);
    setTimeout(() => setCurrencySavedMsg(false), 2500);
  };

  const handleClearToBlank = () => {
    if (confirm('Are you sure you want to start fresh? This will clear all existing products, invoices, stock, and customer data to make a completely blank ERP.')) {
      resetToBlankERP();
      setResetSuccessMsg('Database cleared! You now have a completely blank ERP workspace.');
      setTimeout(() => setResetSuccessMsg(''), 4000);
    }
  };

  const handleLoadSampleData = () => {
    if (confirm('Load sample demo data (products, invoices, parties, warehouses)?')) {
      resetToDemoData();
      setResetSuccessMsg('Demo sample dataset loaded successfully.');
      setTimeout(() => setResetSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          System Settings & Data Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Currency customization, Blank ERP mode, Database Backup & System Configurations
        </p>
      </div>

      {resetSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4" /> {resetSuccessMsg}
        </div>
      )}

      {/* ERP Mode: Blank vs Sample Data */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">ERP Database Mode</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose between starting with a completely blank database or loading demo sample data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-amber-500" /> Start Blank ERP (Clean Slate)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Clears all demo items, stock, parties, and transactions so you can enter your real business inventory and invoices from scratch.
              </p>
            </div>
            <button
              onClick={handleClearToBlank}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Start Fresh (Clear All Data to Blank)
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-500" /> Load Sample Demo Dataset
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Restores realistic pre-filled products, customers, suppliers, warehouses, and invoices for demoing or testing features.
              </p>
            </div>
            <button
              onClick={handleLoadSampleData}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-xs transition-colors"
            >
              Load Demo Sample Data
            </button>
          </div>
        </div>
      </div>

      {/* Editable Currency Settings */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Currency & Country Formatting</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure Indian Rupees (₹ INR) or customize currency symbol, code, and number format</p>
          </div>
        </div>

        {currencySavedMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-600 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Currency settings saved and applied globally!
          </div>
        )}

        <form onSubmit={handleSaveCustomCurrency} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Preset Currency</label>
              <select
                value={currentCurrency}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentCurrency(val);
                  const cfg = currencies[val];
                  if (cfg) {
                    setCustomCode(cfg.code);
                    setCustomSymbol(cfg.symbol);
                    setCustomName(cfg.name);
                    setCustomRate(cfg.rateAgainstUSD);
                    setUseIndianFormat(!!cfg.useIndianFormat);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                {Object.values(currencies).map(c => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={customSymbol}
                onChange={e => setCustomSymbol(e.target.value)}
                placeholder="e.g. ₹, $, €, £"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Currency Code</label>
              <input
                type="text"
                value={customCode}
                onChange={e => setCustomCode(e.target.value)}
                placeholder="e.g. INR, USD, AED"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Exchange Rate (vs USD)</label>
              <input
                type="number"
                step="any"
                value={customRate}
                onChange={e => setCustomRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="indianFormat"
              checked={useIndianFormat}
              onChange={e => setUseIndianFormat(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="indianFormat" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              Use Indian Number System Formatting (e.g. ₹ 1,00,000.00 with Lakhs/Crores)
            </label>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" /> Save Currency & Format Settings
          </button>
        </form>
      </div>

      {/* Backup & Restore JSON */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Local Data Backup & Disaster Recovery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Export or import JSON backup snapshot of all products, invoices, and ledgers</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={exportDataJSON}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" /> Download Backup (.json)
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          Full-Stack Express Server & Offline Persistence Active
        </div>
        <p className="text-xs text-slate-300">
          All data is persisted in browser storage and server API routes handle Gemini AI intelligence and file handling securely.
        </p>
      </div>

    </div>
  );
};

