
import React, { useState } from 'react';
import { Search, Plus, Edit2, Shield, Trash2, MapPin, CreditCard, PieChart, X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Client, Branch, Address } from '../types';

interface ClientsProps {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  branches: Branch[];
}

const Clients: React.FC<ClientsProps> = ({ clients, setClients, branches }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewClient = () => {
    // Client ID now starts with C1548 as requested
    setEditingClient({
      id: `C1548${Date.now().toString().slice(-4)}`,
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      gstin: '',
      status: 'Active',
      branchIds: branches.map(b => b.id),
      billingAddress: { line1: '', city: '', state: '', pincode: '', country: 'INDIA' },
      shippingAddress: { line1: '', city: '', state: '', pincode: '', country: 'INDIA' }
    });
    setActiveTab(0);
    setShowModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient({ ...client });
    setActiveTab(0);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingClient?.name || !editingClient?.gstin) {
      alert("Client name and Gstin are mandatory fields.");
      return;
    }
    const updatedList = clients.find(c => c.id === editingClient.id)
      ? clients.map(c => c.id === editingClient.id ? editingClient as Client : c)
      : [...clients, editingClient as Client];
    
    setClients(updatedList);
    setShowModal(false);
  };

  const updateAddr = (type: 'billingAddress' | 'shippingAddress', field: keyof Address, value: string) => {
    if (!editingClient) return;
    setEditingClient({
      ...editingClient,
      [type]: { ...((editingClient[type] || {}) as Address), [field]: value }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center flex-1 max-w-2xl relative group">
          <Search className="absolute left-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search clients (Name, Gst)..." 
            className="w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleNewClient}
          className="flex items-center px-10 py-4 bg-[#0854a0] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#064280] shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={18} className="mr-3" /> New client
        </button>
      </div>

      {/* Clients List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-bold tracking-tight">
            <tr>
              <th className="px-10 py-6 text-[12px]">Client id</th>
              <th className="px-10 py-6 text-[12px]">Legal name</th>
              <th className="px-10 py-6 text-[12px]">Tax identifier</th>
              <th className="px-10 py-6 text-[12px]">Contact point</th>
              <th className="px-10 py-6 text-center text-[12px]">Lifecycle status</th>
              <th className="px-10 py-6 text-right text-[12px]">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map(client => (
              <tr key={client.id} className="hover:bg-blue-50/40 transition-all group">
                <td className="px-10 py-6 font-mono font-bold text-gray-400 text-sm">{client.id}</td>
                <td className="px-10 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 group-hover:text-[#0854a0] tracking-tight text-base">{client.name}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{client.email}</span>
                  </div>
                </td>
                <td className="px-10 py-6 font-mono text-[#0854a0] font-bold text-sm">{client.gstin}</td>
                <td className="px-10 py-6 font-medium text-gray-600 text-sm">{client.contactPerson}</td>
                <td className="px-10 py-6 text-center">
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-[10px] border border-emerald-200">Active</span>
                </td>
                <td className="px-10 py-6 text-right">
                  <button 
                    onClick={() => handleEditClient(client)} 
                    className="p-3 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-gray-400"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Master Data Modal - SENTENCE CASE TYPOGRAPHY */}
      {showModal && editingClient && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[1400px] rounded-[32px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] flex flex-col max-h-[95vh] border border-white/20 overflow-hidden">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fa] shadow-sm">
              <div>
                <h2 className="text-3xl font-bold text-[#1c2d3d] tracking-tight">Client master records</h2>
                <p className="text-[11px] font-bold text-blue-500 mt-2 uppercase tracking-widest">Vedartha global erp central management systems</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-4 bg-white border border-gray-200 text-gray-400 hover:text-gray-900 rounded-full hover:shadow-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Tabs - Sentence Case */}
            <div className="flex bg-[#eef2f6] border-b border-gray-200 px-10">
              {['General master', 'Address & logistics', 'Payment conditions', 'Financial accounting'].map((tab, i) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(i)}
                  className={`px-12 py-5 text-[12px] font-bold transition-all relative ${
                    activeTab === i 
                      ? 'text-[#0854a0]' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                  {activeTab === i && <div className="absolute bottom-0 left-6 right-6 h-1.5 bg-[#0854a0] rounded-t-full shadow-[0_-4px_12px_rgba(8,84,160,0.4)]"></div>}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-14 bg-white custom-scrollbar">
              {activeTab === 0 && (
                <div className="grid grid-cols-2 gap-24 animate-in slide-in-from-bottom-6 duration-500">
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 mb-4">
                       <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                       <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-widest">Primary client identifiers</h4>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-gray-500 ml-1">Unique client code</label>
                       <input className="w-full bg-gray-50 rounded-2xl border border-gray-100 px-6 h-14 font-mono font-bold text-gray-400 text-lg" value={editingClient.id} disabled />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-gray-600 ml-1">Registered legal name</label>
                       <input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-16 font-bold text-gray-800 text-xl focus:border-[#0854a0] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" value={editingClient.name} onChange={(e) => setEditingClient({...editingClient, name: e.target.value})} placeholder="Enter legal entity name" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-600 ml-1">Key account contact</label>
                         <input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 text-base focus:border-[#0854a0] outline-none transition-all" value={editingClient.contactPerson} onChange={(e) => setEditingClient({...editingClient, contactPerson: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-600 ml-1">Corporate email</label>
                         <input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 text-base focus:border-[#0854a0] outline-none transition-all" value={editingClient.email} onChange={(e) => setEditingClient({...editingClient, email: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-gray-600 ml-1">Gstin registration number</label>
                       <input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-16 font-mono font-bold text-[#0854a0] text-2xl tracking-widest focus:border-[#0854a0] outline-none transition-all uppercase shadow-sm" value={editingClient.gstin} onChange={(e) => setEditingClient({...editingClient, gstin: e.target.value})} />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-[40px] border border-blue-100 flex flex-col items-center text-center shadow-xl">
                      <div className="w-24 h-24 bg-[#0854a0] rounded-[24px] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(8,84,160,0.3)] mb-8 transform hover:scale-105 transition-transform cursor-pointer">
                        <Shield size={48} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 tracking-tight mb-4">Client verification hub</h4>
                      <p className="text-sm text-gray-500 leading-loose font-medium max-w-sm px-4">
                        Master data changes are subject to system-wide audit logging. 
                        Ensure all tax identifiers match legal documentation before persistence.
                      </p>
                      <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                         <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400">Compliance score</p>
                            <p className="text-lg font-bold text-emerald-600">98.4%</p>
                         </div>
                         <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400">Risk level</p>
                            <p className="text-lg font-bold text-blue-600">Minimal</p>
                         </div>
                      </div>
                      <button className="mt-10 w-full bg-white border-2 border-blue-100 text-blue-600 px-10 py-4 rounded-2xl text-[12px] font-bold hover:bg-[#0854a0] hover:text-white hover:border-[#0854a0] transition-all shadow-md group">
                        Run audit lifecycle checks
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="grid grid-cols-2 gap-24 animate-in fade-in duration-500">
                  <div className="space-y-8">
                    <h4 className="text-[12px] font-bold text-blue-600 tracking-widest flex items-center mb-8 bg-blue-50 px-6 py-3 rounded-xl w-fit"><MapPin size={18} className="mr-3" /> Standard billing site</h4>
                    <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">Street address / Floor</label><input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 focus:border-[#0854a0] outline-none" value={editingClient.billingAddress?.line1} onChange={(e) => updateAddr('billingAddress', 'line1', e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">City / District</label><input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 focus:border-[#0854a0] outline-none" value={editingClient.billingAddress?.city} onChange={(e) => updateAddr('billingAddress', 'city', e.target.value)} /></div>
                      <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">State / Region</label><input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 focus:border-[#0854a0] outline-none" value={editingClient.billingAddress?.state} onChange={(e) => updateAddr('billingAddress', 'state', e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">Zip / Postal code</label><input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 focus:border-[#0854a0] outline-none" value={editingClient.billingAddress?.pincode} onChange={(e) => updateAddr('billingAddress', 'pincode', e.target.value)} /></div>
                  </div>
                  <div className="space-y-8">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-[12px] font-bold text-gray-400 tracking-widest flex items-center bg-gray-50 px-6 py-3 rounded-xl"><MapPin size={18} className="mr-3" /> Shipping terminal</h4>
                      <button 
                        onClick={() => setEditingClient({...editingClient, shippingAddress: {...(editingClient.billingAddress as Address)}})}
                        className="text-[10px] font-bold text-[#0854a0] border-2 border-blue-50 px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all tracking-tight shadow-sm"
                      >
                        Mirror billing address
                      </button>
                    </div>
                    <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">Logistics entry point</label><input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 focus:border-[#0854a0] outline-none" value={editingClient.shippingAddress?.line1} onChange={(e) => updateAddr('shippingAddress', 'line1', e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">Destination city</label><input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 focus:border-[#0854a0] outline-none" value={editingClient.shippingAddress?.city} onChange={(e) => updateAddr('shippingAddress', 'city', e.target.value)} /></div>
                      <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">Destination state</label><input className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-medium text-gray-800 focus:border-[#0854a0] outline-none" value={editingClient.shippingAddress?.state} onChange={(e) => updateAddr('shippingAddress', 'state', e.target.value)} /></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="grid grid-cols-2 gap-24 animate-in fade-in duration-500">
                  <div className="space-y-10">
                    <h4 className="text-[12px] font-bold text-amber-600 tracking-widest flex items-center mb-8 bg-amber-50 px-6 py-3 rounded-xl w-fit"><CreditCard size={18} className="mr-3" /> Commercial agreement architecture</h4>
                    <div className="space-y-6">
                       <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">Payment maturity cycle</label><select className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-14 font-bold text-gray-800 focus:border-[#0854a0] outline-none cursor-pointer"><option>Net 30 days (Standard)</option><option>Net 15 days (Accelerated)</option><option>Immediate cash settlement</option><option>Quarterly settlement (Eom+90)</option></select></div>
                       <div className="space-y-2"><label className="text-[11px] font-bold text-gray-500 ml-1">Operational exposure limit (Inr)</label><input type="number" className="w-full bg-white rounded-2xl border-2 border-gray-100 px-6 h-16 font-bold text-gray-800 text-xl focus:border-[#0854a0] outline-none" placeholder="Enter amount" /></div>
                    </div>
                  </div>
                  <div className="bg-amber-50/40 p-12 rounded-[40px] border border-amber-100 h-fit shadow-lg">
                    <div className="flex items-center space-x-3 mb-6">
                       <AlertCircle className="text-amber-600" size={24} />
                       <p className="text-[12px] font-bold text-amber-900 tracking-tight">Risk exposure assessment</p>
                    </div>
                    <div className="space-y-5">
                       <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-amber-100 shadow-sm group hover:scale-[1.02] transition-transform">
                         <span className="text-[11px] font-medium text-gray-500">Dunning protocol</span>
                         <span className="text-[12px] font-bold text-amber-600">Premium-01a</span>
                       </div>
                       <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-amber-100 shadow-sm group hover:scale-[1.02] transition-transform">
                         <span className="text-[11px] font-medium text-gray-500">Penalty profile</span>
                         <span className="text-[12px] font-bold text-amber-600">Commercial 24% pa</span>
                       </div>
                       <div className="pt-6 border-t border-amber-100 mt-2">
                          <p className="text-[10px] font-medium text-amber-800/60 text-center leading-relaxed">
                            Credit control measures are automatically enforced based on aging buckets.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="animate-in zoom-in-95 duration-500">
                  <div className="bg-[#f8f9fa] p-16 rounded-[48px] border-2 border-gray-100 flex items-center justify-between shadow-inner">
                     <div className="space-y-10 flex-1 pr-24">
                        <h4 className="text-[14px] font-bold text-purple-600 tracking-widest flex items-center mb-10"><PieChart size={24} className="mr-4" /> G/l reconciliation configuration</h4>
                        <div className="space-y-6">
                           <div className="space-y-2"><label className="text-[11px] font-bold text-gray-400 ml-1">Recon. master account</label><input className="w-full bg-white rounded-2xl border-2 border-gray-200 px-8 h-16 font-bold text-gray-800 text-lg shadow-sm" defaultValue="140000 - Accounts receivable" /></div>
                           <div className="space-y-2"><label className="text-[11px] font-bold text-gray-400 ml-1">Operating head of account</label><input className="w-full bg-white rounded-2xl border-2 border-gray-200 px-8 h-16 font-bold text-gray-800 text-lg shadow-sm" defaultValue="410000 - Operational sales" /></div>
                           <div className="space-y-2"><label className="text-[11px] font-bold text-gray-400 ml-1">Taxation logic engine</label><select className="w-full bg-white rounded-2xl border-2 border-gray-200 px-8 h-16 font-bold text-gray-800 text-lg shadow-sm"><option>Domestic - Full tax (Cgst/Sgst)</option><option>Interstate - Igst 18%</option><option>Exempt / Zero rated supply</option></select></div>
                        </div>
                     </div>
                     <div className="w-[450px] border-l-4 border-white pl-20 space-y-12">
                        <div>
                          <p className="text-[12px] font-bold text-gray-400 tracking-widest mb-6">Financial snapshot</p>
                          <div className="space-y-6">
                             <div className="flex justify-between items-end"><span className="text-sm font-medium text-gray-400 uppercase">Life volume</span><span className="text-2xl font-bold text-[#0854a0]">₹ 1,42,85,000</span></div>
                             <div className="flex justify-between items-end"><span className="text-sm font-medium text-gray-400 uppercase">Open ledger</span><span className="text-2xl font-bold text-rose-500">₹ 1,20,400</span></div>
                          </div>
                        </div>
                        <div className="p-8 bg-emerald-50 rounded-[32px] border-2 border-emerald-100 flex items-center shadow-md">
                           <CheckCircle2 size={36} className="text-emerald-500 mr-6" />
                           <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-emerald-800 tracking-tight">Financial health index</span>
                             <span className="text-2xl font-bold text-emerald-700 mt-1">Prime class - A+</span>
                           </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center">
                           <span className="text-[10px] font-bold text-gray-400">Last fiscal audit</span>
                           <span className="text-[11px] font-bold text-gray-800">22-Oct-2024</span>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-gray-100 flex justify-end space-x-6 bg-[#f8f9fa] shadow-[0_-16px_48px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-10 py-4 border-2 border-gray-200 rounded-2xl text-[12px] font-bold text-gray-600 hover:bg-white hover:border-gray-300 transition-all shadow-sm"
              >
                Discard updates
              </button>
              <button 
                onClick={handleSave} 
                className="px-20 py-4 bg-[#0854a0] text-white rounded-2xl text-[12px] font-bold shadow-2xl shadow-blue-200 hover:bg-[#064280] transition-all active:scale-95 flex items-center group"
              >
                <Save size={18} className="mr-3 group-hover:scale-110 transition-transform" /> Persist client master
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
