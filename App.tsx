import React, { useState } from 'react';
import { ERPProvider } from './context/ERPContext';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { AICopilotModal } from './components/ai/AICopilotModal';
import { PDFInvoiceModal } from './components/common/PDFInvoiceModal';
import { UPIQRCodeModal } from './components/common/UPIQRCodeModal';
import { BarcodeScannerModal } from './components/common/BarcodeScannerModal';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { CompanyModule } from './components/modules/CompanyModule';
import { PartyModule } from './components/modules/PartyModule';
import { ProductModule } from './components/modules/ProductModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { SalesModule } from './components/modules/SalesModule';
import { PurchaseModule } from './components/modules/PurchaseModule';
import { AccountingModule } from './components/modules/AccountingModule';
import { ExpenseModule } from './components/modules/ExpenseModule';
import { GSTModule } from './components/modules/GSTModule';
import { CRMModule } from './components/modules/CRMModule';
import { HRModule } from './components/modules/HRModule';
import { DocumentsModule } from './components/modules/DocumentsModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { NotificationsModule } from './components/modules/NotificationsModule';
import { SettingsModule } from './components/modules/SettingsModule';

import { Invoice, Product } from './types';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState<Invoice | null>(null);
  const [upiModalData, setUpiModalData] = useState<{
    isOpen: boolean;
    invoiceNumber: string;
    amount: number;
    partyName: string;
  }>({
    isOpen: false,
    invoiceNumber: '',
    amount: 0,
    partyName: ''
  });
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);

  const handleOpenUPIModal = (invoiceNumber: string, amount: number, partyName: string) => {
    setUpiModalData({
      isOpen: true,
      invoiceNumber,
      amount,
      partyName
    });
  };

  const handleProductScannedFromBarcode = (product: Product) => {
    alert(`Scanned Barcode for "${product.name}"! Switching to Sales Invoice builder...`);
    setActiveTab('sales');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardModule
                onNavigateTab={setActiveTab}
                onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
              />
            )}
            {activeTab === 'company' && <CompanyModule />}
            {activeTab === 'parties' && <PartyModule />}
            {activeTab === 'products' && <ProductModule />}
            {activeTab === 'inventory' && <InventoryModule />}
            {activeTab === 'sales' && (
              <SalesModule
                onOpenPDFModal={(inv) => setSelectedInvoiceForPDF(inv)}
                onOpenUPIModal={handleOpenUPIModal}
                onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
              />
            )}
            {activeTab === 'purchase' && <PurchaseModule />}
            {activeTab === 'accounting' && <AccountingModule />}
            {activeTab === 'expenses' && <ExpenseModule />}
            {activeTab === 'gst' && <GSTModule />}
            {activeTab === 'crm' && <CRMModule />}
            {activeTab === 'hr' && <HRModule />}
            {activeTab === 'documents' && <DocumentsModule />}
            {activeTab === 'reports' && <ReportsModule />}
            {activeTab === 'notifications' && <NotificationsModule />}
            {activeTab === 'settings' && <SettingsModule />}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal onNavigateTab={setActiveTab} />
      
      <AICopilotModal
        onInvoiceGenerated={() => {
          setActiveTab('sales');
        }}
      />

      {selectedInvoiceForPDF && (
        <PDFInvoiceModal
          invoice={selectedInvoiceForPDF}
          isOpen={!!selectedInvoiceForPDF}
          onClose={() => setSelectedInvoiceForPDF(null)}
        />
      )}

      <UPIQRCodeModal
        isOpen={upiModalData.isOpen}
        onClose={() => setUpiModalData({ ...upiModalData, isOpen: false })}
        invoiceNumber={upiModalData.invoiceNumber}
        amount={upiModalData.amount}
        partyName={upiModalData.partyName}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onSelectProduct={handleProductScannedFromBarcode}
      />

    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainLayout />
    </ERPProvider>
  );
}
