import React from 'react';
import { Database, Search, FileText, Upload, Trash2, HelpCircle } from 'lucide-react';
import { sampleDocuments } from '../utils/samples';

const EditorPane = ({ sourceText, setSourceText, pattern, setPattern, onSampleLoad }) => {
  
  // File Upload Handlers
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'source') {
        setSourceText(event.target.result);
      } else {
        setPattern(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  // Metric Helpers
  const getMetrics = (text) => {
    if (!text) return { chars: 0, words: 0, sentences: 0 };
    return {
      chars: text.length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    };
  };

  const sourceMetrics = getMetrics(sourceText);
  const patternMetrics = getMetrics(pattern);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Source Text Database (Left Pane) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300 font-bold font-mono text-sm">
            <Database className="w-4 h-4 text-neon-blue" />
            Source Text Database
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Upload Button */}
            <label className="flex items-center gap-1.5 px-3 py-1 bg-dark-bg/60 border border-dark-border text-xs font-mono text-gray-400 hover:text-white rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload file
              <input 
                type="file" 
                accept=".txt" 
                onChange={(e) => handleFileUpload(e, 'source')} 
                className="hidden" 
              />
            </label>
            
            {/* Sample Selector */}
            <div className="relative group">
              <select 
                onChange={(e) => onSampleLoad(e.target.value)}
                className="bg-dark-card border border-dark-border text-gray-400 text-xs font-mono rounded-lg focus:ring-1 focus:ring-neon-blue focus:border-neon-blue block p-1.5 outline-none appearance-none pr-8 cursor-pointer hover:border-gray-700 transition-colors"
                defaultValue=""
              >
                <option value="" disabled>Load Sample</option>
                {sampleDocuments.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group/textarea">
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Paste your original source document database here or load a sample above..."
            className="w-full h-64 lg:h-80 bg-dark-card/60 border border-dark-border rounded-2xl p-5 text-gray-300 font-mono text-sm focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none custom-scrollbar resize-none transition-all duration-300 shadow-inner"
          />
          {sourceText && (
            <button 
              onClick={() => setSourceText('')}
              className="absolute top-4 right-4 p-1.5 bg-dark-bg/85 border border-dark-border rounded-lg text-gray-400 hover:text-neon-rose hover:border-neon-rose/30 transition-all shadow-md cursor-pointer"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Text Info Footer Bar */}
        <div className="flex gap-4 px-3 py-2 bg-dark-bg/40 border border-dark-border/40 rounded-xl font-mono text-[10px] text-gray-500">
          <span>Chars: <strong className="text-gray-300 font-bold">{sourceMetrics.chars}</strong></span>
          <span>Words: <strong className="text-gray-300 font-bold">{sourceMetrics.words}</strong></span>
          <span>Sentences: <strong className="text-gray-300 font-bold">{sourceMetrics.sentences}</strong></span>
        </div>
      </div>

      {/* Search Pattern (Right Pane) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300 font-bold font-mono text-sm">
            <Search className="w-4 h-4 text-neon-green" />
            Search Pattern / Suspicious Snippet
          </div>
          
          <label className="flex items-center gap-1.5 px-3 py-1 bg-dark-bg/60 border border-dark-border text-xs font-mono text-gray-400 hover:text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Upload snippet
            <input 
              type="file" 
              accept=".txt" 
              onChange={(e) => handleFileUpload(e, 'pattern')} 
              className="hidden" 
            />
          </label>
        </div>

        <div className="relative group/textarea">
          <textarea
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Type or paste the suspicious query string / plagiarism query phrase here..."
            className="w-full h-64 lg:h-80 bg-dark-card/60 border border-dark-border rounded-2xl p-5 text-gray-300 font-mono text-sm focus:ring-2 focus:ring-neon-green/30 focus:border-neon-green outline-none custom-scrollbar resize-none transition-all duration-300 shadow-inner"
          />
          {pattern && (
            <button 
              onClick={() => setPattern('')}
              className="absolute top-4 right-4 p-1.5 bg-dark-bg/85 border border-dark-border rounded-lg text-gray-400 hover:text-neon-rose hover:border-neon-rose/30 transition-all shadow-md cursor-pointer"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Pattern Text Info Footer Bar */}
        <div className="flex gap-4 px-3 py-2 bg-dark-bg/40 border border-dark-border/40 rounded-xl font-mono text-[10px] text-gray-500">
          <span>Chars: <strong className="text-gray-300 font-bold">{patternMetrics.chars}</strong></span>
          <span>Words: <strong className="text-gray-300 font-bold">{patternMetrics.words}</strong></span>
          <span>Sentences: <strong className="text-gray-300 font-bold">{patternMetrics.sentences}</strong></span>
        </div>
      </div>

    </div>
  );
};

export default EditorPane;
