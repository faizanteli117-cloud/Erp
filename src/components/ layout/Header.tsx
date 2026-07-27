import React from 'react';
import {
  Search,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Building2,
  UserCheck,
  Globe2,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useERP, currencies } from '../../context/ERPContext';
import { UserRole, CurrencyCode } from '../../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    theme,
    toggleTheme,
    currentRole,
    setCurrentRole,
    currentCurrency,
    setCurrentCurrency,
    activeCompany,
    companies,
    setActiveCompanyId,
    setIsSearchOpen,
    setIsCopilotOpen,
    notifications
  } = useERP();

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: UserRole[] = [
    'Business Owner',
    'Super Admin',
    'Manager',
    'Sales Executive',
    'Warehouse Manager',
    'Accountant',
    'Cashier',
    'Auditor (Read Only)'
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between transition-colors">
      
      {/* Left Section: Mobile Menu & Company Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company Switcher */}
        <div className="relative group">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all cursor-pointer">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
                Company
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px] block leading-snug">
                {activeCompany.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Company Dropdown */}
          <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
              Switch Business Entity
            </div>
            {companies.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCompanyId(c.id)}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  c.id === activeCompany.id ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="truncate">{c.name}</span>
                {c.id === activeCompany.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-all hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search invoices, products, customers, expenses...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Section: Role, Currency, Theme, AI & Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Currency Switcher */}
        <select
          value={currentCurrency}
          onChange={(e) => setCurrentCurrency(e.target.value as CurrencyCode)}
          className="hidden sm:block px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
        >
          {Object.values(currencies).map(c => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>

        {/* User Role Switcher */}
        <div className="relative group hidden sm:block">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="truncate max-w-[100px]">{currentRole}</span>
          </div>
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
              Select Active Permission
            </div>
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setCurrentRole(r)}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  r === currentRole ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
          )}
        </button>

        {/* AI Copilot Button */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Copilot</span>
        </button>

      </div>
    </header>
  );
};
