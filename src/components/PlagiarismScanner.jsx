import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  AlertTriangle, CheckCircle2, FileText, Printer, ArrowRight, 
  BookOpen, Sparkles, Layers, Info, Trash2, Upload
} from 'lucide-react';
import { horspoolMatch } from '../utils/algorithms';
import { sampleDocuments } from '../utils/samples';

const PlagiarismScanner = () => {
  const [sourceDoc, setSourceDoc] = useState('');
  const [suspiciousDoc, setSuspiciousDoc] = useState('');
  const [activeMatch, setActiveMatch] = useState(null); // { sourceIdx, length, sentenceText }
  const [showReport, setShowReport] = useState(false);

  const sourceContainerRef = useRef(null);
  const suspiciousContainerRef = useRef(null);

  // Initialize with samples
  useEffect(() => {
    if (sampleDocuments.length >= 2) {
      setSourceDoc(sampleDocuments[0].content);
      // Let's create a suspicious document that plagiarizes some of the source doc
      const suspiciousText = `Introduction: This is an academic research review. 
Neither party shall be liable for any indirect, incidental, special, or consequential damages.
Also we have some unique text here that shouldn't match. 
This Agreement shall be governed by and construed in accordance with the laws of the State of California.
End of the document text.`;
      setSuspiciousDoc(suspiciousText);
    }
  }, []);

  // Split suspicious document into sentences
  const suspiciousSentences = useMemo(() => {
    if (!suspiciousDoc) return [];
    // Regex to split on periods, question marks, newlines, exclamation marks, keeping them
    const rawMatches = suspiciousDoc.split(/([.!?\n])/g);
    
    const sentences = [];
    let currentSentence = '';

    for (let item of rawMatches) {
      if (!item) continue;
      currentSentence += item;
      
      // If it's a delimiter or newline, commit the sentence
      if (/[.!?\n]/.test(item)) {
        const trimmed = currentSentence.trim();
        if (trimmed) {
          sentences.push({
            text: trimmed,
            isDelimiter: /^\n+$/.test(currentSentence)
          });
        }
        currentSentence = '';
      }
    }
    // Append any trailing text
    if (currentSentence.trim()) {
      sentences.push({
        text: currentSentence.trim(),
        isDelimiter: false
      });
    }
    return sentences;
  }, [suspiciousDoc]);

  // Plagiarism Analysis
  const analysis = useMemo(() => {
    if (!sourceDoc || suspiciousSentences.length === 0) {
      return { 
        score: 0, 
        sentences: [], 
        plagiarizedChars: 0, 
        totalChars: suspiciousDoc.length || 0,
        matchesList: []
      };
    }

    let plagiarizedChars = 0;
    const analyzedSentences = [];
    const matchesList = [];

    suspiciousSentences.forEach((item, sIdx) => {
      // Don't check tiny sentences (under 10 chars) or empty line spacing
      if (item.text.length < 12 || item.isDelimiter) {
        analyzedSentences.push({
          ...item,
          isPlagiarized: false,
          sourceIndex: -1
        });
        return;
      }

      // Run Horspool matching
      const query = item.text;
      const res = horspoolMatch(sourceDoc, query);

      if (res.matches.length > 0) {
        plagiarizedChars += query.length;
        const sourceIndex = res.matches[0]; // Take first match index
        
        analyzedSentences.push({
          ...item,
          isPlagiarized: true,
          sourceIndex
        });

        matchesList.push({
          id: sIdx,
          sentenceText: query,
          sourceIndex,
          length: query.length
        });
      } else {
        analyzedSentences.push({
          ...item,
          isPlagiarized: false,
          sourceIndex: -1
        });
      }
    });

    const totalChars = suspiciousDoc.replace(/\s/g, '').length || 1;
    const plagiarizedCharsNoSpaces = analyzedSentences
      .filter(s => s.isPlagiarized)
      .reduce((sum, s) => sum + s.text.replace(/\s/g, '').length, 0);

    const score = Math.min(100, Math.round((plagiarizedCharsNoSpaces / totalChars) * 1000) / 10);

    return {
      score,
      sentences: analyzedSentences,
      plagiarizedChars: plagiarizedCharsNoSpaces,
      totalChars,
      matchesList
    };
  }, [sourceDoc, suspiciousSentences, suspiciousDoc]);

  // Handle sentence clicking and synchronizing scrolling
  const handleSentenceClick = (sourceIndex, length, sentenceText) => {
    setActiveMatch({ sourceIdx: sourceIndex, length, sentenceText });
    
    // Find the matching element in source pane and scroll it
    setTimeout(() => {
      const sourceElement = document.getElementById(`source-char-${sourceIndex}`);
      if (sourceElement && sourceContainerRef.current) {
        const container = sourceContainerRef.current;
        const elementOffsetTop = sourceElement.offsetTop;
        const containerHeight = container.clientHeight;
        
        // Scroll smoothly to center the element
        container.scrollTo({
          top: elementOffsetTop - containerHeight / 2 + 20,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  // Get severity styles
  const getSeverity = (score) => {
    if (score < 10) return { label: 'Low Risk', color: 'text-neon-green border-neon-green/30 bg-neon-green/5', stroke: '#10b981' };
    if (score < 30) return { label: 'Moderate Plagiarism', color: 'text-neon-amber border-neon-amber/30 bg-neon-amber/5', stroke: '#f59e0b' };
    if (score < 70) return { label: 'Significant Overlap', color: 'text-orange-500 border-orange-500/30 bg-orange-500/5', stroke: '#f97316' };
    return { label: 'Critical Plagiarism Risk', color: 'text-neon-rose border-neon-rose/30 bg-neon-rose/5 animate-pulse-subtle', stroke: '#f43f5e' };
  };

  const severity = getSeverity(analysis.score);

  // SVG parameters for radial gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.score / 100) * circumference;

  // File Upload Handlers
  const handleFileUpload = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (target === 'source') setSourceDoc(event.target.result);
      else setSuspiciousDoc(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Metrics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Plagiarism Gauge (4 Cols) */}
        <div className="lg:col-span-4 cyber-card p-6 flex items-center justify-center bg-dark-card border border-dark-border">
          <div className="flex flex-col items-center text-center gap-4">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider">Document Plagiarism Score</h4>
            
            <div className="relative flex items-center justify-center">
              <svg className="radial-progress-gauge w-36 h-36">
                <circle className="bg" cx="72" cy="72" r="50" />
                <circle 
                  className="fg" 
                  cx="72" 
                  cy="72" 
                  r="50" 
                  stroke={severity.stroke} 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 72 72)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-mono">{analysis.score}%</span>
                <span className="text-[10px] text-gray-500 font-mono">Overlap</span>
              </div>
            </div>

            <span className={`px-4 py-1 rounded-full text-xs font-bold border ${severity.color}`}>
              {severity.label}
            </span>
          </div>
        </div>

        {/* Analytics Breakdown & Uploads (8 Cols) */}
        <div className="lg:col-span-8 cyber-card p-6 flex flex-col justify-between bg-dark-card border border-dark-border">
          <div>
            <div className="flex justify-between items-center border-b border-dark-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-neon-violet" />
                <h4 className="text-sm font-mono text-white font-bold uppercase tracking-wider">Analysis Analytics</h4>
              </div>
              <button
                onClick={() => setShowReport(true)}
                disabled={!sourceDoc || !suspiciousDoc}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-neon-violet bg-neon-violet/10 border border-neon-violet/20 rounded-xl hover:bg-neon-violet hover:text-dark-bg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Generate Audit Report
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-bg/60 border border-dark-border/40 p-4 rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Total Sentences</span>
                <span className="text-xl font-bold text-gray-200 mt-1 font-mono">
                  {suspiciousSentences.filter(s => !s.isDelimiter).length}
                </span>
              </div>

              <div className="bg-dark-bg/60 border border-dark-border/40 p-4 rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Flagged Matches</span>
                <span className="text-xl font-bold text-neon-rose mt-1 font-mono">
                  {analysis.sentences.filter(s => s.isPlagiarized).length}
                </span>
              </div>

              <div className="bg-dark-bg/60 border border-dark-border/40 p-4 rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Overlapping Characters</span>
                <span className="text-xl font-bold text-neon-amber mt-1 font-mono">
                  {analysis.plagiarizedChars}
                </span>
              </div>

              <div className="bg-dark-bg/60 border border-dark-border/40 p-4 rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Reference Size</span>
                <span className="text-xl font-bold text-neon-blue mt-1 font-mono">
                  {sourceDoc.length} <span className="text-xs text-gray-600">B</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick upload tools */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-dark-border/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <Info className="w-3.5 h-3.5 text-neon-blue" />
              Upload files or select samples to instantly trigger Horspool-optimized document auditing.
            </div>
            
            <div className="flex gap-3 ml-auto">
              <button 
                onClick={() => { setSourceDoc(''); setSuspiciousDoc(''); setActiveMatch(null); }}
                className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-400 hover:text-white bg-dark-bg border border-dark-border rounded-lg hover:border-red-500/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Scrolling Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Pane: Source Document */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300 font-bold font-mono text-sm">
              <BookOpen className="w-4 h-4 text-neon-blue" />
              Document A: Source Repository (Database)
            </div>
            <label className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-neon-blue cursor-pointer transition-colors">
              <Upload className="w-3 h-3" />
              Upload Source
              <input type="file" accept=".txt" onChange={(e) => handleFileUpload(e, 'source')} className="hidden" />
            </label>
          </div>
          
          <div 
            ref={sourceContainerRef}
            className="w-full h-[450px] bg-dark-card border border-dark-border rounded-2xl p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed whitespace-pre-wrap select-text relative"
          >
            {sourceDoc ? (
              sourceDoc.split('').map((char, idx) => {
                // Determine if this character resides in the highlighted active plagiarism match
                let isHighlighted = false;
                if (activeMatch) {
                  const { sourceIdx, length } = activeMatch;
                  isHighlighted = idx >= sourceIdx && idx < sourceIdx + length;
                }
                
                return (
                  <span 
                    key={idx} 
                    id={`source-char-${idx}`}
                    className={`transition-all duration-300 ${
                      isHighlighted 
                        ? 'bg-neon-blue/20 text-white font-bold border-b-2 border-neon-blue px-0.5 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.1)]' 
                        : 'text-gray-400'
                    }`}
                  >
                    {char}
                  </span>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 italic gap-2 select-none">
                <FileText className="w-8 h-8 opacity-40" />
                <span>Load or paste a reference source document...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Suspicious Document */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300 font-bold font-mono text-sm">
              <AlertTriangle className="w-4 h-4 text-neon-rose" />
              Document B: Suspicious Document (Auditee)
            </div>
            <label className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-neon-rose cursor-pointer transition-colors">
              <Upload className="w-3 h-3" />
              Upload Auditee
              <input type="file" accept=".txt" onChange={(e) => handleFileUpload(e, 'suspicious')} className="hidden" />
            </label>
          </div>

          <div 
            ref={suspiciousContainerRef}
            className="w-full h-[450px] bg-dark-card border border-dark-border rounded-2xl p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed whitespace-pre-wrap relative"
          >
            {suspiciousDoc ? (
              analysis.sentences.map((item, idx) => {
                if (item.isDelimiter) {
                  return <span key={idx} className="block h-2" />;
                }

                if (item.isPlagiarized) {
                  const isActive = activeMatch && activeMatch.sentenceText === item.text;
                  return (
                    <mark 
                      key={idx}
                      onClick={() => handleSentenceClick(item.sourceIndex, item.text.length, item.text)}
                      className={`cursor-pointer transition-all duration-300 block my-1 p-1 rounded border-l-4 rounded-r-lg ${
                        isActive 
                          ? 'bg-neon-rose/25 text-white border-neon-rose font-bold shadow-[0_0_15px_rgba(244,63,94,0.15)] scale-[1.005]' 
                          : 'bg-neon-rose/10 hover:bg-neon-rose/20 text-neon-rose border-neon-rose/40 border-dashed hover:scale-[1.002]'
                      }`}
                      title="Plagiarized segment found! Click to scroll Source to match."
                    >
                      <span className="flex items-start gap-2">
                        <span className="inline-flex mt-1 items-center justify-center p-0.5 rounded bg-neon-rose/20 text-[9px] font-bold">PLAGIARISM</span>
                        <span className="flex-1">{item.text}</span>
                      </span>
                    </mark>
                  );
                }

                return (
                  <span key={idx} className="text-gray-400 block my-1">
                    {item.text}
                  </span>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 italic gap-2 select-none">
                <FileText className="w-8 h-8 opacity-40" />
                <span>Paste the suspicious document to scan...</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Plagiarism Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="cyber-card max-w-3xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar bg-dark-card border border-dark-border shadow-2xl p-8 relative flex flex-col gap-6">
            
            <div className="flex justify-between items-center border-b border-dark-border pb-4 no-print">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-violet" />
                Plagiarism Audit Report
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neon-green text-dark-bg rounded-lg hover:opacity-90 font-mono transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="px-3 py-1.5 text-xs font-semibold bg-dark-bg text-gray-400 hover:text-white border border-dark-border rounded-lg transition-all font-mono cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Area Starts */}
            <div className="print:p-6 print:text-black flex flex-col gap-6">
              <div className="flex flex-col gap-2 border-b-2 border-dark-border print:border-black pb-4">
                <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                  ALGO-MATCH AUDIT ENGINE
                </h1>
                <p className="text-xs font-mono text-gray-400 print:text-gray-600">
                  Document Integrity and Source Plagiarism Analysis Report
                </p>
                <p className="text-[10px] font-mono text-gray-500">
                  Analysis Date: {new Date().toLocaleString()} | Algorithm: Horspool's Input Enhancement
                </p>
              </div>

              {/* Stats Split Grid */}
              <div className="grid grid-cols-3 gap-6 p-5 bg-dark-bg/60 border border-dark-border rounded-2xl print:bg-gray-100 print:border-gray-300">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Plagiarism Score</span>
                  <span className="text-3xl font-extrabold text-neon-rose print:text-red-600 mt-1 font-mono">{analysis.score}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Severity Category</span>
                  <span className="text-sm font-bold text-white print:text-black mt-2">{severity.label}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Verbatim Overlaps</span>
                  <span className="text-lg font-bold text-gray-300 print:text-black mt-1 font-mono">{analysis.matchesList.length} segments</span>
                </div>
              </div>

              {/* Document Overview */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 print:text-gray-800">
                  Analyzed Content Metrics
                </h4>
                <table className="w-full border-collapse text-left font-mono text-xs text-gray-400 print:text-black">
                  <thead>
                    <tr className="border-b border-dark-border print:border-gray-300">
                      <th className="py-2">Metric</th>
                      <th className="py-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dark-border/40 print:border-gray-200">
                      <td className="py-2">Total Characters Checked</td>
                      <td className="py-2 text-right font-bold text-white print:text-black">{analysis.totalChars} characters</td>
                    </tr>
                    <tr className="border-b border-dark-border/40 print:border-gray-200">
                      <td className="py-2">Plagiarized Overlaps (No Spaces)</td>
                      <td className="py-2 text-right font-bold text-neon-rose print:text-red-600">{analysis.plagiarizedChars} characters</td>
                    </tr>
                    <tr className="border-b border-dark-border/40 print:border-gray-200">
                      <td className="py-2">Original Document Size</td>
                      <td className="py-2 text-right font-bold text-neon-blue print:text-blue-700">{sourceDoc.length} characters</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Matched Sentence Listing */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 print:text-gray-800 border-b border-dark-border print:border-gray-300 pb-2">
                  Detailed Verbatim Match Inventory ({analysis.matchesList.length})
                </h4>

                {analysis.matchesList.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {analysis.matchesList.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-dark-bg/40 border border-dark-border/60 rounded-xl print:bg-white print:border-gray-300 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-neon-rose font-bold uppercase">Overlap Segment #{idx + 1}</span>
                          <span className="text-gray-500">Source Text Offset: @{item.sourceIndex} (len: {item.length})</span>
                        </div>
                        <p className="text-xs text-gray-200 print:text-black italic bg-dark-bg/85 print:bg-gray-50 p-2 border border-dark-border/30 rounded font-mono leading-relaxed">
                          "{item.sentenceText}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-neon-green font-mono uppercase bg-neon-green/5 border border-neon-green/20 rounded-xl">
                    No matching plagiarized sequences discovered in this review.
                  </div>
                )}
              </div>
            </div>
            {/* Printable Area Ends */}

          </div>
        </div>
      )}

    </div>
  );
};

export default PlagiarismScanner;
