import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, 
  RotateCcw, Sparkles, Terminal, Activity, HelpCircle
} from 'lucide-react';
import { bruteForceMatchSteps, horspoolMatchSteps } from '../utils/algorithms';

const AlgorithmSimulator = ({ sourceText, pattern }) => {
  const [activeAlgo, setActiveAlgo] = useState('horspool');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // ms per step

  // Generate steps based on text & pattern
  const bfSteps = useMemo(() => bruteForceMatchSteps(sourceText, pattern), [sourceText, pattern]);
  const hpSteps = useMemo(() => horspoolMatchSteps(sourceText, pattern), [sourceText, pattern]);

  const steps = activeAlgo === 'bruteForce' ? bfSteps : hpSteps;
  const currentStep = steps[stepIndex] || null;

  // Reset simulator if text, pattern or algorithm changes
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [sourceText, pattern, activeAlgo]);

  // Autoplay control
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speed, steps.length]);

  const handlePlayPause = () => {
    if (stepIndex >= steps.length - 1) {
      setStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSkipStart = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const handleSkipEnd = () => {
    setIsPlaying(false);
    setStepIndex(steps.length - 1);
  };

  // Helper to determine the style of text cells
  const getTextCellClass = (idx) => {
    if (!currentStep) return 'bg-dark-bg text-gray-500 border-dark-border';
    
    const { shiftIndex, activeTextIdx, status, matchedIndices, type } = currentStep;
    
    // Exact character index currently being compared
    if (idx === activeTextIdx) {
      if (status === 'char-match') return 'bg-neon-green/20 text-neon-green border-neon-green border shadow-[0_0_10px_rgba(16,185,129,0.2)] font-bold';
      if (status === 'mismatch') return 'bg-neon-rose/20 text-neon-rose border-neon-rose border shadow-[0_0_10px_rgba(244,63,94,0.2)] font-bold';
      return 'bg-neon-blue/20 text-neon-blue border-neon-blue border shadow-[0_0_10px_rgba(6,182,212,0.2)] font-bold';
    }

    // Match success frame: highlight all characters of this match
    if (status === 'success' && idx >= shiftIndex && idx < shiftIndex + pattern.length) {
      return 'bg-neon-green/30 text-white border-neon-green border font-bold animate-pulse-subtle';
    }

    // Check if this index was already matched in the current shift alignment
    const relativeOffset = idx - shiftIndex;
    if (
      idx >= shiftIndex && 
      idx < shiftIndex + pattern.length && 
      matchedIndices && 
      matchedIndices.includes(relativeOffset)
    ) {
      return 'bg-neon-green/10 text-neon-green border-neon-green/30 border';
    }

    // Is within the current pattern alignment but not compared yet (or skipped)
    if (idx >= shiftIndex && idx < shiftIndex + pattern.length) {
      return 'bg-dark-card text-gray-300 border-dark-border/80 border';
    }

    return 'bg-dark-bg/40 text-gray-600 border-dark-border/40 border-[0.5px]';
  };

  // Render narrative step badge
  const getBadgeClass = (status) => {
    switch (status) {
      case 'char-match': return 'bg-neon-green/10 text-neon-green border border-neon-green/20';
      case 'mismatch': return 'bg-neon-rose/10 text-neon-rose border border-neon-rose/20';
      case 'success': return 'bg-neon-green text-dark-bg font-bold shadow-lg shadow-neon-green/20';
      case 'shift': return 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20';
      default: return 'bg-dark-card border border-dark-border text-gray-400';
    }
  };

  if (!sourceText || !pattern) {
    return (
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="cyber-card p-12 text-center flex flex-col items-center justify-center gap-4">
          <HelpCircle className="w-12 h-12 text-gray-500 animate-pulse-subtle" />
          <p className="text-gray-400 font-medium">Please enter a source text and search pattern to unlock the step-by-step interactive simulator.</p>
        </div>
      </div>
    );
  }

  // Display only a slice of characters if text is extremely long (to avoid UI crash)
  const maxDisplayChars = 40;
  let textSliceStart = 0;
  if (currentStep) {
    // Center around activeTextIdx
    textSliceStart = Math.max(0, currentStep.activeTextIdx - Math.floor(maxDisplayChars / 2));
    // Limit slide window index
    if (textSliceStart + maxDisplayChars > sourceText.length) {
      textSliceStart = Math.max(0, sourceText.length - maxDisplayChars);
    }
  }
  const textSliceEnd = Math.min(sourceText.length, textSliceStart + maxDisplayChars);
  const textIndices = Array.from({ length: textSliceEnd - textSliceStart }, (_, idx) => textSliceStart + idx);

  return (
    <div className="max-w-7xl mx-auto px-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="cyber-card p-6 flex flex-col gap-6">
        {/* Header and Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dark-border pb-5">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-violet" />
              Algorithm Step-by-Step Theater
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Visualizing matching pointer states, character comparisons, and shift mechanics.
            </p>
          </div>
          
          <div className="flex bg-dark-bg p-1 rounded-xl border border-dark-border">
            <button
              onClick={() => setActiveAlgo('horspool')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeAlgo === 'horspool' 
                  ? 'bg-neon-green text-dark-bg font-bold shadow-md shadow-neon-green/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Horspool's (Right-to-Left)
            </button>
            <button
              onClick={() => setActiveAlgo('bruteForce')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeAlgo === 'bruteForce' 
                  ? 'bg-neon-blue text-dark-bg font-bold shadow-md shadow-neon-blue/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Brute Force (Left-to-Right)
            </button>
          </div>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-mono text-sm">
            Zero steps calculated. Make sure pattern is not empty or longer than source text.
          </div>
        ) : (
          <>
            {/* Visual Grid Container */}
            <div className="flex flex-col bg-dark-bg/60 border border-dark-border/50 rounded-2xl p-6 overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar pb-4">
                <div className="flex flex-col gap-3 min-w-max select-none">
                  {/* Row 1: Source Text Letters */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-24 text-[11px] font-mono text-gray-500 font-semibold uppercase tracking-wider">Source Text</span>
                    {textIndices.map((idx) => {
                      const char = sourceText[idx];
                      return (
                        <div key={`tx-${idx}`} className="flex flex-col items-center">
                          <span className="text-[9px] font-mono text-gray-600 mb-1 font-semibold">#{idx}</span>
                          <div className={`sim-char-box border ${getTextCellClass(idx)}`}>
                            {char === ' ' ? '␣' : char === '\n' ? '↵' : char}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 2: Pattern Letters aligned by shift index */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-24 text-[11px] font-mono text-gray-500 font-semibold uppercase tracking-wider">Pattern Shift</span>
                    {textIndices.map((idx) => {
                      if (!currentStep) return <div key={`pt-${idx}`} className="w-[44px]" />;
                      
                      const { shiftIndex, activePatternIdx, activeTextIdx, status } = currentStep;
                      const relIndex = idx - shiftIndex;
                      const isWithinPattern = relIndex >= 0 && relIndex < pattern.length;
                      
                      if (isWithinPattern) {
                        const char = pattern[relIndex];
                        const isMatch = idx === activeTextIdx && status === 'char-match';
                        const isMismatch = idx === activeTextIdx && status === 'mismatch';
                        const isActive = idx === activeTextIdx;
                        
                        let cellClass = 'bg-dark-card border-dark-border text-gray-300';
                        if (isMatch) cellClass = 'bg-neon-green/30 text-neon-green border-neon-green border-2 shadow-[0_0_10px_rgba(16,185,129,0.3)] font-bold';
                        else if (isMismatch) cellClass = 'bg-neon-rose/30 text-neon-rose border-neon-rose border-2 shadow-[0_0_10px_rgba(244,63,94,0.3)] font-bold';
                        else if (isActive) cellClass = 'bg-neon-blue/30 text-neon-blue border-neon-blue border-2 shadow-[0_0_10px_rgba(6,182,212,0.3)] font-bold';
                        else if (currentStep.status === 'success') cellClass = 'bg-neon-green/20 text-white border-neon-green border font-semibold';
                        
                        return (
                          <div key={`pt-${idx}`} className="flex flex-col items-center">
                            <div className={`sim-char-box border ${cellClass}`}>
                              {char === ' ' ? '␣' : char}
                            </div>
                            <span className="text-[9px] font-mono text-gray-500 mt-1 font-semibold">p{relIndex}</span>
                          </div>
                        );
                      }
                      
                      return <div key={`pt-${idx}`} className="w-[44px] h-[44px]" />;
                    })}
                  </div>
                </div>
              </div>
              
              {sourceText.length > maxDisplayChars && (
                <div className="text-[10px] text-gray-500 font-mono italic mt-2 text-right">
                  * Visualizing horizontal window ({textSliceStart} to {textSliceEnd - 1} of {sourceText.length} characters)
                </div>
              )}
            </div>

            {/* Playback Controls & Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
              {/* Playback Console (Left Column) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Control Panel */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-dark-bg/30 p-4 border border-dark-border rounded-2xl justify-between">
                  {/* Step Buttons */}
                  <div className="flex items-center gap-1.5 bg-dark-bg p-1 border border-dark-border rounded-xl">
                    <button
                      onClick={handleSkipStart}
                      disabled={stepIndex === 0}
                      className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors"
                      title="Skip to start"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePrev}
                      disabled={stepIndex === 0}
                      className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors"
                      title="Step backward"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className={`p-3 rounded-lg flex items-center justify-center font-bold text-dark-bg transition-all duration-300 shadow-md ${
                        isPlaying 
                          ? 'bg-neon-amber shadow-neon-amber/20 hover:bg-neon-amber/90' 
                          : 'bg-neon-blue shadow-neon-blue/20 hover:bg-neon-blue/90'
                      }`}
                      title={isPlaying ? 'Pause simulation' : 'Play simulation'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={stepIndex === steps.length - 1}
                      className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors"
                      title="Step forward"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSkipEnd}
                      disabled={stepIndex === steps.length - 1}
                      className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors"
                      title="Skip to end"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Playback speed slider */}
                  <div className="flex flex-1 items-center gap-3 w-full sm:w-auto sm:max-w-xs px-2">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Delay</span>
                    <input 
                      type="range" 
                      min="100" 
                      max="2000" 
                      step="100" 
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer accent-neon-blue"
                    />
                    <span className="text-xs font-mono font-bold text-neon-blue w-12 text-right">{speed}ms</span>
                  </div>

                  {/* Reset */}
                  <button
                    onClick={() => { setStepIndex(0); setIsPlaying(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold font-mono text-gray-400 hover:text-white bg-dark-bg border border-dark-border rounded-xl hover:border-gray-700 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>

                {/* Narrative Console */}
                <div className="cyber-card p-5 relative overflow-hidden bg-dark-card/90 border border-dark-border">
                  <div className="absolute top-0 right-0 p-3 flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-wider mb-3">
                    <Terminal className="w-4 h-4 text-neon-violet" />
                    Narrative Execution log
                  </div>

                  <div className="flex flex-col gap-4 font-mono leading-relaxed min-h-[100px]">
                    {currentStep ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${getBadgeClass(currentStep.status)}`}>
                            {currentStep.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Step {stepIndex + 1} of {steps.length}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200">
                          &gt; {currentStep.narrative}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        &gt; Idle. Press Play or Next Step to begin visualization.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Simulation Stats (Right Column) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="cyber-card p-5 flex flex-col gap-4 bg-dark-card border border-dark-border h-full justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-wider border-b border-dark-border pb-3">
                    <Activity className="w-4 h-4 text-neon-green" />
                    Live Trace Metrics
                  </div>

                  <div className="flex flex-col gap-3.5 my-2">
                    <div className="flex justify-between items-center bg-dark-bg/40 p-3 border border-dark-border/40 rounded-xl">
                      <span className="text-xs text-gray-500 font-mono">Comparisons</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {currentStep ? currentStep.comparisons : 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-dark-bg/40 p-3 border border-dark-border/40 rounded-xl">
                      <span className="text-xs text-gray-500 font-mono">Pattern Shifts</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {currentStep ? currentStep.shifts : 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-dark-bg/40 p-3 border border-dark-border/40 rounded-xl">
                      <span className="text-xs text-gray-500 font-mono">Matches Found</span>
                      <span className="text-lg font-bold text-neon-green font-mono">
                        {currentStep ? currentStep.matches.length : 0}
                      </span>
                    </div>
                  </div>

                  {/* Step Scrub Bar */}
                  <div className="flex flex-col gap-2 border-t border-dark-border pt-4">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500">
                      <span>Timeline Control</span>
                      <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={steps.length - 1}
                      value={stepIndex}
                      onChange={(e) => { setIsPlaying(false); setStepIndex(Number(e.target.value)); }}
                      className="w-full h-1.5 bg-dark-border rounded-lg appearance-none cursor-pointer accent-neon-violet"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlgorithmSimulator;
