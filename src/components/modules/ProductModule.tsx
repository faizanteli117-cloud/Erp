import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Barcode,
  QrCode,
  Tag,
  Boxes,
  Trash2,
  X,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Product } from '../../types';

export const ProductModule: React.FC = () => {
  const { products, addProduct, deleteProduct, formatCurrency } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [qrModalProduct, setQrModalProduct] = useState<Product | null>(null);

  // Form states for new product
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [type, setType] = useState<'Product' | 'Service'>('Product');
  const [category, setCategory] = useState('Electronics');
  const [unit, setUnit] = useState('Pcs');
  const [hsnCode, setHsnCode] = useState('84713010');
  const [gstRate, setGstRate] = useState(18);
  const [purchasePrice, setPurchasePrice] = useState(100);
  const [retailPrice, setRetailPrice] = useState(150);
  const [wholesalePrice, setWholesalePrice] = useState(135);
  const [dealerPrice, setDealerPrice] = useState(125);
  const [currentStock, setCurrentStock] = useState(20);
  const [minStockLevel, setMinStockLevel] = useState(5);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSku = sku.trim() || `SKU-${Date.now().toString().slice(-6)}`;
    const generatedBarcode = barcode.trim() || Math.floor(1000000000000 + Math.random() * 9000000000000).toString();

    addProduct({
      name,
      sku: generatedSku,
      barcode: generatedBarcode,
      type,
      category,
      unit,
      hsnCode,
      gstRate,
      purchasePrice,
      retailPrice,
      wholesalePrice,
      dealerPrice,
      currentStock,
      minStockLevel,
      maxStockLevel: minStockLevel * 10,
      reorderPoint: minStockLevel + 2,
      warehouseStocks: []
    });

    setName('');
    setSku('');
    setBarcode('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Products & Services Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage SKUs, Multiple Price Levels (Retail, Wholesale, Dealer), HSN & Barcodes
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs font-semibold">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search product by name, SKU or barcode..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(p => {
          const isLowStock = p.currentStock <= p.minStockLevel;
          return (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                      {p.category}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{p.name}</h3>
                  </div>
                  <button
                    onClick={() => setQrModalProduct(p)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    title="View QR & Barcode"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 space-y-1 mb-4 font-mono">
                  <p>SKU: <span className="font-bold text-slate-800 dark:text-slate-200">{p.sku}</span></p>
                  <p>Barcode: <span className="text-slate-700 dark:text-slate-300">{p.barcode}</span></p>
                  <p>HSN: <span className="text-slate-700 dark:text-slate-300">{p.hsnCode} ({p.gstRate}% GST)</span></p>
                </div>

                {/* Price Matrix */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center mb-4 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Retail</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.retailPrice)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Wholesale</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.wholesalePrice)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Dealer</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.dealerPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Stock Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <Boxes className="w-4 h-4 text-slate-400" />
                  <span className={`font-bold ${isLowStock ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                    {p.currentStock} {p.unit}
                  </span>
                  {isLowStock && <span className="text-[10px] text-rose-500 font-semibold">(Low Stock)</span>}
                </div>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative my-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Product / Service</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraBook Pro 15"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Barcode Number</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Kg">Kg</option>
                    <option value="Box">Box</option>
                    <option value="Mtr">Mtr</option>
                    <option value="Ltr">Ltr</option>
                    <option value="Hr">Hr</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">GST Rate (%)</label>
                  <select
                    value={gstRate}
                    onChange={e => setGstRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>

              {/* Price Tier Inputs */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    value={retailPrice}
                    onChange={e => setRetailPrice(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Wholesale ($)</label>
                  <input
                    type="number"
                    value={wholesalePrice}
                    onChange={e => setWholesalePrice(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Dealer Price ($)</label>
                  <input
                    type="number"
                    value={dealerPrice}
                    onChange={e => setDealerPrice(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={e => setCurrentStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Min Stock Alert Level</label>
                  <input
                    type="number"
                    value={minStockLevel}
                    onChange={e => setMinStockLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR & Barcode View Modal */}
      {qrModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setQrModalProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{qrModalProduct.name}</h3>
            <p className="text-xs text-slate-500 font-mono mb-4">SKU: {qrModalProduct.sku}</p>

            <div className="p-4 bg-white rounded-xl border border-slate-200 inline-block mb-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  `PRODUCT:${qrModalProduct.id}|BARCODE:${qrModalProduct.barcode}|PRICE:${qrModalProduct.retailPrice}`
                )}`}
                alt="Product QR"
                className="w-40 h-40 object-contain mx-auto"
              />
            </div>

            <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              Barcode: {qrModalProduct.barcode}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
