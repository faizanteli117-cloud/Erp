import React, { useRef } from 'react';
import { X, Printer, Download, Share2, Send, CheckCircle2, QrCode } from 'lucide-react';
import { Invoice } from '../../types';
import { useERP } from '../../context/ERPContext';

interface PDFInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onShareWhatsApp?: (inv: Invoice) => void;
}

export const PDFInvoiceModal: React.FC<PDFInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onShareWhatsApp
}) => {
  const { activeCompany, formatCurrency } = useERP();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrUrl = activeCompany.upiId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
        `upi://pay?pa=${activeCompany.upiId}&pn=${encodeURIComponent(activeCompany.name)}&am=${invoice.balanceDue}&cu=INR&tn=${invoice.invoiceNumber}`
      )}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header Controls */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white text-base">
              {invoice.type} - {invoice.invoiceNumber}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' :
              invoice.status === 'Partially Paid' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' :
              'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
            }`}>
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onShareWhatsApp && (
              <button
                onClick={() => onShareWhatsApp(invoice)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                WhatsApp Invoice
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 font-sans leading-relaxed" ref={printRef}>
          {/* Top Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between border-b border-slate-200 pb-6 mb-6 gap-4">
            <div>
              {activeCompany.logoUrl ? (
                <img src={activeCompany.logoUrl} alt="Company Logo" className="h-12 object-contain mb-2" />
              ) : (
                <div className="text-2xl font-black text-slate-900 tracking-tight mb-1">{activeCompany.name}</div>
              )}
              <p className="text-xs text-slate-600 max-w-sm">{activeCompany.address}, {activeCompany.city}, {activeCompany.state} - {activeCompany.pincode}</p>
              <p className="text-xs text-slate-600 mt-0.5">Phone: {activeCompany.phone} | Email: {activeCompany.email}</p>
              {activeCompany.gstin && <p className="text-xs font-semibold text-slate-800 mt-1">GSTIN: {activeCompany.gstin}</p>}
            </div>

            <div className="sm:text-right">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">{invoice.type}</h1>
              <p className="text-sm font-bold text-slate-800 mt-1"># {invoice.invoiceNumber}</p>
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <p>Date: <span className="font-semibold text-slate-800">{invoice.date}</span></p>
                <p>Due Date: <span className="font-semibold text-slate-800">{invoice.dueDate}</span></p>
                {invoice.eWayBillNo && <p>E-Way Bill: <span className="font-mono text-slate-800">{invoice.eWayBillNo}</span></p>}
                {invoice.irnNo && <p>IRN: <span className="font-mono text-slate-800 text-[10px] break-all">{invoice.irnNo.substring(0, 24)}...</span></p>}
              </div>
            </div>
          </div>

          {/* Party Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Billed To (Customer)</span>
              <p className="text-sm font-bold text-slate-900">{invoice.partyName}</p>
              <p className="text-slate-600 mt-0.5">{invoice.partyPhone}</p>
              {invoice.partyGstin && <p className="font-semibold text-slate-800 mt-1">GSTIN: {invoice.partyGstin}</p>}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Payment Status</span>
              <p className="text-sm font-bold text-slate-900">{invoice.status}</p>
              <p className="text-slate-600 mt-0.5">Payment Mode: {invoice.paymentMode || 'N/A'}</p>
              {invoice.transactionRef && <p className="text-slate-600">Ref: {invoice.transactionRef}</p>}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse mb-6">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Item & Description</th>
                <th className="py-2.5 px-2">HSN</th>
                <th className="py-2.5 px-2 text-right">Qty</th>
                <th className="py-2.5 px-2 text-right">Rate</th>
                <th className="py-2.5 px-2 text-right">GST</th>
                <th className="py-2.5 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-2 text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-2 font-medium text-slate-900">
                    {item.productName}
                    {item.batchNumber && <span className="block text-[10px] text-slate-400">Batch: {item.batchNumber}</span>}
                  </td>
                  <td className="py-2.5 px-2 text-slate-600">{item.hsnCode}</td>
                  <td className="py-2.5 px-2 text-right font-medium">{item.quantity} {item.unit}</td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2.5 px-2 text-right">{item.taxRate}%</td>
                  <td className="py-2.5 px-2 text-right font-bold text-slate-900">{formatCurrency(item.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Totals & Bank details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-4">
              {activeCompany.bankName && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs mb-1">Bank Transfer Details</span>
                  <p className="text-slate-600">Bank: <span className="font-semibold text-slate-800">{activeCompany.bankName}</span></p>
                  <p className="text-slate-600">A/C No: <span className="font-semibold text-slate-800">{activeCompany.accountNumber}</span></p>
                  <p className="text-slate-600">IFSC Code: <span className="font-semibold text-slate-800">{activeCompany.ifscCode}</span></p>
                </div>
              )}

              {qrUrl && invoice.balanceDue > 0 && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <img src={qrUrl} alt="UPI QR" className="w-16 h-16 object-contain" />
                  <div>
                    <span className="font-bold text-emerald-900 block text-xs">Scan & Pay via UPI</span>
                    <p className="text-[11px] text-emerald-700">UPI ID: {activeCompany.upiId}</p>
                    <p className="text-[11px] font-bold text-emerald-800 mt-0.5">Payable: {formatCurrency(invoice.balanceDue)}</p>
                  </div>
                </div>
              )}

              {invoice.terms && (
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Terms & Conditions:</span>
                  <p className="text-slate-500 text-[10px] mt-0.5">{invoice.terms}</p>
                </div>
              )}
            </div>

            <div className="space-y-1.5 self-end text-right">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-800">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 text-xs">
                  <span>Total Discount:</span>
                  <span className="font-medium">-{formatCurrency(invoice.totalDiscount)}</span>
                </div>
              )}
              {invoice.cgstAmount > 0 && (
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>CGST:</span>
                  <span className="font-medium text-slate-800">{formatCurrency(invoice.cgstAmount)}</span>
                </div>
              )}
              {invoice.sgstAmount > 0 && (
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>SGST:</span>
                  <span className="font-medium text-slate-800">{formatCurrency(invoice.sgstAmount)}</span>
                </div>
              )}
              {invoice.igstAmount > 0 && (
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>IGST:</span>
                  <span className="font-medium text-slate-800">{formatCurrency(invoice.igstAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-900 pt-2 mt-2">
                <span>Grand Total:</span>
                <span>{formatCurrency(invoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs pt-1">
                <span>Paid Amount:</span>
                <span className="font-medium text-emerald-600">{formatCurrency(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Balance Due:</span>
                <span className={invoice.balanceDue > 0 ? 'text-rose-600' : 'text-slate-800'}>
                  {formatCurrency(invoice.balanceDue)}
                </span>
              </div>

              {/* Authorized Stamp Sign */}
              <div className="pt-8 text-center mt-6">
                <div className="h-10 border-b border-slate-300 w-48 ml-auto mb-1"></div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Authorized Signatory</span>
                <p className="text-[10px] text-slate-400">{activeCompany.name}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
