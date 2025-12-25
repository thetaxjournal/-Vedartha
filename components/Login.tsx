
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { COMPANY_LOGO } from '../constants';

interface LoginProps {
  onLogin: (user: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(username, password);
    } else {
      setError('Invalid credentials. Please use admin/admin.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f7fa] relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#0854a0]"></div>
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-blue-50/50 -skew-x-12 transform translate-x-1/3 z-0"></div>
      
      <div className="w-full max-w-[480px] z-10 p-4">
        <div className="bg-white rounded-[32px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="p-10 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src={COMPANY_LOGO} 
                alt="VEDARTHA" 
                className="h-16 object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-xs font-bold flex items-center animate-shake">
                <ShieldCheck size={16} className="mr-3 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">System Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-[#0854a0] focus:bg-white rounded-2xl pl-14 pr-6 text-sm font-bold transition-all outline-none"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-[#0854a0] focus:bg-white rounded-2xl pl-14 pr-6 text-sm font-bold transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0854a0] focus:ring-[#0854a0]" />
                <span className="ml-3 text-[11px] font-bold text-gray-500 group-hover:text-gray-700">Persist session</span>
              </label>
              <button type="button" className="text-[11px] font-bold text-blue-600 hover:underline uppercase tracking-wider">Forgot access?</button>
            </div>

            <button 
              type="submit" 
              className="w-full h-16 bg-[#0854a0] text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-[#064280] transition-all transform active:scale-95 flex items-center justify-center group"
            >
              Sign into ERP <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="p-8 bg-gray-50/50 border-t border-gray-100 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Secured by Vedartha System Solutions &copy; 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
