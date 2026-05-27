import React, { useState } from 'react';
import { Table as TableIcon, HelpCircle, ArrowRight, HelpCircle as CalculatorIcon } from 'lucide-react';

const HorspoolTable = ({ table, pattern }) => {
  const [hoveredChar, setHoveredChar] = useState(null);
  const [calculatorInput, setCalculatorInput] = useState('');

  const entries = Object.entries(table);
  const m = pattern ? pattern.length : 0;
  
  if (entries.length === 0 || m === 0) return null;

  // Calculator Logic
  const getCalculatedShift = () => {
    if (!calculatorInput) return null;
    const char = calculatorInput[0]; // Take only first character
    
    const isPresent = table[char] !== undefined;
    const shift = isPresent ? table[char] : m;

    return { char, shift, isPresent };
  };

  const calcResult = getCalculatedShift();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-in fade-in duration-500">
      
      {/* Shift Table (2 Cols) */}
      <div className="lg:col-span-2 flex flex-col gap-4 p-6 rounded-2xl bg-dark-card border border-dark-border">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div className="flex items-center gap-2 text-gray-300 font-bold font-mono text-sm">
            <TableIcon className="w-5 h-5 text-neon-blue" />
            Horspool's Bad Character Shift Table
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1 bg-dark-bg border border-dark-border/40 rounded-full text-[10px] font-mono text-gray-500">
            Shift = m - 1 - idx
          </div>
        </div>

        {/* Pattern Highlight Overlay Row (interactive hover demonstration) */}
        <div className="bg-dark-bg/60 p-3.5 border border-dark-border/40 rounded-xl flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
            <span>Pattern Index Viewer</span>
            {hoveredChar && (
              <span className="text-neon-blue">
                Highlighting occurrences of '<strong className="font-bold">{hoveredChar === ' ' ? 'SPC' : hoveredChar}</strong>'
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono select-none">
            {pattern.split('').map((char, pIdx) => {
              const isHoveredMatch = hoveredChar && char === hoveredChar;
              const isLastChar = pIdx === m - 1;
              return (
                <div 
                  key={pIdx} 
                  className={`flex flex-col items-center justify-center min-w-[28px] p-1 border rounded transition-all duration-300 ${
                    isHoveredMatch 
                      ? 'bg-neon-blue/20 text-neon-blue border-neon-blue scale-105 font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                      : isLastChar 
                      ? 'bg-dark-bg/30 text-gray-600 border-dashed border-dark-border/60'
                      : 'bg-dark-card text-gray-400 border-dark-border'
                  }`}
                  title={isLastChar ? "Last character is excluded from shift calculations" : `Index: ${pIdx}`}
                >
                  <span className="text-[9px] font-bold">{char === ' ' ? '␣' : char}</span>
                  <span className="text-[8px] text-gray-600 font-semibold">{pIdx}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Scrollable Shift Table Items */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <div className="flex flex-wrap gap-2.5">
            {entries.map(([char, shift]) => (
              <div 
                key={char} 
                onMouseEnter={() => setHoveredChar(char)}
                onMouseLeave={() => setHoveredChar(null)}
                className={`flex flex-col items-center min-w-[64px] p-3 bg-dark-bg border rounded-xl transition-all duration-300 cursor-help ${
                  hoveredChar === char 
                    ? 'border-neon-blue bg-neon-blue/5 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.08)]' 
                    : 'border-dark-border hover:border-gray-700'
                } group`}
              >
                <span className="text-[9px] font-mono text-gray-600 font-bold uppercase tracking-wider mb-1">Char</span>
                <span className="text-xl font-black text-neon-blue font-mono group-hover:scale-110 transition-transform">
                  {char === ' ' ? 'SPC' : char}
                </span>
                
                <div className="w-full border-t border-dark-border/60 my-2"></div>
                
                <span className="text-[9px] font-mono text-gray-600 font-bold uppercase tracking-wider mb-1">Shift</span>
                <span className="text-sm font-bold text-white font-mono">{shift}</span>
              </div>
            ))}
            
            {/* The default asterisk entry for any other chars */}
            <div className="flex flex-col items-center min-w-[64px] p-3 bg-dark-bg/40 border border-dashed border-dark-border rounded-xl italic">
              <span className="text-[9px] font-mono text-gray-600 mb-1 font-bold uppercase">Others</span>
              <span className="text-xl font-bold text-gray-600 font-mono">*</span>
              
              <div className="w-full border-t border-dark-border/40 my-2"></div>
              
              <span className="text-[9px] font-mono text-gray-600 mb-1 font-bold uppercase">Default</span>
              <span className="text-sm font-bold text-gray-600 font-mono">{m}</span>
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-gray-500 font-mono italic leading-relaxed">
          * Space-Time Tradeoff: Horspool checks character mismatches, then shifts the pattern end relative to the shift table. Characters absent in this table get shifted by full pattern length <strong>{m}</strong>.
        </p>
      </div>

      {/* Interactive Shift Calculator (1 Col) */}
      <div className="cyber-card p-6 flex flex-col gap-4 bg-dark-card border border-dark-border">
        <div className="flex items-center gap-2 text-gray-300 font-bold font-mono text-sm border-b border-dark-border pb-4">
          <CalculatorIcon className="w-5 h-5 text-neon-green" />
          Shift Lookup Calculator
        </div>

        <div className="flex flex-col gap-4 my-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Type any character</label>
            <input 
              type="text" 
              maxLength="1"
              value={calculatorInput}
              onChange={(e) => setCalculatorInput(e.target.value)}
              placeholder="e.g. e, a, T"
              className="bg-dark-bg border border-dark-border focus:ring-1 focus:ring-neon-green text-center text-xl font-bold font-mono py-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="bg-dark-bg/60 p-4 border border-dark-border/40 rounded-xl min-h-[105px] flex flex-col items-center justify-center text-center">
            {calcResult ? (
              <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <span>Character:</span>
                  <span className="font-bold text-white bg-dark-border px-2 py-0.5 rounded">
                    {calcResult.char === ' ' ? 'SPC' : calcResult.char}
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-xs text-gray-500 font-mono">Shift Value</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-2xl font-black text-neon-green font-mono">{calcResult.shift}</span>
                </div>

                <span className="text-[9px] font-mono text-gray-500 italic mt-1">
                  {calcResult.isPresent 
                    ? "Defined inside pattern shift table" 
                    : "Not in pattern (Full Shift)"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-gray-600">
                <HelpCircle className="w-6 h-6 opacity-40 animate-pulse-subtle" />
                <span className="text-[10px] font-mono">Type a letter above to test bad character shift values.</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HorspoolTable;
