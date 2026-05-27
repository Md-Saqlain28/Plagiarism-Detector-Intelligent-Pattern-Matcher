import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EditorPane from './components/EditorPane';
import StatsCard, { StatsComparison } from './components/StatsCard';
import HorspoolTable from './components/HorspoolTable';
import TextVisualizer from './components/TextVisualizer';
import AlgorithmSimulator from './components/AlgorithmSimulator';
import PlagiarismScanner from './components/PlagiarismScanner';
import { bruteForceMatch, horspoolMatch } from './utils/algorithms';
import { sampleDocuments } from './utils/samples';
import { Play, Sparkles, Code, Cpu } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('playground'); // 'playground' | 'plagiarism'
  const [sourceText, setSourceText] = useState('');
  const [pattern, setPattern] = useState('');
  const [results, setResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  // Handle sample loading
  const handleSampleLoad = (id) => {
    const sample = sampleDocuments.find(doc => doc.id === id);
    if (sample) {
      setSourceText(sample.content);
    }
  };

  // Main manual comparison benchmark trigger
  const runComparison = () => {
    if (!sourceText || !pattern) return;

    setIsComparing(true);
    
    // Smooth timing delay to allow rendering indicator states
    setTimeout(() => {
      const bfResults = bruteForceMatch(sourceText, pattern);
      const hpResults = horspoolMatch(sourceText, pattern);
      
      setResults({
        bruteForce: bfResults,
        horspool: hpResults
      });
      setIsComparing(false);
    }, 150);
  };

  // Real-time automatic algorithm benchmarking
  useEffect(() => {
    if (sourceText && pattern && pattern.length > 0) {
      const bfResults = bruteForceMatch(sourceText, pattern);
      const hpResults = horspoolMatch(sourceText, pattern);
      
      setResults({
        bruteForce: bfResults,
        horspool: hpResults
      });
    } else {
      setResults(null);
    }
  }, [sourceText, pattern]);

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-neon-blue/30 selection:text-white">
      {/* Premium Header Mode Switcher */}
      <Header mode={mode} setMode={setMode} />
      
      <main className="pb-24">
        {mode === 'playground' ? (
          /* ========================================================
             MODE 1: ALGORITHM BENCHMARK & SIMULATOR PLAYGROUND
             ======================================================== */
          <div className="animate-in fade-in duration-500">
            {/* Input Editors Panel */}
            <EditorPane 
              sourceText={sourceText} 
              setSourceText={setSourceText} 
              pattern={pattern} 
              setPattern={setPattern}
              onSampleLoad={handleSampleLoad}
            />

            {/* Run Button (when real-time is not enough or manual is preferred) */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
              <button
                onClick={runComparison}
                disabled={!sourceText || !pattern || isComparing}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-base transition-all duration-300 shadow-md select-none cursor-pointer
                  ${!sourceText || !pattern 
                    ? 'bg-dark-card border border-dark-border text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-neon-blue to-neon-violet hover:opacity-95 text-dark-bg glow-blue hover:scale-[1.005]'
                  }`}
              >
                {isComparing ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-dark-bg border-t-transparent"></span>
                ) : (
                  <>
                    <Play className="w-4 h-5 fill-current" />
                    Compute Analytical Benchmark
                  </>
                )}
              </button>
            </div>

            {/* Benchmark Analysis Dashboard Results */}
            {results && (
              <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Stats Side-by-Side Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StatsCard 
                    title="Brute Force Baseline (O(n*m))" 
                    results={results.bruteForce} 
                    variant="blue" 
                  />
                  <StatsCard 
                    title="Horspool's Optimization (O(n) average)" 
                    results={results.horspool} 
                    variant="green" 
                  />
                </div>

                {/* Algorithmic Space-Time Benchmark Comparison Panel */}
                <StatsComparison 
                  bruteForce={results.bruteForce} 
                  horspool={results.horspool} 
                />

                {/* Step-by-Step Simulator Theater */}
                <AlgorithmSimulator 
                  sourceText={sourceText} 
                  pattern={pattern} 
                />

                {/* Horspool Shift Table */}
                <HorspoolTable 
                  table={results.horspool.table} 
                  pattern={pattern}
                />
                
                {/* Visualizer matching index list highlights */}
                <TextVisualizer 
                  text={sourceText} 
                  pattern={pattern} 
                  matches={results.horspool.matches} 
                />
              </div>
            )}
            
            {/* Show simulator fallback message if results are null */}
            {!results && (
              <AlgorithmSimulator 
                sourceText={sourceText} 
                pattern={pattern} 
              />
            )}
          </div>
        ) : (
          /* ========================================================
             MODE 2: INTELLIGENT PLAGIARISM COMPARATIVE DOCUMENT SCANNER
             ======================================================== */
          <PlagiarismScanner />
        )}
      </main>

      {/* Cyberpunk Status Bar Footer */}
      <footer className="py-8 border-t border-dark-border bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-mono">
          <p>© 2026 AlgoMatch Audit Suite. Built for Space-Time Algorithmic Analysis.</p>
          <div className="flex gap-6">
            <span className="hover:text-neon-blue transition-colors cursor-help">Space-Time Tradeoff</span>
            <span className="hover:text-neon-green transition-colors cursor-help">Input Enhancement</span>
            <span className="hover:text-neon-violet transition-colors cursor-help">Complexity: O(N)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
