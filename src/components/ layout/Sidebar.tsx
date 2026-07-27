import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  FileText,
  ShoppingBag,
  Calculator,
  Receipt,
  Percent,
  Kanban,
  FileCheck2,
  BarChart3,
  Settings,
  Building,
  Bell,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export type ActiveTab =
  | 'dashboard'
  | 'company'
  | 'parties'
  | 'products'
  | 'inventory'
  | 'sales'
  | 'purchase'
  | 'accounting'
  | 'expenses'
  | 'gst'
  | 'crm'
  | 'hr'
  | 'documents'
  | 'reports'
  | 'notifications'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const { currentRole, activeCompany } = useERP();

  const navGroups = [
    {
      title: 'CORE ERP',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'company', label: 'Company & Warehouses', icon: Building },
        { id: 'parties', label: 'Parties & Customers', icon: Users },
        { id: 'products', label: 'Products & Services', icon: Package }
      ]
    },
    {
      title: 'INVENTORY & TRANSACTIONS',
      items: [
        { id: 'inventory', label: 'Stock & Inventory', icon: Boxes },
        { id: 'sales', label: 'Sales & Invoices', icon: FileText },
        { id: 'purchase', label: 'Purchases & Bills', icon: ShoppingBag }
      ]
    },
    {
      title: 'FINANCE & COMPLIANCE',
      items: [
        { id: 'accounting', label: 'Accounting & Ledgers', icon: Calculator },
        { id: 'expenses', label: 'Expenses & Approvals', icon: Receipt },
        { id: 'gst', label: 'GST & E-Invoicing', icon: Percent }
      ]
    },
    {
      title: 'OPERATIONS & CRM',
      items: [
        { id: 'crm', label: 'CRM & Lead Pipeline', icon: Kanban },
        { id: 'hr', label: 'HR & Payroll', icon: Users },
        { id: 'documents', label: 'Document Vault', icon: FileCheck2 },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
        { id: 'settings', label: 'Settings & Backups', icon: Settings }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800 select-none">
      
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-md">
            A
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1">
              Apex<span className="text-blue-400">ERP</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 font-semibold border border-blue-800">
                AI
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{activeCompany.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map(group => (
          <div key={group.title}>
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
              {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as ActiveTab);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Active User Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs border border-slate-700">
            {currentRole.charAt(0)}
          </div>
          <div className="truncate flex-1">
            <span className="text-xs font-bold text-white block truncate">{currentRole}</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> System Verified
            </span>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          ></div>
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
