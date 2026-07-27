import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Printer,
  QrCode,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  X,
  CreditCard
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Invoice, InvoiceItem } from '../../types';

interface SalesModuleProps {
  onOpenPDFModal: (invoice: Invoice) => void;
  onOpenUPIModal: (invoiceNumber: string, amount: number, partyName: string) => void;
  onOpenBarcodeScanner: () => void;
}

export const SalesModule: React.FC<SalesModuleProps> = ({
  onOpenPDFModal,
  onOpenUPIModal,
  onOpenBarcodeScanner
}) => {
  const {
    invoices,
    parties,
    products,
    addInvoice,
    deleteInvoice,
    formatCurrency
  } = useERP();

  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Invoice State
  const [selectedPartyId, setSelectedPartyId] = useState(parties[0]?.id || '');
  const [invoiceType, setInvoiceType] = useState<Invoice['type']>('Tax Invoice');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || inv.partyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const addItemToInvoice = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const newItem: InvoiceItem = {
      id: `inv_item_${Date.now()}`,
      productId: p.id,
      productName: p.name,
      hsnCode: p.hsnCode,
      quantity: 1,
      unit: p.unit,
      unitPrice: p.retailPrice,
      discountPercentage: 0,
      taxRate: p.gstRate,
      taxAmount: (p.retailPrice * p.gstRate) / 100,
      totalAmount: p.retailPrice * (1 + p.gstRate / 100)
    };

    setInvoiceItems([...invoiceItems, newItem]);
  };

  const updateItemQty = (id: string, qty: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const taxAmount = (item.unitPrice * qty * item.taxRate) / 100;
        const totalAmount = item.unitPrice * qty + taxAmount;
        return { ...item, quantity: qty, taxAmount, totalAmount };
      }
      return item;
    }));
  };

  const removeItemFromInvoice = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalTax = invoiceItems.reduce((sum, item) => sum + item.taxAmount, 0);
  const discountVal = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal + totalTax - discountVal;

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceItems.length === 0) {
      alert('Please add at least one product item to the invoice.');
      return;
    }

    const party = parties.find(p => p.id === selectedPartyId) || parties[0];

    const created = addInvoice({
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: invoiceType,
      partyId: party.id,
      partyName: party.name,
      partyPhone: party.phone,
      partyGstin: party.gstin,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: invoiceItems,
      subtotal,
      totalDiscount: discountVal,
      cgstAmount: totalTax / 2,
      sgstAmount: totalTax / 2,
      igstAmount: 0,
      roundOff: 0,
      grandTotal,
      paidAmount: grandTotal,
      balanceDue: 0,
      status: 'Paid',
      paymentMethod: 'UPI'
    });

    setIsCreateModalOpen(false);
    setInvoiceItems([]);
    onOpenPDFModal(created);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sales & Billing Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tax Invoices, Quotations, Proforma, Delivery Challans & Credit Notes
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Invoice
        </button>
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice number or customer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50 dark:bg-slate-950/60">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Date / Due</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{inv.partyName}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(inv.grandTotal)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-rose-500">
                    {formatCurrency(inv.balanceDue)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onOpenPDFModal(inv)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
                        title="View & Print PDF Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenUPIModal(inv.invoiceNumber, inv.grandTotal, inv.partyName)}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                        title="Show Payment UPI QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Invoice Builder Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative my-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Sales Tax Invoice</h3>

            <form onSubmit={handleSaveInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer / Party</label>
                  <select
                    value={selectedPartyId}
                    onChange={e => setSelectedPartyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  >
                    {parties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Invoice Document Type</label>
                  <select
                    value={invoiceType}
                    onChange={e => setInvoiceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Tax Invoice">Tax Invoice</option>
                    <option value="Quotation">Quotation / Estimate</option>
                    <option value="Proforma Invoice">Proforma Invoice</option>
                    <option value="Delivery Challan">Delivery Challan</option>
                  </select>
                </div>
              </div>

              {/* Add Product Line Dropdown & Barcode trigger */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Add Product:</span>
                <select
                  onChange={e => {
                    if (e.target.value) {
                      addItemToInvoice(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-xs text-slate-900 dark:text-white"
                >
                  <option value="">Select item from inventory...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ${p.retailPrice}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={onOpenBarcodeScanner}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" /> Scan Barcode
                </button>
              </div>

              {/* Invoice Items Table */}
              {invoiceItems.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="p-2">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-right">GST %</th>
                        <th className="p-2 text-right">Total</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {invoiceItems.map(item => (
                        <tr key={item.id}>
                          <td className="p-2 font-bold text-slate-900 dark:text-white">{item.productName}</td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={e => updateItemQty(item.id, Number(e.target.value))}
                              className="w-14 px-1 py-0.5 rounded border text-center font-bold"
                            />
                          </td>
                          <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-2 text-right">{item.taxRate}%</td>
                          <td className="p-2 text-right font-bold">{formatCurrency(item.totalAmount)}</td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItemFromInvoice(item.id)}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary Calculation */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-xs space-y-1 text-right">
                <div>Subtotal: <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span></div>
                <div>GST Taxes: <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(totalTax)}</span></div>
                <div className="text-base font-black text-blue-600 dark:text-blue-400 pt-1 border-t">
                  Grand Total: {formatCurrency(grandTotal)}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Save Invoice & Print PDF
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
