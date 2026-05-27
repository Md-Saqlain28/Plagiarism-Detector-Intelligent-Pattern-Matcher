import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import EditorPane from './components/EditorPane';
import StatsCard from './components/StatsCard';
import HorspoolTable from './components/HorspoolTable';
import TextVisualizer from './components/TextVisualizer';
import { bruteForceMatch, horspoolMatch } from './utils/algorithms';
import { sampleDocuments } from './utils/samples';
import { Play } from 'lucide-react';

function App() {
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

  // Main comparison logic
  const runComparison = () => {
    if (!sourceText || !pattern) return;

    setIsComparing(true);
    
    // Slight delay to show loading state if it were a heavy operation
    // but here it's also to ensure UI updates
    setTimeout(() => {
      const bfResults = bruteForceMatch(sourceText, pattern);
      const hpResults = horspoolMatch(sourceText, pattern);
      
      setResults({
        bruteForce: bfResults,
        horspool: hpResults
      });
      setIsComparing(false);
    }, 100);
  };

  // Real-time updates (optional, but requested "update all metrics in real-time as the user types")
  // We'll use a debounce or just use effect for small inputs
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
      <Header />
      
      <main className="pb-20">
        <EditorPane 
          sourceText={sourceText} 
          setSourceText={setSourceText} 
          pattern={pattern} 
          setPattern={setPattern}
          onSampleLoad={handleSampleLoad}
        />

        <div className="max-w-7xl mx-auto px-6 mb-8">
          <button
            onClick={runComparison}
            disabled={!sourceText || !pattern || isComparing}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300
              ${!sourceText || !pattern 
                ? 'bg-dark-border text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-neon-blue/80 to-neon-green/80 hover:from-neon-blue hover:to-neon-green text-dark-bg glow-blue'
              }`}
          >
            {isComparing ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-dark-bg border-t-transparent"></span>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Run Benchmark Comparison
              </>
            )}
          </button>
        </div>

        {results && (
          <div className="max-w-7xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatsCard 
                title="Brute Force Baseline" 
                results={results.bruteForce} 
                variant="blue" 
              />
              <StatsCard 
                title="Horspool's Optimization" 
                results={results.horspool} 
                variant="green" 
              />
            </div>

            <HorspoolTable table={results.horspool.table} />
            
            <TextVisualizer 
              text={sourceText} 
              pattern={pattern} 
              matches={results.horspool.matches} 
            />
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-dark-border bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm font-mono">
          <p>© 2026 AlgoMatch Engine. Built for High-Performance Algorithmic Analysis.</p>
          <div className="flex gap-6">
            <span className="hover:text-neon-blue transition-colors cursor-help">Space-Time Tradeoff</span>
            <span className="hover:text-neon-green transition-colors cursor-help">Input Enhancement</span>
            <span className="hover:text-white transition-colors cursor-help">Complexity: O(N)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
