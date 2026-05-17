import React from 'react';
import { Database, Search, FileText } from 'lucide-react';
import { sampleDocuments } from '../utils/samples';

const EditorPane = ({ sourceText, setSourceText, pattern, setPattern, onSampleLoad }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Source Text Database */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300 font-semibold">
            <Database className="w-4 h-4 text-neon-blue" />
            Source Text Database
          </div>
          <div className="relative group">
            <select 
              onChange={(e) => onSampleLoad(e.target.value)}
              className="bg-dark-card border border-dark-border text-gray-400 text-sm rounded-lg focus:ring-neon-blue focus:border-neon-blue block w-full p-2 outline-none appearance-none pr-8 cursor-pointer hover:border-gray-600 transition-colors"
              defaultValue=""
            >
              <option value="" disabled>Load Sample Document</option>
              {sampleDocuments.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FileText className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Paste your source text here or load a sample..."
          className="w-full h-64 lg:h-80 bg-dark-card border border-dark-border rounded-xl p-4 text-gray-300 font-mono text-sm focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none custom-scrollbar resize-none transition-all duration-300"
        />
      </div>

      {/* Search Pattern */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-300 font-semibold h-[42px]">
          <Search className="w-4 h-4 text-neon-green" />
          Search Pattern / Plagiarism Check
        </div>
        <div className="relative h-full">
          <textarea
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter the phrase or snippet to detect..."
            className="w-full h-full bg-dark-card border border-dark-border rounded-xl p-4 text-gray-300 font-mono text-sm focus:ring-1 focus:ring-neon-green focus:border-neon-green outline-none custom-scrollbar resize-none transition-all duration-300"
          />
          <div className="absolute bottom-4 right-4 text-xs font-mono text-gray-500">
            {pattern.length} characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPane;
