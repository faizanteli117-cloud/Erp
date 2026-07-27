export type UserRole = 
  | 'Super Admin'
  | 'Business Owner'
  | 'Manager'
  | 'Sales Executive'
  | 'Warehouse Manager'
  | 'Accountant'
  | 'Cashier'
  | 'Dealer'
  | 'Distributor'
  | 'Customer Portal'
  | 'Auditor (Read Only)';

export type CurrencyCode = string;

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rateAgainstUSD: number;
  useIndianFormat?: boolean;
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  logoUrl?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  branches: Branch[];
  warehouses: Warehouse[];
  activeFinancialYear: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  code: string;
  address: string;
  phone: string;
}

export interface Warehouse {
  id: string;
  companyId: string;
  name: string;
  code: string;
  address: string;
  managerName?: string;
  contactPhone?: string;
}

export type PartyType = 'Customer' | 'Supplier' | 'Dealer' | 'Distributor' | 'Contractor' | 'Architect' | 'Transporter';

export interface Party {
  id: string;
  companyId: string;
  name: string;
  type: PartyType;
  phone: string;
  email: string;
  gstin?: string;
  pan?: string;
  billingAddress: string;
  shippingAddress: string;
  creditLimit: number;
  currentBalance: number; // Positive = Receivable, Negative = Payable
  openingBalance: number;
  notes?: string;
  tags?: string[];
  documents?: { id: string; name: string; url: string; date: string }[];
  communicationLogs?: { id: string; type: 'WhatsApp' | 'Email' | 'SMS' | 'Call'; date: string; content: string }[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  priceModifier: number;
  stockQuantity: number;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  sku: string;
  barcode: string;
  type: 'Product' | 'Service';
  category: string;
  subcategory?: string;
  brand?: string;
  unit: string; // Pcs, Kg, Box, Mtr, Ltr, Hr
  hsnCode: string;
  gstRate: number; // 0, 5, 12, 18, 28
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  dealerPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  warehouseStocks: { warehouseId: string; quantity: number }[];
  variants?: ProductVariant[];
  batchNumber?: string;
  expiryDate?: string;
  serialNumbers?: string[];
  description?: string;
  imageUrl?: string;
}

export type InvoiceType = 
  | 'Tax Invoice'
  | 'Retail Invoice'
  | 'Wholesale Invoice'
  | 'Quotation'
  | 'Estimate'
  | 'Sales Order'
  | 'Proforma Invoice'
  | 'Delivery Challan'
  | 'Recurring Invoice'
  | 'Sales Return'
  | 'Credit Note';

export type PurchaseType =
  | 'Purchase Order'
  | 'Purchase Bill'
  | 'Purchase Return'
  | 'Debit Note';

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercentage: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  batchNumber?: string;
  serialNumber?: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  branchId?: string;
  warehouseId?: string;
  invoiceNumber: string;
  type: InvoiceType;
  partyId: string;
  partyName: string;
  partyGstin?: string;
  partyPhone?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled' | 'Approved';
  paymentMode?: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Credit';
  transactionRef?: string;
  notes?: string;
  terms?: string;
  eWayBillNo?: string;
  irnNo?: string;
  recurringFrequency?: 'Monthly' | 'Quarterly' | 'Yearly';
}

export interface PurchaseBill {
  id: string;
  companyId: string;
  warehouseId?: string;
  billNumber: string;
  vendorRefNo?: string;
  type: PurchaseType;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Pending' | 'Paid' | 'Partially Paid' | 'Returned';
  paymentMode?: string;
  notes?: string;
}

export interface StockTransaction {
  id: string;
  companyId: string;
  productId: string;
  productName: string;
  type: 'Stock In' | 'Stock Out' | 'Transfer' | 'Adjustment' | 'Damage';
  quantity: number;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  date: string;
  refNumber?: string;
  reason?: string;
  performedBy: string;
}

export interface Expense {
  id: string;
  companyId: string;
  category: string;
  amount: number;
  taxAmount: number;
  date: string;
  payeeName: string;
  paymentMode: 'Cash' | 'Bank' | 'UPI' | 'Card';
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  description: string;
  attachmentUrl?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}

export interface AccountHead {
  id: string;
  code: string;
  name: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  subCategory: string;
  balance: number;
  isSystemDefault?: boolean;
}

export interface JournalEntry {
  id: string;
  companyId: string;
  voucherNumber: string;
  date: string;
  narration: string;
  lines: {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
  createdBy: string;
}

export interface BankAccount {
  id: string;
  companyId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: 'Current' | 'Savings' | 'Overdraft';
  openingBalance: number;
  currentBalance: number;
  upiId?: string;
}

export interface Lead {
  id: string;
  companyId: string;
  title: string;
  contactName: string;
  companyName: string;
  phone: string;
  email: string;
  value: number;
  stage: 'New Lead' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  source: string;
  assignedTo: string;
  notes?: string;
  lastFollowUp?: string;
  nextFollowUp?: string;
}

export type CRMLead = Lead;

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  attendanceToday?: 'Present' | 'Absent' | 'Half Day' | 'On Leave';
  bankAccountDetails?: string;
}

export interface DocumentRecord {
  id: string;
  companyId: string;
  title: string;
  category: 'Invoice' | 'Receipt' | 'Contract' | 'Tax Filing' | 'Audit' | 'Other';
  fileType: string;
  uploadDate: string;
  fileSize: string;
  uploadedBy: string;
  ocrExtractedText?: string;
  tags: string[];
  url?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'stock' | 'payment' | 'approval' | 'system' | 'ai';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AICopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionData?: {
    type: 'create_invoice' | 'create_quotation' | 'reorder_suggestion' | 'insights' | 'communication';
    data: any;
  };
}
