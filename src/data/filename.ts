import {
  Company,
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
  SystemNotification
} from '../types';

export const initialCompanies: Company[] = [
  {
    id: 'comp_1',
    name: 'Apex Global Enterprises',
    legalName: 'Apex Global Enterprises Private Limited',
    gstin: '27AAACA123411Z5',
    pan: 'AAACA12341',
    email: 'contact@apexglobal.com',
    phone: '+1 (800) 555-0199',
    address: '742 Evergreen Terrace, Suite 400',
    city: 'San Francisco',
    state: 'California',
    pincode: '94107',
    country: 'United States',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    upiId: 'apexglobal@okbank',
    bankName: 'Silicon Valley Commercial Bank',
    accountNumber: '998877665544',
    ifscCode: 'SVCB0001024',
    branchName: 'Financial District',
    activeFinancialYear: '2025-2026',
    branches: [
      { id: 'br_1', companyId: 'comp_1', name: 'SF HQ Branch', code: 'SF01', address: '742 Evergreen Terrace', phone: '+1 800-555-0199' },
      { id: 'br_2', companyId: 'comp_1', name: 'New York Regional', code: 'NY02', address: '350 Fifth Avenue', phone: '+1 212-555-0188' }
    ],
    warehouses: [
      { id: 'wh_1', companyId: 'comp_1', name: 'Main Distribution Hub', code: 'WH-MAIN', address: 'Bay Logistics Park Block B', managerName: 'David Miller', contactPhone: '+1 555-0122' },
      { id: 'wh_2', companyId: 'comp_1', name: 'East Coast Transit Depot', code: 'WH-EAST', address: '99 Freight St, NJ', managerName: 'Sarah Jenkins', contactPhone: '+1 555-0133' }
    ]
  },
  {
    id: 'comp_2',
    name: 'Metro Retail & Trading',
    legalName: 'Metro Retailers Inc.',
    gstin: '07BBBCB567812Z9',
    pan: 'BBBCB56781',
    email: 'admin@metroretail.com',
    phone: '+1 (800) 555-0277',
    address: '120 Market Street',
    city: 'Chicago',
    state: 'Illinois',
    pincode: '60601',
    country: 'United States',
    upiId: 'metroretail@okbank',
    bankName: 'Chase Commercial',
    accountNumber: '112233445566',
    ifscCode: 'CHAS0004921',
    branchName: 'Downtown Chicago',
    activeFinancialYear: '2025-2026',
    branches: [
      { id: 'br_3', companyId: 'comp_2', name: 'Chicago Central', code: 'CHI01', address: '120 Market St', phone: '+1 800-555-0277' }
    ],
    warehouses: [
      { id: 'wh_3', companyId: 'comp_2', name: 'Midwest Central Godown', code: 'WH-MID', address: '45 Freight Highway', managerName: 'Robert Lang', contactPhone: '+1 555-0144' }
    ]
  }
];

export const initialParties: Party[] = [
  {
    id: 'party_1',
    companyId: 'comp_1',
    name: 'Acme Technologies LLC',
    type: 'Customer',
    phone: '+1 (415) 555-0142',
    email: 'billing@acmetech.com',
    gstin: '27AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    billingAddress: '100 Innovation Way, Palo Alto, CA 94301',
    shippingAddress: '100 Innovation Way, Palo Alto, CA 94301',
    creditLimit: 50000,
    currentBalance: 12450.00,
    openingBalance: 0,
    notes: 'Key Enterprise Client. Net 30 payment terms.',
    tags: ['Enterprise', 'Tech', 'VIP']
  },
  {
    id: 'party_2',
    companyId: 'comp_1',
    name: 'Global Microcircuits Corp',
    type: 'Supplier',
    phone: '+1 (408) 555-0189',
    email: 'orders@globalmicro.com',
    gstin: '27BBBBB1111B1Z2',
    pan: 'BBBBB1111B',
    billingAddress: '500 Semiconductor Blvd, San Jose, CA 95134',
    shippingAddress: '500 Semiconductor Blvd, San Jose, CA 95134',
    creditLimit: 100000,
    currentBalance: -18200.00, // Payable
    openingBalance: 0,
    notes: 'Primary hardware component vendor.',
    tags: ['Hardware Vendor', 'Direct Importer']
  },
  {
    id: 'party_3',
    companyId: 'comp_1',
    name: 'Horizon Retail Distributors',
    type: 'Dealer',
    phone: '+1 (312) 555-0190',
    email: 'supply@horizonretail.com',
    gstin: '07CCCCC2222C1Z8',
    pan: 'CCCCC2222C',
    billingAddress: '88 Michigan Avenue, Chicago, IL 60611',
    shippingAddress: '88 Michigan Avenue, Chicago, IL 60611',
    creditLimit: 75000,
    currentBalance: 8300.50,
    openingBalance: 0,
    notes: 'Wholesale dealer for Midwest territory.',
    tags: ['Dealer', 'Regional']
  },
  {
    id: 'party_4',
    companyId: 'comp_1',
    name: 'Starlight Architecture Studio',
    type: 'Architect',
    phone: '+1 (212) 555-0131',
    email: 'projects@starlightarch.com',
    gstin: '36DDDDD3333D1Z1',
    pan: 'DDDDD3333D',
    billingAddress: '450 Lexington Ave, New York, NY 10017',
    shippingAddress: '450 Lexington Ave, New York, NY 10017',
    creditLimit: 25000,
    currentBalance: 3200.00,
    openingBalance: 0,
    notes: 'Design contractor for commercial setups.',
    tags: ['Consultant', 'Project Partner']
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    companyId: 'comp_1',
    name: 'UltraBook Pro 15 - M3 Max',
    sku: 'LAP-UB15-M3',
    barcode: '8901234567890',
    type: 'Product',
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'ApexTech',
    unit: 'Pcs',
    hsnCode: '84713010',
    gstRate: 18,
    purchasePrice: 1250.00,
    retailPrice: 1899.00,
    wholesalePrice: 1650.00,
    dealerPrice: 1550.00,
    currentStock: 42,
    minStockLevel: 10,
    maxStockLevel: 100,
    reorderPoint: 15,
    warehouseStocks: [
      { warehouseId: 'wh_1', quantity: 30 },
      { warehouseId: 'wh_2', quantity: 12 }
    ],
    batchNumber: 'BAT-2026-01',
    expiryDate: '2028-12-31',
    description: 'High performance 15-inch workstation laptop with 32GB RAM & 1TB SSD.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'prod_2',
    companyId: 'comp_1',
    name: '4K Curved Monitor 32 Inch',
    sku: 'MON-4K32-CUR',
    barcode: '8901234567891',
    type: 'Product',
    category: 'Electronics',
    subcategory: 'Monitors',
    brand: 'ApexTech',
    unit: 'Pcs',
    hsnCode: '85285200',
    gstRate: 18,
    purchasePrice: 280.00,
    retailPrice: 499.00,
    wholesalePrice: 420.00,
    dealerPrice: 390.00,
    currentStock: 6, // Low stock!
    minStockLevel: 10,
    maxStockLevel: 80,
    reorderPoint: 12,
    warehouseStocks: [
      { warehouseId: 'wh_1', quantity: 4 },
      { warehouseId: 'wh_2', quantity: 2 }
    ],
    batchNumber: 'BAT-2026-02',
    description: 'Ergonomic 4K UHD 144Hz curved display with USB-C hub.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'prod_3',
    companyId: 'comp_1',
    name: 'Ergonomic Mesh Office Chair',
    sku: 'FUR-CHAIR-ERG',
    barcode: '8901234567892',
    type: 'Product',
    category: 'Furniture',
    subcategory: 'Office Chairs',
    brand: 'ErgoComfort',
    unit: 'Pcs',
    hsnCode: '94013000',
    gstRate: 18,
    purchasePrice: 110.00,
    retailPrice: 249.00,
    wholesalePrice: 195.00,
    dealerPrice: 175.00,
    currentStock: 35,
    minStockLevel: 8,
    maxStockLevel: 60,
    reorderPoint: 10,
    warehouseStocks: [
      { warehouseId: 'wh_1', quantity: 25 },
      { warehouseId: 'wh_2', quantity: 10 }
    ],
    description: 'Breathable mesh lumbar support executive chair.',
    imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'prod_4',
    companyId: 'comp_1',
    name: 'Enterprise ERP Implementation Service',
    sku: 'SRV-ERP-IMP',
    barcode: '8901234567893',
    type: 'Service',
    category: 'Software Services',
    unit: 'Hr',
    hsnCode: '998313',
    gstRate: 18,
    purchasePrice: 0,
    retailPrice: 150.00,
    wholesalePrice: 150.00,
    dealerPrice: 150.00,
    currentStock: 999,
    minStockLevel: 0,
    maxStockLevel: 9999,
    reorderPoint: 0,
    warehouseStocks: [],
    description: 'Professional technical setup, custom integration & training service per hour.'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv_101',
    companyId: 'comp_1',
    branchId: 'br_1',
    warehouseId: 'wh_1',
    invoiceNumber: 'INV-2026-001',
    type: 'Tax Invoice',
    partyId: 'party_1',
    partyName: 'Acme Technologies LLC',
    partyGstin: '27AAAAA0000A1Z5',
    partyPhone: '+1 (415) 555-0142',
    date: '2026-07-20',
    dueDate: '2026-08-19',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        productName: 'UltraBook Pro 15 - M3 Max',
        hsnCode: '84713010',
        quantity: 5,
        unit: 'Pcs',
        unitPrice: 1899.00,
        discountPercentage: 5,
        taxRate: 18,
        taxAmount: 1623.64,
        totalAmount: 10643.89
      },
      {
        id: 'item_2',
        productId: 'prod_2',
        productName: '4K Curved Monitor 32 Inch',
        hsnCode: '85285200',
        quantity: 3,
        unit: 'Pcs',
        unitPrice: 499.00,
        discountPercentage: 0,
        taxRate: 18,
        taxAmount: 269.46,
        totalAmount: 1766.46
      }
    ],
    subtotal: 10517.25,
    totalDiscount: 474.75,
    cgstAmount: 946.55,
    sgstAmount: 946.55,
    igstAmount: 0,
    roundOff: 0.10,
    grandTotal: 12410.35,
    paidAmount: 5000.00,
    balanceDue: 7410.35,
    status: 'Partially Paid',
    paymentMode: 'Bank Transfer',
    transactionRef: 'TRX-8820194',
    notes: 'Payment expected in 30 days.',
    terms: 'Goods once sold will not be taken back without authorization.',
    eWayBillNo: '281049201928',
    irnNo: 'a1b2c3d4e5f6g7h8i9j0123456789abcdef'
  },
  {
    id: 'inv_102',
    companyId: 'comp_1',
    branchId: 'br_1',
    warehouseId: 'wh_1',
    invoiceNumber: 'QTN-2026-042',
    type: 'Quotation',
    partyId: 'party_3',
    partyName: 'Horizon Retail Distributors',
    partyGstin: '07CCCCC2222C1Z8',
    partyPhone: '+1 (312) 555-0190',
    date: '2026-07-24',
    dueDate: '2026-08-08',
    items: [
      {
        id: 'item_3',
        productId: 'prod_3',
        productName: 'Ergonomic Mesh Office Chair',
        hsnCode: '94013000',
        quantity: 20,
        unit: 'Pcs',
        unitPrice: 175.00, // Dealer price
        discountPercentage: 2,
        taxRate: 18,
        taxAmount: 617.40,
        totalAmount: 4047.40
      }
    ],
    subtotal: 3430.00,
    totalDiscount: 70.00,
    cgstAmount: 308.70,
    sgstAmount: 308.70,
    igstAmount: 0,
    roundOff: 0,
    grandTotal: 4047.40,
    paidAmount: 0,
    balanceDue: 4047.40,
    status: 'Sent',
    notes: 'Special dealer volume rate quote valid for 15 days.'
  }
];

export const initialPurchaseBills: PurchaseBill[] = [
  {
    id: 'pb_201',
    companyId: 'comp_1',
    warehouseId: 'wh_1',
    billNumber: 'BILL-GMC-9021',
    vendorRefNo: 'INV-40192',
    type: 'Purchase Bill',
    supplierId: 'party_2',
    supplierName: 'Global Microcircuits Corp',
    date: '2026-07-15',
    dueDate: '2026-08-14',
    items: [
      {
        id: 'item_pb1',
        productId: 'prod_1',
        productName: 'UltraBook Pro 15 - M3 Max',
        hsnCode: '84713010',
        quantity: 10,
        unit: 'Pcs',
        unitPrice: 1250.00,
        discountPercentage: 0,
        taxRate: 18,
        taxAmount: 2250.00,
        totalAmount: 14750.00
      }
    ],
    subtotal: 12500.00,
    taxAmount: 2250.00,
    grandTotal: 14750.00,
    paidAmount: 14750.00,
    balanceDue: 0,
    status: 'Paid',
    paymentMode: 'Bank Transfer'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp_1',
    companyId: 'comp_1',
    category: 'Rent & Premises',
    amount: 4500.00,
    taxAmount: 0,
    date: '2026-07-01',
    payeeName: 'Bay Commerce Properties',
    paymentMode: 'Bank',
    status: 'Approved',
    description: 'Monthly office and distribution center lease',
    isRecurring: true,
    recurringInterval: 'Monthly'
  },
  {
    id: 'exp_2',
    companyId: 'comp_1',
    category: 'Utilities & Power',
    amount: 620.50,
    taxAmount: 55.80,
    date: '2026-07-12',
    payeeName: 'Pacific Gas & Electric',
    paymentMode: 'UPI',
    status: 'Approved',
    description: 'Electricity bill for SF Warehouse'
  },
  {
    id: 'exp_3',
    companyId: 'comp_1',
    category: 'Marketing & Ads',
    amount: 1850.00,
    taxAmount: 0,
    date: '2026-07-18',
    payeeName: 'Google Ads & Search',
    paymentMode: 'Card',
    status: 'Pending Approval',
    description: 'Q3 Product launch search campaign'
  }
];

export const initialAccountHeads: AccountHead[] = [
  { id: 'acc_101', code: '1000', name: 'Cash in Hand', category: 'Asset', subCategory: 'Current Asset', balance: 18450.00, isSystemDefault: true },
  { id: 'acc_102', code: '1010', name: 'Silicon Valley Commercial Bank', category: 'Asset', subCategory: 'Bank Account', balance: 142800.50, isSystemDefault: true },
  { id: 'acc_103', code: '1100', name: 'Accounts Receivable (Customers)', category: 'Asset', subCategory: 'Current Asset', balance: 23950.85, isSystemDefault: true },
  { id: 'acc_104', code: '1200', name: 'Inventory Stock Asset', category: 'Asset', subCategory: 'Inventory', balance: 88400.00, isSystemDefault: true },
  { id: 'acc_201', code: '2000', name: 'Accounts Payable (Vendors)', category: 'Liability', subCategory: 'Current Liability', balance: 18200.00, isSystemDefault: true },
  { id: 'acc_202', code: '2100', name: 'GST Output Payable', category: 'Liability', subCategory: 'Duties & Taxes', balance: 3120.40, isSystemDefault: true },
  { id: 'acc_301', code: '3000', name: 'Owners Capital Equity', category: 'Equity', subCategory: 'Equity', balance: 200000.00, isSystemDefault: true },
  { id: 'acc_401', code: '4000', name: 'Sales Revenue', category: 'Income', subCategory: 'Direct Income', balance: 84900.00, isSystemDefault: true },
  { id: 'acc_501', code: '5000', name: 'Cost of Goods Sold (COGS)', category: 'Expense', subCategory: 'Direct Expense', balance: 48000.00, isSystemDefault: true },
  { id: 'acc_502', code: '5100', name: 'Office Rent & Facility', category: 'Expense', subCategory: 'Indirect Expense', balance: 6970.50, isSystemDefault: true }
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'je_1',
    companyId: 'comp_1',
    voucherNumber: 'JV-2026-001',
    date: '2026-07-20',
    narration: 'Recording partial cash collection for INV-2026-001',
    lines: [
      { accountId: 'acc_102', accountName: 'Silicon Valley Commercial Bank', debit: 5000.00, credit: 0 },
      { accountId: 'acc_103', accountName: 'Accounts Receivable (Customers)', debit: 0, credit: 5000.00 }
    ],
    createdBy: 'Sarah Jenkins (Accountant)'
  }
];

export const initialBankAccounts: BankAccount[] = [
  {
    id: 'bank_1',
    companyId: 'comp_1',
    bankName: 'Silicon Valley Commercial Bank',
    accountNumber: '998877665544',
    ifscCode: 'SVCB0001024',
    branchName: 'Financial District',
    accountType: 'Current',
    openingBalance: 100000.00,
    currentBalance: 142800.50,
    upiId: 'apexglobal@okbank'
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead_1',
    companyId: 'comp_1',
    title: '50 Workstation Hardware Upgrade',
    contactName: 'Mark Higgins',
    companyName: 'NexGen Innovations Inc',
    phone: '+1 (415) 555-0922',
    email: 'mark@nexgen.io',
    value: 65000,
    stage: 'Proposal Sent',
    source: 'Website Contact',
    assignedTo: 'Alex Rivers',
    notes: 'Interested in UltraBook Pro and Ergonomic Chairs combo package.',
    lastFollowUp: '2026-07-22',
    nextFollowUp: '2026-07-28'
  },
  {
    id: 'lead_2',
    companyId: 'comp_1',
    title: 'Annual ERP Support Maintenance',
    contactName: 'Elena Rostova',
    companyName: 'Apex Capital Corp',
    phone: '+1 (212) 555-0391',
    email: 'elena@apexcap.com',
    value: 12000,
    stage: 'Negotiation',
    source: 'Referral',
    assignedTo: 'Alex Rivers',
    notes: 'Final contract review in progress.',
    lastFollowUp: '2026-07-24',
    nextFollowUp: '2026-07-27'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp_1',
    companyId: 'comp_1',
    name: 'Sarah Jenkins',
    role: 'Accountant',
    email: 'sarah.j@apexglobal.com',
    phone: '+1 555-0188',
    department: 'Finance',
    designation: 'Senior Lead Accountant',
    salary: 7500.00,
    joiningDate: '2023-03-15',
    status: 'Active',
    attendanceToday: 'Present'
  },
  {
    id: 'emp_2',
    companyId: 'comp_1',
    name: 'David Miller',
    role: 'Warehouse Manager',
    email: 'david.m@apexglobal.com',
    phone: '+1 555-0122',
    department: 'Logistics',
    designation: 'Head of Warehousing',
    salary: 6200.00,
    joiningDate: '2022-08-01',
    status: 'Active',
    attendanceToday: 'Present'
  },
  {
    id: 'emp_3',
    companyId: 'comp_1',
    name: 'Alex Rivers',
    role: 'Sales Executive',
    email: 'alex.r@apexglobal.com',
    phone: '+1 555-0199',
    department: 'Sales',
    designation: 'Enterprise Account Executive',
    salary: 5800.00,
    joiningDate: '2024-01-10',
    status: 'Active',
    attendanceToday: 'Present'
  }
];

export const initialDocuments: DocumentRecord[] = [
  {
    id: 'doc_1',
    companyId: 'comp_1',
    title: 'Global Microcircuits GRN & Invoice July 2026',
    category: 'Invoice',
    fileType: 'PDF',
    uploadDate: '2026-07-15',
    fileSize: '1.4 MB',
    uploadedBy: 'David Miller',
    ocrExtractedText: 'Vendor: Global Microcircuits Corp. Bill No: BILL-GMC-9021. Items: UltraBook Pro 15 (10 Pcs @ $1250). Total: $14,750.00.',
    tags: ['Vendor Bill', 'OCR Verified', 'Hardware']
  },
  {
    id: 'doc_2',
    companyId: 'comp_1',
    title: 'GSTR-3B Tax Filing Receipt Q1 2026',
    category: 'Tax Filing',
    fileType: 'PDF',
    uploadDate: '2026-07-10',
    fileSize: '820 KB',
    uploadedBy: 'Sarah Jenkins',
    tags: ['GST', 'Compliance', 'Approved']
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif_1',
    title: 'Low Stock Alert',
    message: 'Product "4K Curved Monitor 32 Inch" has fallen to 6 units (Below min threshold of 10).',
    type: 'stock',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Overdue Payment Reminder',
    message: 'Invoice INV-2026-001 for Acme Technologies has an outstanding balance of $7,410.35 due in 25 days.',
    type: 'payment',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif_3',
    title: 'Expense Approval Request',
    message: 'Alex Rivers submitted $1,850.00 Marketing Ads expense for approval.',
    type: 'approval',
    timestamp: 'Yesterday',
    read: true
  }
];
