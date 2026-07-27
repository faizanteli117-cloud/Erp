import React from 'react';
import { X, QrCode, Copy, Check, Download } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface UPIQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  payeeName: string;
  upiId: string;
  invoiceNumber: string;
}

export const UPIQRCodeModal: React.FC<UPIQRCodeModalProps> = ({
  isOpen,
  onClose,
  amount,
  payeeName,
  upiId,
  invoiceNumber
}) => {
  const { formatCurrency } = useERP();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Payment for ' + invoiceNumber)}`;
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pay via UPI QR</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Scan with Google Pay, PhonePe, Paytm or BHIM
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
          <div className="bg-white p-3 rounded-xl shadow-md mb-4 border border-slate-100">
            <img src={qrCodeImage} alt="UPI Payment QR Code" className="w-48 h-48 object-contain" />
          </div>

          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Amount Payable</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatCurrency(amount)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Ref: {invoiceNumber}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">UPI ID</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{upiId}</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm transition-colors"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
