import React, { useState } from 'react';
import { Building2, Plus, QrCode, Landmark, MapPin, Phone, Mail, CheckCircle2, Save } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const CompanyModule: React.FC = () => {
  const { activeCompany, companies, setActiveCompanyId, addWarehouse, addBranch } = useERP();
  const [activeTab, setActiveTab] = useState<'profile' | 'branches' | 'warehouses' | 'banks'>('profile');

  // Form states
  const [name, setName] = useState(activeCompany.name);
  const [legalName, setLegalName] = useState(activeCompany.legalName);
  const [gstin, setGstin] = useState(activeCompany.gstin);
  const [pan, setPan] = useState(activeCompany.pan);
  const [phone, setPhone] = useState(activeCompany.phone);
  const [email, setEmail] = useState(activeCompany.email);
  const [address, setAddress] = useState(activeCompany.address);
  const [upiId, setUpiId] = useState(activeCompany.upiId || '');
  const [bankName, setBankName] = useState(activeCompany.bankName || '');
  const [accountNumber, setAccountNumber] = useState(activeCompany.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(activeCompany.ifscCode || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modals
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [whName, setWhName] = useState('');
  const [whCode, setWhCode] = useState('');
  const [whAddress, setWhAddress] = useState('');
  const [whManager, setWhManager] = useState('');
  const [whPhone, setWhPhone] = useState('');

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [brName, setBrName] = useState('');
  const [brCode, setBrCode] = useState('');
  const [brAddress, setBrAddress] = useState('');
  const [brPhone, setBrPhone] = useState('');

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName) return;
    addWarehouse({
      name: whName,
      code: whCode || `WH-${Date.now().toString().slice(-3)}`,
      address: whAddress,
      managerName: whManager,
      contactPhone: whPhone
    });
    setWhName('');
    setWhCode('');
    setWhAddress('');
    setWhManager('');
    setWhPhone('');
    setIsWarehouseModalOpen(false);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brName) return;
    addBranch({
      name: brName,
      code: brCode || `BR-${Date.now().toString().slice(-3)}`,
      address: brAddress,
      phone: brPhone
    });
    setBrName('');
    setBrCode('');
    setBrAddress('');
    setBrPhone('');
    setIsBranchModalOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    activeCompany.name = name;
    activeCompany.legalName = legalName;
    activeCompany.gstin = gstin;
    activeCompany.pan = pan;
    activeCompany.phone = phone;
    activeCompany.email = email;
    activeCompany.address = address;
    activeCompany.upiId = upiId;
    activeCompany.bankName = bankName;
    activeCompany.accountNumber = accountNumber;
    activeCompany.ifscCode = ifscCode;

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Company & Warehouse Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure business legal details, branches, godowns, UPI & bank details
          </p>
        </div>

        {/* Company Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Active Entity:</span>
          <select
            value={activeCompany.id}
            onChange={(e) => setActiveCompanyId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'profile' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Company Profile & Tax
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'branches' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Branches ({activeCompany.branches.length})
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'warehouses' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Warehouses & Godowns ({activeCompany.warehouses.length})
        </button>
        <button
          onClick={() => setActiveTab('banks')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'banks' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          UPI & Bank Accounts
        </button>
      </div>

      {/* Tab 1: Profile & Tax Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xs">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Company profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Company Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Legal Registered Name</label>
              <input
                type="text"
                value={legalName}
                onChange={e => setLegalName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">PAN Number</label>
              <input
                type="text"
                value={pan}
                onChange={e => setPan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Business Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Business Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Registered Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </form>
      )}

      {/* Tab 2: Branches */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Company Branches</h3>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Branch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCompany.branches.map(br => (
              <div key={br.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{br.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 text-[10px] font-mono font-bold">
                    {br.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {br.address}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {br.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Warehouses */}
      {activeTab === 'warehouses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Godowns & Warehouses</h3>
            <button
              onClick={() => setIsWarehouseModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Warehouse / Godown
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCompany.warehouses.map(wh => (
              <div key={wh.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{wh.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-mono font-bold">
                    {wh.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {wh.address}
                </p>
                {wh.managerName && (
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Manager: <span className="text-slate-800 dark:text-slate-200">{wh.managerName}</span> ({wh.contactPhone})
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: UPI & Banks */}
      {activeTab === 'banks' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary UPI ID for Instant Payments</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="e.g. companyname@okicici"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="e.g. Silicon Valley Commercial Bank"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Account number"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">IFSC Code / Swift Code</label>
              <input
                type="text"
                value={ifscCode}
                onChange={e => setIfscCode(e.target.value)}
                placeholder="IFSC or SWIFT"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            Update Banking Details
          </button>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {isWarehouseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Warehouse / Godown</h3>
            <form onSubmit={handleCreateWarehouse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Warehouse Name *</label>
                <input
                  type="text"
                  required
                  value={whName}
                  onChange={e => setWhName(e.target.value)}
                  placeholder="e.g. Central Godown Unit 2"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Warehouse Code</label>
                  <input
                    type="text"
                    value={whCode}
                    onChange={e => setWhCode(e.target.value)}
                    placeholder="e.g. WH-02"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={whManager}
                    onChange={e => setWhManager(e.target.value)}
                    placeholder="Incharge Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={whPhone}
                  onChange={e => setWhPhone(e.target.value)}
                  placeholder="+91 Phone number"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Address / Location</label>
                <textarea
                  rows={2}
                  value={whAddress}
                  onChange={e => setWhAddress(e.target.value)}
                  placeholder="Plot / Industrial Area Address"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWarehouseModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Company Branch</h3>
            <form onSubmit={handleCreateBranch} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={brName}
                  onChange={e => setBrName(e.target.value)}
                  placeholder="e.g. Mumbai Regional Branch"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Branch Code</label>
                  <input
                    type="text"
                    value={brCode}
                    onChange={e => setBrCode(e.target.value)}
                    placeholder="e.g. BR-MUM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={brPhone}
                    onChange={e => setBrPhone(e.target.value)}
                    placeholder="+91 Phone"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Address</label>
                <textarea
                  rows={2}
                  value={brAddress}
                  onChange={e => setBrAddress(e.target.value)}
                  placeholder="Branch Address"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
