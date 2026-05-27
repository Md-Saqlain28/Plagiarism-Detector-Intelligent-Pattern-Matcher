import React from 'react';
import { Search, Zap, Cpu, Layers, Sparkles } from 'lucide-react';

const Header = ({ mode, setMode }) => {
  return (
    <header className="w-full py-8 px-6 border-b border-dark-border relative overflow-hidden bg-dark-bg/60 backdrop-blur-md">
      {/* Decorative Neon Light Glow Fields */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-violet/5 rounded-full blur-3xl -ml-24 -mb-24"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Branding & Subtitle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neon-blue/10 border border-neon-blue/20 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Search className="w-6 h-6 text-neon-blue" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-1 font-sans">
              AlgoMatch<span className="text-neon-blue font-black text-glow-blue">:</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">Suite</span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
            High-performance algorithmic string analysis. Run step-by-step 
            visualizations of <span className="text-neon-blue font-semibold">Brute Force</span> matching 
            or execute <span className="text-neon-green font-semibold">Horspool's</span> space-time optimizations for multi-document plagiarism audits.
          </p>
        </div>

        {/* Dashboard Tabs Toggle */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex bg-dark-bg/80 p-1 border border-dark-border rounded-2xl w-full md:w-auto relative shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <button
              onClick={() => setMode('playground')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                mode === 'playground' 
                  ? 'bg-gradient-to-r from-neon-blue/90 to-neon-violet/90 text-dark-bg font-extrabold shadow-lg shadow-neon-blue/15' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Pattern Matcher
            </button>
            <button
              onClick={() => setMode('plagiarism')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                mode === 'plagiarism' 
                  ? 'bg-gradient-to-r from-neon-violet/90 to-neon-rose/90 text-dark-bg font-extrabold shadow-lg shadow-neon-violet/15' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Plagiarism Scanner
            </button>
          </div>

          {/* Quick Micro-Badges */}
          <div className="flex gap-3 justify-center md:justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-dark-card/50 border border-dark-border/60 rounded-full text-[10px] font-mono text-gray-500">
              <Zap className="w-3 h-3 text-neon-green" />
              Input Enhancement Enabled
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-dark-card/50 border border-dark-border/60 rounded-full text-[10px] font-mono text-gray-500">
              <Sparkles className="w-3 h-3 text-neon-blue" />
              Real-time Benchmark
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
