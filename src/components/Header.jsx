import React from 'react';
import { Search, Zap, Cpu, BarChart3 } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-8 px-6 bg-dark-bg border-b border-dark-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-green/5 rounded-full blur-3xl -ml-24 -mb-24"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-neon-blue/10 rounded-lg">
            <Search className="w-6 h-6 text-neon-blue" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            AlgoMatch<span className="text-neon-blue">:</span> Engine
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl text-lg">
          High-Performance Plagiarism and Pattern Matching Engine. 
          Comparing <span className="text-neon-blue font-semibold">Brute Force</span> efficiency vs. 
          <span className="text-neon-green font-semibold">Horspool's</span> space-time optimization.
        </p>
        
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-dark-card border border-dark-border rounded-full text-xs font-mono text-gray-400">
            <Zap className="w-3 h-3 text-neon-green" />
            Input Enhancement Enabled
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-dark-card border border-dark-border rounded-full text-xs font-mono text-gray-400">
            <Cpu className="w-3 h-3 text-neon-blue" />
            Real-time Benchmarking
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
