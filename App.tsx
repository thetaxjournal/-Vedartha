
import React, { useState, useEffect } from 'react';
import { Module, Branch, Client, Invoice, Payment } from './types';
import { INITIAL_BRANCHES, INITIAL_CLIENTS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './modules/Dashboard';
import InvoiceList from './modules/InvoiceList';
import InvoiceCreation from './modules/InvoiceCreation';
import Payments from './modules/Payments';
import Clients from './modules/Clients';
import Branches from './modules/Branches';
import Accounts from './modules/Accounts';
import Settings from './modules/Settings';
import Login from './components/Login';

// Helper to load data from localStorage with a fallback
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    console.error(`Error loading key ${key} from storage`, e);
    return fallback;
  }
};

const App: React.FC = () => {
  // Initialize state from localStorage or defaults
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadFromStorage('vedartha_auth', false));
  const [activeModule, setActiveModule] = useState<Module>('Dashboard');
  
  const [branches, setBranches] = useState<Branch[]>(() => loadFromStorage('vedartha_branches', INITIAL_BRANCHES));
  const [activeBranchId, setActiveBranchId] = useState<string>(() => {
    const savedBranches = loadFromStorage('vedartha_branches', INITIAL_BRANCHES);
    return savedBranches.length > 0 ? savedBranches[0].id : '';
  });
  
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage('vedartha_clients', INITIAL_CLIENTS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('vedartha_invoices', []));
  const [payments, setPayments] = useState<Payment[]>(() => loadFromStorage('vedartha_payments', []));
  
  const [showCreation, setShowCreation] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('vedartha_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('vedartha_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('vedartha_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('vedartha_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('vedartha_payments', JSON.stringify(payments));
  }, [payments]);

  const handleLogin = (user: string, pass: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vedartha_auth');
  };

  const handleUpdateClients = (newClients: Client[]) => {
    setClients(newClients);
  };

  const handleUpdateBranches = (newBranches: Branch[]) => {
    setBranches(newBranches);
  };

  const handlePostInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? invoice : inv));
      setEditingInvoice(null);
    } else {
      setInvoices([invoice, ...invoices]);
      const updatedBranches = branches.map(b => 
        b.id === invoice.branchId 
          ? { ...b, nextInvoiceNumber: b.nextInvoiceNumber + 1 } 
          : b
      );
      setBranches(updatedBranches);
    }
    setShowCreation(false);
  };

  const handleRecordPayment = (payment: Payment) => {
    setPayments([payment, ...payments]);
    setInvoices(prev => prev.map(inv => 
      inv.id === payment.invoiceId 
        ? { ...inv, status: 'Paid' as const } 
        : inv
    ));
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowCreation(true);
  };

  const handleRevoke = (id: string) => {
    if (confirm("Are you sure you want to revoke this document? It will be marked as Cancelled.")) {
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Cancelled' } : inv));
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'Dashboard':
        return (
          <Dashboard 
            invoices={invoices} 
            clients={clients} 
            branches={branches} 
            payments={payments}
            onRecordPayment={handleRecordPayment}
          />
        );
      case 'Invoices':
        if (showCreation) {
          return (
            <InvoiceCreation 
              branches={branches} 
              activeBranchId={activeBranchId} 
              clients={clients} 
              initialInvoice={editingInvoice || undefined}
              onPost={handlePostInvoice}
              onCancel={() => {
                setShowCreation(false);
                setEditingInvoice(null);
              }}
            />
          );
        }
        return (
          <InvoiceList 
            invoices={invoices} 
            onNewInvoice={() => {
              setEditingInvoice(null);
              setShowCreation(true);
            }} 
            onEdit={handleEdit}
            onRevoke={handleRevoke}
          />
        );
      case 'Payments':
        return (
          <Payments 
            invoices={invoices} 
            payments={payments} 
            onRecordPayment={handleRecordPayment} 
          />
        );
      case 'Clients':
        return <Clients clients={clients} setClients={handleUpdateClients} branches={branches} />;
      case 'Branches':
        return <Branches branches={branches} setBranches={handleUpdateBranches} />;
      case 'Accounts':
        return <Accounts invoices={invoices} />;
      case 'Settings':
        return (
          <Settings 
            state={{ invoices, clients, branches, payments }} 
          />
        );
      default:
        return (
          <Dashboard 
            invoices={invoices} 
            clients={clients} 
            branches={branches} 
            payments={payments}
            onRecordPayment={handleRecordPayment}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      <Sidebar 
        activeModule={activeModule} 
        onModuleChange={(m) => {
          setActiveModule(m);
          setShowCreation(false);
          setEditingInvoice(null);
        }} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          branches={branches}
          activeBranchId={activeBranchId}
          onBranchChange={setActiveBranchId}
          title={activeModule === 'Invoices' ? (showCreation ? (editingInvoice ? 'Edit Document' : 'Create Invoice') : 'Invoice Dashboard') : activeModule}
          onLogout={handleLogout}
        />
        
        <main className={`flex-1 overflow-y-auto ${(activeModule === 'Invoices' && showCreation) ? 'p-0' : 'p-8'}`}>
          <div className={(activeModule === 'Invoices' && showCreation) ? 'h-full' : 'max-w-7xl mx-auto'}>
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
