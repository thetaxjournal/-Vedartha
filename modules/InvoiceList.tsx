
import React, { useState } from 'react';
import { Search, Plus, Filter, FileText, Download, Edit2, Ban, CheckCircle, Clock, XCircle, MessageCircle } from 'lucide-react';
import { Invoice } from '../types';
import { COMPANY_NAME } from '../constants';

interface InvoiceListProps {
  invoices: Invoice[];
  onNewInvoice: () => void;
  onEdit: (invoice: Invoice) => void;
  onRevoke: (id: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onNewInvoice, onEdit, onRevoke }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsAppShare = (inv: Invoice) => {
    const text = `Dear ${inv.clientName},%0A%0APlease find attached Invoice *${inv.invoiceNumber}* dated ${inv.date}.%0A%0A*Total Amount:* ₹ ${inv.grandTotal.toLocaleString('en-IN')}%0A%0ARegards,%0A${COMPANY_NAME}`;
    // Opens WhatsApp with the pre-filled text. User selects the contact.
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Invoice #, Client Name..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={onNewInvoice}
          className="flex items-center px-6 py-2.5 bg-[#0854a0] text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#064280] active:scale-95 transition-all"
        >
          <Plus size={16} className="mr-2" /> New Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-black tracking-widest">
            <tr>
              <th className="px-6 py-4">Doc Number</th>
              <th className="px-6 py-4">Posting Date</th>
              <th className="px-6 py-4">Business Partner</th>
              <th className="px-6 py-4 text-right">Gross Value</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-400 uppercase tracking-widest font-black opacity-40">
                  <FileText size={48} className="mx-auto mb-4" />
                  No Records in Master
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-4 font-mono font-black text-blue-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-gray-600 font-bold">{inv.date}</td>
                  <td className="px-6 py-4 font-black text-gray-800 uppercase tracking-tight">{inv.clientName}</td>
                  <td className="px-6 py-4 text-right font-black text-[#0854a0]">₹ {inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center justify-center mx-auto w-fit ${
                      inv.status === 'Posted' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                      inv.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inv.status === 'Posted' && <CheckCircle size={10} className="mr-1" />}
                      {inv.status === 'Cancelled' && <XCircle size={10} className="mr-1" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleWhatsAppShare(inv)} className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" title="Share via WhatsApp">
                        <MessageCircle size={14} />
                      </button>
                      <button onClick={() => onEdit(inv)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => onRevoke(inv.id)} className="p-2 text-gray-400 hover:text-rose-600 transition-colors" title="Revoke">
                        <Ban size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
