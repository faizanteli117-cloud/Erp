import React, { useState, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Upload,
  FileCheck,
  Bot,
  User,
  Globe,
  PlusCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Invoice, InvoiceItem } from '../../types';

interface AICopilotModalProps {
  onInvoiceGenerated?: (draft: Partial<Invoice>) => void;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ onInvoiceGenerated }) => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    aiMessages,
    addAICopilotMessage,
    activeCompany,
    products,
    parties,
    invoices,
    expenses,
    addInvoice,
    formatCurrency
  } = useERP();

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedLang, setSelectedLang] = useState<'English' | 'Hindi' | 'Urdu'>('English');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isCopilotOpen) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    addAICopilotMessage({ sender: 'user', text });
    setInputPrompt('');
    setIsLoading(true);

    try {
      const erpContext = {
        companyName: activeCompany.name,
        totalProducts: products.length,
        totalInvoices: invoices.length,
        partiesCount: parties.length,
        availableProducts: products.map(p => ({ name: p.name, price: p.retailPrice, stock: p.currentStock })),
        availableCustomers: parties.map(p => ({ name: p.name, type: p.type }))
      };

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          language: selectedLang,
          contextData: erpContext
        })
      });

      const data = await res.json();
      addAICopilotMessage({ sender: 'ai', text: data.text || 'Response received.' });

      // Check if prompt was an invoice creation command
      if (text.toLowerCase().includes('create invoice') || text.toLowerCase().includes('invoice for')) {
        // Auto-match party and products if present in query
        const partyMatch = parties.find(p => text.toLowerCase().includes(p.name.toLowerCase()));
        const itemMatch = products.find(p => text.toLowerCase().includes(p.name.toLowerCase()));

        if (partyMatch && itemMatch) {
          const draftInv: Partial<Invoice> = {
            invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
            type: 'Tax Invoice',
            partyId: partyMatch.id,
            partyName: partyMatch.name,
            partyPhone: partyMatch.phone,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            items: [
              {
                id: `item_ai_${Date.now()}`,
                productId: itemMatch.id,
                productName: itemMatch.name,
                hsnCode: itemMatch.hsnCode,
                quantity: 1,
                unit: itemMatch.unit,
                unitPrice: itemMatch.retailPrice,
                discountPercentage: 0,
                taxRate: itemMatch.gstRate,
                taxAmount: (itemMatch.retailPrice * itemMatch.gstRate) / 100,
                totalAmount: itemMatch.retailPrice * (1 + itemMatch.gstRate / 100)
              }
            ],
            subtotal: itemMatch.retailPrice,
            totalDiscount: 0,
            cgstAmount: (itemMatch.retailPrice * (itemMatch.gstRate / 2)) / 100,
            sgstAmount: (itemMatch.retailPrice * (itemMatch.gstRate / 2)) / 100,
            igstAmount: 0,
            roundOff: 0,
            grandTotal: itemMatch.retailPrice * (1 + itemMatch.gstRate / 100),
            paidAmount: 0,
            balanceDue: itemMatch.retailPrice * (1 + itemMatch.gstRate / 100),
            status: 'Draft'
          };

          if (onInvoiceGenerated) {
            onInvoiceGenerated(draftInv);
          }
        }
      }
    } catch (err: any) {
      addAICopilotMessage({
        sender: 'ai',
        text: 'Sorry, I encountered an issue connecting to the AI Copilot backend server. Please verify your GEMINI_API_KEY settings.'
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Speech Recognition Handler
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === 'Hindi' ? 'hi-IN' : selectedLang === 'Urdu' ? 'ur-PK' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsRecording(false);
        handleSendPrompt(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // OCR Bill Parsing Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrScanning(true);
    addAICopilotMessage({
      sender: 'user',
      text: `[Uploaded Bill Receipt Image: "${file.name}"] Please extract OCR invoice data.`
    });

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/ai/parse-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Image: base64Data,
            mimeType: file.type || 'image/jpeg'
          })
        });

        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          addAICopilotMessage({
            sender: 'ai',
            text: `✅ **OCR Bill Extraction Successful!**\n\n• **Vendor:** ${d.vendorName || 'Extracted Vendor'}\n• **Invoice No:** ${d.invoiceNumber || 'N/A'}\n• **Grand Total:** $${d.grandTotal || '0'}\n• **Extracted Items:** ${d.items?.length || 0} items identified.\n\nWould you like me to log this under Purchase Bills automatically?`
          });
        } else {
          addAICopilotMessage({
            sender: 'ai',
            text: 'I uploaded the document image to Gemini Vision OCR, but could not parse structured fields cleanly. You can also manually review the document in Document Vault.'
          });
        }
      } catch (err) {
        addAICopilotMessage({
          sender: 'ai',
          text: 'OCR extraction service failed to parse image. Please ensure GEMINI_API_KEY is configured.'
        });
      } finally {
        setOcrScanning(false);
        scrollToBottom();
      }
    };
    reader.readAsDataURL(file);
  };

  const presetChips = [
    'What is our total net profit this month?',
    'Show low stock items & reorder alerts',
    'Create invoice for Acme Technologies for 2 UltraBook Pro',
    'Generate payment reminder message for Acme Corp',
    'Check for accounting errors or cash mismatches'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs p-2 sm:p-4">
      <div className="w-full max-w-xl h-full max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                Apex AI Copilot
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-semibold border border-blue-400/40">
                  Gemini 3.6
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">Intelligent ERP Assistant & Voice Copilot</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Picker */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg text-xs">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none cursor-pointer text-xs font-medium"
              >
                <option value="English" className="bg-slate-900 text-white">English</option>
                <option value="Hindi" className="bg-slate-900 text-white">Hindi (हिंदी)</option>
                <option value="Urdu" className="bg-slate-900 text-white">Urdu (اردو)</option>
              </select>
            </div>

            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Action Chips */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
          {presetChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(chip)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors shrink-0 flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              {chip}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</div>
                <span
                  className={`text-[9px] block mt-1.5 ${
                    msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {(isLoading || ocrScanning) && (
            <div className="flex items-center gap-2 text-xs text-blue-500 font-medium py-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{ocrScanning ? 'Gemini Vision AI scanning OCR receipt...' : 'AI Copilot is thinking...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File & Voice OCR Tool Bar */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Bill/Receipt (OCR Scan)
          </button>

          <span className="text-[10px] text-slate-400">Powered by Gemini 3.6 Flash</span>
        </div>

        {/* Message Input Box */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceRecording}
              className={`p-2.5 rounded-xl transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-bounce'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title={isRecording ? 'Listening...' : 'Speak Voice Command'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={`Ask AI in ${selectedLang} or type 'Create invoice for Acme'...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => handleSendPrompt()}
              disabled={isLoading || !inputPrompt.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
