
import React from 'react';
import { 
  Palette, 
  Lock, 
  Bell, 
  Cloud, 
  Link as LinkIcon, 
  Globe,
  Settings as SettingsIcon,
  CheckCircle2,
  Database,
  DownloadCloud,
  ShieldAlert
} from 'lucide-react';
import { Invoice, Client, Branch, Payment } from '../types';

interface SettingsProps {
  state?: {
    invoices: Invoice[];
    clients: Client[];
    branches: Branch[];
    payments: Payment[];
  };
}

const Settings: React.FC<SettingsProps> = ({ state }) => {
  const handleDownloadBackup = () => {
    if (!state) return;
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `VEDARTHA_ERP_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">System Configuration</h2>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Global Master Control Panel</p>
          </div>
          <button className="px-8 py-3 bg-[#0854a0] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
            Commit System Updates
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Maintenance & Backup Section */}
          <div className="p-10 space-y-8 bg-blue-50/20">
            <div className="flex items-center space-x-3">
              <Database size={20} className="text-blue-600" />
              <h3 className="font-black text-[#1c2d3d] text-sm uppercase tracking-tight">Database & Lifecycle Management</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                    <DownloadCloud size={32} />
                  </div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">System Data Backup</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Export all general ledger entries, client master records, and branch configurations into a secure JSON archive.
                  </p>
                  <button 
                    onClick={handleDownloadBackup}
                    className="w-full mt-4 flex items-center justify-center px-6 py-4 bg-white border-2 border-blue-100 text-[#0854a0] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#0854a0] hover:text-white hover:border-[#0854a0] transition-all shadow-md group"
                  >
                    Download Backup File <Database size={16} className="ml-3 group-hover:scale-110 transition-transform" />
                  </button>
               </div>

               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-rose-50 rounded-2xl text-rose-500">
                    <ShieldAlert size={32} />
                  </div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">Emergency Purge</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Clear all transactional cache and reset the system to factory master data. Use with caution.
                  </p>
                  <button className="w-full mt-4 flex items-center justify-center px-6 py-4 bg-white border-2 border-rose-100 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-md">
                    Reset To Master
                  </button>
               </div>
            </div>
          </div>

          {/* Localization Section */}
          <div className="p-10 space-y-8">
            <div className="flex items-center space-x-3">
              <Globe size={20} className="text-emerald-500" />
              <h3 className="font-black text-[#1c2d3d] text-sm uppercase tracking-tight">Localization & Regional Parameters</h3>
            </div>
            <div className="grid grid-cols-2 gap-10">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">System Currency (Base)</label>
                 <select className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl p-4 text-sm font-bold outline-none transition-all cursor-pointer">
                   <option>INR - Indian Rupee (₹)</option>
                   <option>USD - US Dollar ($)</option>
                   <option>EUR - Euro (€)</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Fiscal Reporting Timezone</label>
                 <select className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl p-4 text-sm font-bold outline-none transition-all cursor-pointer">
                   <option>(GMT+05:30) Mumbai, New Delhi</option>
                   <option>(GMT+00:00) UTC (Universal)</option>
                 </select>
               </div>
            </div>
          </div>

          {/* Integrations Section */}
          <div className="p-10 space-y-8">
            <div className="flex items-center space-x-3">
              <LinkIcon size={20} className="text-amber-500" />
              <h3 className="font-black text-[#1c2d3d] text-sm uppercase tracking-tight">API & Connectivity Hub</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { name: 'Gateway (Razorpay)', status: 'Connected', icon: CheckCircle2 },
                 { name: 'Infrastructure (AWS S3)', status: 'Connected', icon: CheckCircle2 },
                 { name: 'Tally Connector', status: 'Disabled', icon: LinkIcon },
                 { name: 'SMS (Twilio)', status: 'Pending', icon: SettingsIcon },
               ].map((integration, idx) => (
                 <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-xl ${integration.status === 'Connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                        <integration.icon size={16} />
                      </div>
                      <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{integration.name}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${integration.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                      {integration.status}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
