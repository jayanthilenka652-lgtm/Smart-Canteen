import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ label = 'Loading Smart Canteen Data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <Loader2 className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">{label}</p>
    </div>
  );
};

export default Loader;
