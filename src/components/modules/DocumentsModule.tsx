import React, { useState } from 'react';
import { FileCheck2, Upload, Search, Download, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const DocumentsModule: React.FC = () => {
  const { businessDocuments, addDocument, deleteDocument } = useERP();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Document Vault & Audit Archives
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store GST certificates, contracts, vendor receipts, bank statements & tax filings
          </p>
        </div>

        <button
          onClick={() => {
            const title = prompt('Document Title:');
            if (title) {
              addDocument({
                title,
                category: 'Tax Filing',
                uploadDate: new Date().toISOString().split('T')[0],
                fileSize: '1.4 MB',
                fileType: 'PDF',
                url: '#'
              });
            }
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businessDocuments.map(doc => (
          <div key={doc.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.title}</h3>
                <span className="text-[10px] text-slate-500 font-semibold">{doc.category} • {doc.fileSize}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Uploaded {doc.uploadDate}</span>
              </div>
            </div>

            <button
              onClick={() => deleteDocument(doc.id)}
              className="text-slate-400 hover:text-rose-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
