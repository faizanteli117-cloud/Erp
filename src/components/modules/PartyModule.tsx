import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  FileText,
  Trash2,
  Edit2,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Party, PartyType } from '../../types';

export const PartyModule: React.FC = () => {
  const { parties, addParty, updateParty, deleteParty, formatCurrency } = useERP();
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [loadingAiMsg, setLoadingAiMsg] = useState(false);

  // Form states for new party
  const [name, setName] = useState('');
  const [type, setType] = useState<PartyType>('Customer');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState(25000);

  const filteredParties = parties.filter(p => {
    const matchesType = filterType === 'All' || p.type === filterType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.phone.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const handleCreateParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addParty({
      name,
      type,
      phone,
      email,
      gstin,
      pan,
      billingAddress,
      shippingAddress: billingAddress,
      creditLimit,
      currentBalance: 0,
      openingBalance: 0,
      tags: [type]
    });

    setName('');
    setPhone('');
    setEmail('');
    setGstin('');
    setBillingAddress('');
    setIsAddModalOpen(false);
  };

  const generateAiCommunication = async (party: Party) => {
    setSelectedParty(party);
    setIsMsgModalOpen(true);
    setLoadingAiMsg(true);

    try {
      const res = await fetch('/api/ai/generate-communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Payment Reminder & Statement',
          partyName: party.name,
          amount: formatCurrency(party.currentBalance),
          dueDate: 'Next 10 Days',
          invoiceNo: 'Latest Invoices'
        })
      });

      const json = await res.json();
      setCustomMsg(json.message || `Dear ${party.name}, friendly reminder regarding outstanding balance of ${formatCurrency(party.currentBalance)}.`);
    } catch (e) {
      setCustomMsg(`Dear ${party.name}, friendly reminder regarding your account balance of ${formatCurrency(party.currentBalance)}. Thank you for your business!`);
    } finally {
      setLoadingAiMsg(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!selectedParty) return;
    const cleanPhone = selectedParty.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMsg)}`;
    window.open(url, '_blank');
    setIsMsgModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Parties & Customer Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customers, Suppliers, Dealers, Contractors & Account Ledgers
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Party
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0 text-xs font-semibold">
          {['All', 'Customer', 'Supplier', 'Dealer', 'Contractor', 'Architect'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                filterType === t
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search party by name or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

      </div>

      {/* Parties Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50 dark:bg-slate-950/60">
                <th className="py-3 px-4">Party Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">GSTIN</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4 text-right">Outstanding Balance</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredParties.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">{p.name}</span>
                    <span className="text-[10px] text-slate-500">{p.billingAddress}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.type === 'Customer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400' :
                      p.type === 'Supplier' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400'
                    }`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {p.phone}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400"><Mail className="w-3 h-3" /> {p.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {p.gstin || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrency(p.creditLimit)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-sm">
                    <span className={p.currentBalance > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                      {formatCurrency(p.currentBalance)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => generateAiCommunication(p)}
                        className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-200 transition-colors"
                        title="AI WhatsApp Communication"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteParty(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Party"
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

      {/* Add New Party Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Party Entity</h3>

            <form onSubmit={handleCreateParty} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Party / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Party Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as PartyType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Architect">Architect</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={e => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0199"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    placeholder="27AAAAA0000A1Z5"
                    value={gstin}
                    onChange={e => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Billing Address</label>
                <textarea
                  rows={2}
                  placeholder="Street address, city, zipcode..."
                  value={billingAddress}
                  onChange={e => setBillingAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
              >
                Save Party Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI WhatsApp Message Composer Modal */}
      {isMsgModalOpen && selectedParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsMsgModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI WhatsApp Message</h3>
            </div>

            <p className="text-xs text-slate-500 mb-3">Generated message for {selectedParty.name}</p>

            <textarea
              rows={5}
              value={customMsg}
              onChange={e => setCustomMsg(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none mb-4"
            />

            <button
              onClick={handleSendWhatsApp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Open WhatsApp & Send
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
