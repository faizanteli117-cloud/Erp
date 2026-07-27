import React, { useState } from 'react';
import { X, Barcode, Camera, Check, Search, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Product } from '../../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { products } = useERP();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleScanCode = (codeToSearch: string) => {
    const matched = products.find(
      p => p.barcode === codeToSearch.trim() || p.sku.toLowerCase() === codeToSearch.trim().toLowerCase()
    );

    if (matched) {
      setFoundProduct(matched);
      setErrorMsg('');
    } else {
      setFoundProduct(null);
      setErrorMsg(`No product found matching barcode/SKU: "${codeToSearch}"`);
    }
  };

  const handleConfirm = () => {
    if (foundProduct) {
      onSelectProduct(foundProduct);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Barcode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Barcode & SKU Scanner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scan product barcode to auto-fill into invoice</p>
          </div>
        </div>

        {/* Camera Simulation View */}
        <div className="relative bg-slate-950 rounded-xl overflow-hidden aspect-video mb-4 border border-slate-800 flex items-center justify-center text-center p-4">
          {isCameraActive ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="w-64 h-28 border-2 border-dashed border-emerald-400 rounded-lg relative flex items-center justify-center animate-pulse">
                <div className="absolute w-full h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-bounce"></div>
                <span className="text-xs text-emerald-300 font-mono">Aim camera at Barcode</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Camera stream active... Scanning barcode frame...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Camera className="w-10 h-10 text-slate-600 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Click below to activate device camera or enter code manually</p>
              <button
                onClick={() => setIsCameraActive(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                Enable Camera Scan
              </button>
            </div>
          )}
        </div>

        {/* Quick Demo Barcode Pickers */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Quick Demo Barcodes</span>
          <div className="flex flex-wrap gap-2">
            {products.slice(0, 3).map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setBarcodeInput(p.barcode);
                  handleScanCode(p.barcode);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono transition-colors"
              >
                {p.barcode} ({p.name.substring(0, 14)}...)
              </button>
            ))}
          </div>
        </div>

        {/* Manual Barcode Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter Barcode or SKU number..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScanCode(barcodeInput)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            onClick={() => handleScanCode(barcodeInput)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4" />
            Lookup
          </button>
        </div>

        {/* Scan Result */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {foundProduct && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 mb-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Scanned Item Found</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{foundProduct.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  SKU: <span className="font-mono font-semibold">{foundProduct.sku}</span> | Stock: {foundProduct.currentStock} {foundProduct.unit}
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">${foundProduct.retailPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-3 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              Add Product to Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
