import React from 'react';
import { Table as TableIcon } from 'lucide-react';

const HorspoolTable = ({ table }) => {
  const entries = Object.entries(table);
  
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-dark-card border border-dark-border mt-6">
      <div className="flex items-center gap-2 text-gray-300 font-semibold border-b border-dark-border pb-4">
        <TableIcon className="w-5 h-5 text-neon-blue" />
        Horspool's Bad Character Shift Table
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex flex-wrap gap-2">
          {entries.map(([char, shift]) => (
            <div 
              key={char} 
              className="flex flex-col items-center min-w-[60px] p-2 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-blue/50 transition-colors group"
            >
              <span className="text-xs font-mono text-gray-500 mb-1">Char</span>
              <span className="text-lg font-bold text-neon-blue font-mono group-hover:scale-110 transition-transform">
                {char === ' ' ? 'SPC' : char}
              </span>
              <div className="w-full border-t border-dark-border my-1"></div>
              <span className="text-xs font-mono text-gray-500 mt-1">Shift</span>
              <span className="text-sm font-bold text-white font-mono">{shift}</span>
            </div>
          ))}
          <div className="flex flex-col items-center min-w-[60px] p-2 bg-dark-bg/40 border border-dashed border-dark-border rounded-lg italic">
            <span className="text-[10px] font-mono text-gray-600 mb-1">Others</span>
            <span className="text-lg font-bold text-gray-600 font-mono">*</span>
            <div className="w-full border-t border-dark-border my-1"></div>
            <span className="text-[10px] font-mono text-gray-600 mt-1">Default</span>
            <span className="text-sm font-bold text-gray-600 font-mono">m</span>
          </div>
        </div>
      </div>
      
      <p className="text-[11px] text-gray-500 font-mono mt-2 italic">
        * "m" represents the length of the pattern. Characters not in the table shift by the full pattern length.
      </p>
    </div>
  );
};

export default HorspoolTable;
