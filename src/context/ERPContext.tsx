import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  CurrencyCode,
  CurrencyConfig,
  Company,
  Branch,
  Warehouse,
  Party,
  Product,
  Invoice,
  PurchaseBill,
  StockTransaction,
  Expense,
  AccountHead,
  JournalEntry,
  BankAccount,
  Lead,
  Employee,
  DocumentRecord,
  SystemNotification,
  AICopilotMessage
} from '../types';
import {
  initialCompanies,
  initialParties,
  initialProducts,
  initialInvoices,
  initialPurchaseBills,
  initialExpenses,
  initialAccountHeads,
  initialJournalEntries,
  initialBankAccounts,
  initialLeads,
  initialEmployees,
  initialDocuments,
  initialNotifications
} from '../data/initialData';

export const currencies: Record<string, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', rateAgainstUSD: 85.5, useIndianFormat: true },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rateAgainstUSD: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rateAgainstUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rateAgainstUSD: 0.78 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED)', rateAgainstUSD: 3.67 },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal (SAR)', rateAgainstUSD: 3.75 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', rateAgainstUSD: 1.38 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', rateAgainstUSD: 1.52 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', rateAgainstUSD: 1.35 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', rateAgainstUSD: 155.0 },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (BDT)', rateAgainstUSD: 118.0 },
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee (PKR)', rateAgainstUSD: 278.0 },
  LKR: { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee (LKR)', rateAgainstUSD: 302.0 },
  NPR: { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee (NPR)', rateAgainstUSD: 136.5 },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit (MYR)', rateAgainstUSD: 4.65 },
  QAR: { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal (QAR)', rateAgainstUSD: 3.64 },
  KWD: { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar (KWD)', rateAgainstUSD: 0.31 },
  BHD: { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar (BHD)', rateAgainstUSD: 0.38 },
  OMR: { code: 'OMR', symbol: 'OR', name: 'Omani Rial (OMR)', rateAgainstUSD: 0.38 },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound (EGP)', rateAgainstUSD: 48.0 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand (ZAR)', rateAgainstUSD: 18.2 }
};

interface ERPContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  currentCurrency: CurrencyCode;
  setCurrentCurrency: (curr: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;
  updateCustomCurrencyConfig: (cfg: CurrencyConfig) => void;

  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  activeCompany: Company;

  activeBranchId: string;
  setActiveBranchId: (id: string) => void;

  activeWarehouseId: string;
  setActiveWarehouseId: (id: string) => void;

  companies: Company[];
  parties: Party[];
  products: Product[];
  invoices: Invoice[];
  purchaseBills: PurchaseBill[];
  stockTransactions: StockTransaction[];
  expenses: Expense[];
  accountHeads: AccountHead[];
  journalEntries: JournalEntry[];
  bankAccounts: BankAccount[];
  leads: Lead[];
  employees: Employee[];
  documents: DocumentRecord[];
  notifications: SystemNotification[];
  aiMessages: AICopilotMessage[];

  // CRUD & Handlers
  addInvoice: (inv: Omit<Invoice, 'id'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status'], paidAmount?: number) => void;
  deleteInvoice: (id: string) => void;

  addParty: (party: Omit<Party, 'id' | 'companyId'>) => Party;
  updateParty: (id: string, party: Partial<Party>) => void;
  deleteParty: (id: string) => void;

  addProduct: (product: Omit<Product, 'id' | 'companyId'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustProductStock: (productId: string, qtyDelta: number, type: StockTransaction['type'], reason?: string) => void;

  addPurchaseBill: (bill: Omit<PurchaseBill, 'id'>) => PurchaseBill;
  
  addExpense: (expense: Omit<Expense, 'id' | 'companyId'>) => Expense;
  updateExpenseStatus: (id: string, status: Expense['status']) => void;

  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'companyId'>) => JournalEntry;

  addLead: (lead: Omit<Lead, 'id' | 'companyId'>) => Lead;
  updateLeadStage: (id: string, stage: Lead['stage']) => void;

  addEmployee: (employee: Omit<Employee, 'id' | 'companyId'>) => Employee;
  markAttendance: (id: string, status: Employee['attendanceToday']) => void;

  addDocument: (doc: Omit<DocumentRecord, 'id' | 'companyId'>) => DocumentRecord;

  addWarehouse: (wh: { name: string; code: string; address: string; managerName?: string; contactPhone?: string }) => void;
  addBranch: (br: { name: string; code: string; address: string; phone: string }) => void;

  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  addAICopilotMessage: (msg: Omit<AICopilotMessage, 'id' | 'timestamp'>) => void;

  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;

  resetToBlankERP: () => void;
  resetToDemoData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('apex_theme') as 'dark' | 'light') || 'dark';
  });

  // Role
  const [currentRole, setCurrentRole] = useState<UserRole>('Business Owner');

  // Currency State
  const [currencyConfigs, setCurrencyConfigs] = useState<Record<string, CurrencyConfig>>(() => {
    const saved = localStorage.getItem('apex_currency_configs');
    return saved ? JSON.parse(saved) : currencies;
  });

  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    return localStorage.getItem('apex_currency') || 'INR';
  });

  // Active Company
  const [activeCompanyId, setActiveCompanyId] = useState<string>('comp_1');
  const [activeBranchId, setActiveBranchId] = useState<string>('br_1');
  const [activeWarehouseId, setActiveWarehouseId] = useState<string>('wh_1');

  // Entities state
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('apex_companies');
    return saved !== null ? JSON.parse(saved) : initialCompanies;
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem('apex_parties');
    return saved !== null ? JSON.parse(saved) : initialParties;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('apex_products');
    return saved !== null ? JSON.parse(saved) : initialProducts;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('apex_invoices');
    return saved !== null ? JSON.parse(saved) : initialInvoices;
  });

  const [purchaseBills, setPurchaseBills] = useState<PurchaseBill[]>(() => {
    const saved = localStorage.getItem('apex_purchase_bills');
    return saved !== null ? JSON.parse(saved) : initialPurchaseBills;
  });

  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(() => {
    const saved = localStorage.getItem('apex_stock_tx');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('apex_expenses');
    return saved !== null ? JSON.parse(saved) : initialExpenses;
  });

  const [accountHeads, setAccountHeads] = useState<AccountHead[]>(() => {
    const saved = localStorage.getItem('apex_account_heads');
    return saved !== null ? JSON.parse(saved) : initialAccountHeads;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('apex_journal_entries');
    return saved !== null ? JSON.parse(saved) : initialJournalEntries;
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('apex_bank_accounts');
    return saved !== null ? JSON.parse(saved) : initialBankAccounts;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('apex_leads');
    return saved !== null ? JSON.parse(saved) : initialLeads;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('apex_employees');
    return saved !== null ? JSON.parse(saved) : initialEmployees;
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem('apex_documents');
    return saved !== null ? JSON.parse(saved) : initialDocuments;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('apex_notifications');
    return saved !== null ? JSON.parse(saved) : initialNotifications;
  });

  const [aiMessages, setAiMessages] = useState<AICopilotMessage[]>([
    {
      id: 'welcome_ai',
      sender: 'ai',
      text: 'Hello! I am your Apex AI Copilot. I can help you generate invoices, manage stock, extract bill details, or configure settings for your business. How can I assist you today?',
      timestamp: 'Just now'
    }
  ]);

  // Global modals
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Sync theme to body class
  useEffect(() => {
    localStorage.setItem('apex_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync currency preference
  useEffect(() => {
    localStorage.setItem('apex_currency', currentCurrency);
    localStorage.setItem('apex_currency_configs', JSON.stringify(currencyConfigs));
  }, [currentCurrency, currencyConfigs]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('apex_companies', JSON.stringify(companies));
    localStorage.setItem('apex_parties', JSON.stringify(parties));
    localStorage.setItem('apex_products', JSON.stringify(products));
    localStorage.setItem('apex_invoices', JSON.stringify(invoices));
    localStorage.setItem('apex_purchase_bills', JSON.stringify(purchaseBills));
    localStorage.setItem('apex_expenses', JSON.stringify(expenses));
    localStorage.setItem('apex_journal_entries', JSON.stringify(journalEntries));
    localStorage.setItem('apex_leads', JSON.stringify(leads));
    localStorage.setItem('apex_employees', JSON.stringify(employees));
    localStorage.setItem('apex_documents', JSON.stringify(documents));
    localStorage.setItem('apex_notifications', JSON.stringify(notifications));
  }, [companies, parties, products, invoices, purchaseBills, expenses, journalEntries, leads, employees, documents, notifications]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  const updateCustomCurrencyConfig = (cfg: CurrencyConfig) => {
    setCurrencyConfigs(prev => ({
      ...prev,
      [cfg.code]: cfg
    }));
    setCurrentCurrency(cfg.code);
  };

  const formatCurrency = (amount: number): string => {
    const cfg = currencyConfigs[currentCurrency] || currencies[currentCurrency] || {
      code: currentCurrency,
      symbol: '₹',
      name: 'Indian Rupee',
      rateAgainstUSD: 85.5,
      useIndianFormat: true
    };
    const converted = amount * (cfg.rateAgainstUSD || 1);

    if (cfg.useIndianFormat || cfg.code === 'INR') {
      return `${cfg.symbol} ${new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(converted)}`;
    }

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: cfg.code,
        maximumFractionDigits: 2
      }).format(converted);
    } catch {
      return `${cfg.symbol} ${converted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  // CRUD Implementation
  const addInvoice = (invData: Omit<Invoice, 'id'>): Invoice => {
    const newInvoice: Invoice = {
      ...invData,
      id: `inv_${Date.now()}`
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // Update Product stock for Sales Invoice
    if (invData.type === 'Tax Invoice' || invData.type === 'Retail Invoice' || invData.type === 'Wholesale Invoice') {
      invData.items.forEach(item => {
        adjustProductStock(item.productId, -item.quantity, 'Stock Out', `Invoice ${newInvoice.invoiceNumber}`);
      });

      // Update Party current balance (receivable)
      if (invData.partyId) {
        setParties(prev => prev.map(p => {
          if (p.id === invData.partyId) {
            return {
              ...p,
              currentBalance: p.currentBalance + (newInvoice.grandTotal - newInvoice.paidAmount)
            };
          }
          return p;
        }));
      }
    }

    return newInvoice;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status'], paidAmount?: number) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const newPaid = paidAmount !== undefined ? paidAmount : (status === 'Paid' ? inv.grandTotal : inv.paidAmount);
        const newBalance = Math.max(0, inv.grandTotal - newPaid);
        return {
          ...inv,
          status,
          paidAmount: newPaid,
          balanceDue: newBalance
        };
      }
      return inv;
    }));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addParty = (partyData: Omit<Party, 'id' | 'companyId'>): Party => {
    const newParty: Party = {
      ...partyData,
      id: `party_${Date.now()}`,
      companyId: activeCompanyId
    };
    setParties(prev => [newParty, ...prev]);
    return newParty;
  };

  const updateParty = (id: string, partyData: Partial<Party>) => {
    setParties(prev => prev.map(p => p.id === id ? { ...p, ...partyData } : p));
  };

  const deleteParty = (id: string) => {
    setParties(prev => prev.filter(p => p.id !== id));
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'companyId'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: `prod_${Date.now()}`,
      companyId: activeCompanyId
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...prodData } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const adjustProductStock = (productId: string, qtyDelta: number, type: StockTransaction['type'], reason?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.currentStock + qtyDelta);
        return { ...p, currentStock: newStock };
      }
      return p;
    }));

    const prod = products.find(p => p.id === productId);
    if (prod) {
      const tx: StockTransaction = {
        id: `stx_${Date.now()}`,
        companyId: activeCompanyId,
        productId,
        productName: prod.name,
        type,
        quantity: Math.abs(qtyDelta),
        date: new Date().toISOString().split('T')[0],
        reason: reason || 'Manual adjustment',
        performedBy: currentRole
      };
      setStockTransactions(prev => [tx, ...prev]);
    }
  };

  const addPurchaseBill = (billData: Omit<PurchaseBill, 'id'>): PurchaseBill => {
    const newBill: PurchaseBill = {
      ...billData,
      id: `pb_${Date.now()}`
    };
    setPurchaseBills(prev => [newBill, ...prev]);

    // Increase stock for purchase bill
    billData.items.forEach(item => {
      adjustProductStock(item.productId, item.quantity, 'Stock In', `Purchase Bill ${newBill.billNumber}`);
    });

    // Update Vendor balance (payable)
    if (billData.supplierId) {
      setParties(prev => prev.map(p => {
        if (p.id === billData.supplierId) {
          return {
            ...p,
            currentBalance: p.currentBalance - (newBill.grandTotal - newBill.paidAmount)
          };
        }
        return p;
      }));
    }

    return newBill;
  };

  const addExpense = (expData: Omit<Expense, 'id' | 'companyId'>): Expense => {
    const newExpense: Expense = {
      ...expData,
      id: `exp_${Date.now()}`,
      companyId: activeCompanyId
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpenseStatus = (id: string, status: Expense['status']) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const addJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'companyId'>): JournalEntry => {
    const newJE: JournalEntry = {
      ...entryData,
      id: `je_${Date.now()}`,
      companyId: activeCompanyId
    };
    setJournalEntries(prev => [newJE, ...prev]);
    return newJE;
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'companyId'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      companyId: activeCompanyId
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  };

  const updateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'companyId'>): Employee => {
    const newEmp: Employee = {
      ...empData,
      id: `emp_${Date.now()}`,
      companyId: activeCompanyId
    };
    setEmployees(prev => [newEmp, ...prev]);
    return newEmp;
  };

  const markAttendance = (id: string, status: Employee['attendanceToday']) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, attendanceToday: status } : e));
  };

  const addDocument = (docData: Omit<DocumentRecord, 'id' | 'companyId'>): DocumentRecord => {
    const newDoc: DocumentRecord = {
      ...docData,
      id: `doc_${Date.now()}`,
      companyId: activeCompanyId
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addAICopilotMessage = (msg: Omit<AICopilotMessage, 'id' | 'timestamp'>) => {
    const newMsg: AICopilotMessage = {
      ...msg,
      id: `ai_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages(prev => [...prev, newMsg]);
  };

  const addWarehouse = (whData: { name: string; code: string; address: string; managerName?: string; contactPhone?: string }) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === activeCompanyId) {
        const newWh: Warehouse = {
          id: `wh_${Date.now()}`,
          companyId: activeCompanyId,
          ...whData
        };
        return {
          ...c,
          warehouses: [...c.warehouses, newWh]
        };
      }
      return c;
    }));
  };

  const addBranch = (brData: { name: string; code: string; address: string; phone: string }) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === activeCompanyId) {
        const newBr: Branch = {
          id: `br_${Date.now()}`,
          companyId: activeCompanyId,
          ...brData
        };
        return {
          ...c,
          branches: [...c.branches, newBr]
        };
      }
      return c;
    }));
  };

  const resetToBlankERP = () => {
    const blankCompanies: Company[] = [
      {
        id: 'comp_1',
        name: 'My Business Enterprise',
        legalName: 'My Business Enterprise Private Limited',
        gstin: '',
        pan: '',
        email: 'owner@mybusiness.com',
        phone: '+91 98765 43210',
        address: '101 Trade Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
        activeFinancialYear: '2025-26',
        branches: [{ id: 'br_1', companyId: 'comp_1', name: 'Main Branch', code: 'BR-MAIN', address: 'Main Office', phone: '+91 98765 43210' }],
        warehouses: [{ id: 'wh_1', companyId: 'comp_1', name: 'Main Warehouse / Godown', code: 'WH-MAIN', address: 'Godown No 1' }]
      }
    ];

    const blankNotifications: SystemNotification[] = [
      {
        id: 'welcome_blank',
        title: 'New Blank ERP Initialized',
        message: 'All sample demo data cleared. Your ERP database is blank and ready for your business.',
        type: 'system',
        timestamp: 'Just now',
        read: false
      }
    ];

    // Explicitly write blank dataset into localStorage first
    localStorage.clear();
    localStorage.setItem('apex_erp_mode', 'blank');
    localStorage.setItem('apex_companies', JSON.stringify(blankCompanies));
    localStorage.setItem('apex_parties', JSON.stringify([]));
    localStorage.setItem('apex_products', JSON.stringify([]));
    localStorage.setItem('apex_invoices', JSON.stringify([]));
    localStorage.setItem('apex_purchase_bills', JSON.stringify([]));
    localStorage.setItem('apex_stock_tx', JSON.stringify([]));
    localStorage.setItem('apex_expenses', JSON.stringify([]));
    localStorage.setItem('apex_journal_entries', JSON.stringify([]));
    localStorage.setItem('apex_bank_accounts', JSON.stringify([]));
    localStorage.setItem('apex_leads', JSON.stringify([]));
    localStorage.setItem('apex_employees', JSON.stringify([]));
    localStorage.setItem('apex_documents', JSON.stringify([]));
    localStorage.setItem('apex_notifications', JSON.stringify(blankNotifications));

    // Update React states
    setCompanies(blankCompanies);
    setParties([]);
    setProducts([]);
    setInvoices([]);
    setPurchaseBills([]);
    setStockTransactions([]);
    setExpenses([]);
    setJournalEntries([]);
    setBankAccounts([]);
    setLeads([]);
    setEmployees([]);
    setDocuments([]);
    setNotifications(blankNotifications);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    localStorage.setItem('apex_erp_mode', 'demo');
    localStorage.setItem('apex_companies', JSON.stringify(initialCompanies));
    localStorage.setItem('apex_parties', JSON.stringify(initialParties));
    localStorage.setItem('apex_products', JSON.stringify(initialProducts));
    localStorage.setItem('apex_invoices', JSON.stringify(initialInvoices));
    localStorage.setItem('apex_purchase_bills', JSON.stringify(initialPurchaseBills));
    localStorage.setItem('apex_stock_tx', JSON.stringify([]));
    localStorage.setItem('apex_expenses', JSON.stringify(initialExpenses));
    localStorage.setItem('apex_account_heads', JSON.stringify(initialAccountHeads));
    localStorage.setItem('apex_journal_entries', JSON.stringify(initialJournalEntries));
    localStorage.setItem('apex_bank_accounts', JSON.stringify(initialBankAccounts));
    localStorage.setItem('apex_leads', JSON.stringify(initialLeads));
    localStorage.setItem('apex_employees', JSON.stringify(initialEmployees));
    localStorage.setItem('apex_documents', JSON.stringify(initialDocuments));
    localStorage.setItem('apex_notifications', JSON.stringify(initialNotifications));

    setCompanies(initialCompanies);
    setParties(initialParties);
    setProducts(initialProducts);
    setInvoices(initialInvoices);
    setPurchaseBills(initialPurchaseBills);
    setStockTransactions([]);
    setExpenses(initialExpenses);
    setAccountHeads(initialAccountHeads);
    setJournalEntries(initialJournalEntries);
    setBankAccounts(initialBankAccounts);
    setLeads(initialLeads);
    setEmployees(initialEmployees);
    setDocuments(initialDocuments);
    setNotifications(initialNotifications);
  };

  const exportDataJSON = () => {
    const exportObject = {
      companies,
      parties,
      products,
      invoices,
      purchaseBills,
      expenses,
      accountHeads,
      journalEntries,
      bankAccounts,
      leads,
      employees,
      documents
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexERP_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.parties) setParties(parsed.parties);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.invoices) setInvoices(parsed.invoices);
      if (parsed.purchaseBills) setPurchaseBills(parsed.purchaseBills);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.accountHeads) setAccountHeads(parsed.accountHeads);
      if (parsed.journalEntries) setJournalEntries(parsed.journalEntries);
      if (parsed.leads) setLeads(parsed.leads);
      if (parsed.employees) setEmployees(parsed.employees);
      return true;
    } catch (e) {
      console.error('Failed to import ERP JSON backup:', e);
      return false;
    }
  };

  return (
    <ERPContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        currentCurrency,
        setCurrentCurrency,
        formatCurrency,
        updateCustomCurrencyConfig,
        activeCompanyId,
        setActiveCompanyId,
        activeCompany,
        activeBranchId,
        setActiveBranchId,
        activeWarehouseId,
        setActiveWarehouseId,
        companies,
        parties,
        products,
        invoices,
        purchaseBills,
        stockTransactions,
        expenses,
        accountHeads,
        journalEntries,
        bankAccounts,
        leads,
        employees,
        documents,
        notifications,
        aiMessages,
        addInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        addParty,
        updateParty,
        deleteParty,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock,
        addPurchaseBill,
        addExpense,
        updateExpenseStatus,
        addJournalEntry,
        addLead,
        updateLeadStage,
        addEmployee,
        markAttendance,
        addDocument,
        addWarehouse,
        addBranch,
        markNotificationRead,
        clearAllNotifications,
        addAICopilotMessage,
        globalSearchQuery,
        setGlobalSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isCopilotOpen,
        setIsCopilotOpen,
        resetToBlankERP,
        resetToDemoData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
