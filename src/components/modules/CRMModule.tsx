import React, { useState } from 'react';
import { Kanban, Plus, Search, Phone, Mail, DollarSign, Calendar, Trash2, X } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { CRMLead } from '../../types';

export const CRMModule: React.FC = () => {
  const { leads, addLead, updateLeadStatus, deleteLead, formatCurrency } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState(12000);

  const stages: CRMLead['stage'][] = ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addLead({
      title,
      companyName,
      contactName,
      phone,
      email,
      value,
      stage: 'New Lead',
      source: 'Website Inquiry',
      assignedTo: 'Sales Team',
      followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    });

    setIsModalOpen(false);
    setTitle('');
    setCompanyName('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            CRM & Lead Sales Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage prospects, deal values, interaction logs & automated follow-ups
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Deal Lead
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage);
          const totalVal = stageLeads.reduce((sum, l) => sum + l.value, 0);

          return (
            <div key={stage} className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">{stage}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{formatCurrency(totalVal)}</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                  {stageLeads.length}
                </span>
              </div>

              {/* Deal Cards */}
              <div className="space-y-2 flex-1">
                {stageLeads.map(lead => (
                  <div key={lead.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs hover:shadow-md transition-all">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">{lead.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{lead.companyName}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(lead.value)}</span>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Stage Switcher */}
                    <select
                      value={lead.stage}
                      onChange={e => updateLeadStatus(lead.id, e.target.value as CRMLead['stage'])}
                      className="mt-2 w-full text-[10px] p-1 rounded bg-slate-100 dark:bg-slate-900 border text-slate-700 dark:text-slate-300"
                    >
                      {stages.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add CRM Lead Prospect</h3>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise ERP License Contract"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Estimated Value ($)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Save Deal Lead
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
