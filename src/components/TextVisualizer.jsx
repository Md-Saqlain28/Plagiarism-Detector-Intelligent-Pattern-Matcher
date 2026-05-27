import React from 'react';
import { Eye } from 'lucide-react';

const TextVisualizer = ({ text, pattern, matches }) => {
  if (!text) return null;

  // Function to render text with highlights
  const renderHighlightedText = () => {
    if (!pattern || matches.length === 0) return <span className="text-gray-400">{text}</span>;

    const result = [];
    let lastIndex = 0;
    const sortedMatches = [...matches].sort((a, b) => a - b);

    sortedMatches.forEach((matchIndex, i) => {
      // Text before match
      if (matchIndex > lastIndex) {
        result.push(
          <span key={`text-${i}`} className="text-gray-400">
            {text.substring(lastIndex, matchIndex)}
          </span>
        );
      }

      // The match itself
      result.push(
        <mark 
          key={`match-${i}`} 
          className="bg-neon-blue/30 text-white font-bold border-b-2 border-neon-blue px-0.5 rounded-sm animate-pulse-subtle"
        >
          {text.substring(matchIndex, matchIndex + pattern.length)}
        </mark>
      );

      lastIndex = matchIndex + pattern.length;
    });

    // Remaining text
    if (lastIndex < text.length) {
      result.push(
        <span key="text-end" className="text-gray-400">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-dark-card border border-dark-border mt-6">
      <div className="flex items-center gap-2 text-gray-300 font-semibold border-b border-dark-border pb-4">
        <Eye className="w-5 h-5 text-neon-green" />
        Source Visualization (Matches Highlighted)
      </div>
      
      <div className="bg-dark-bg p-6 rounded-xl border border-dark-border/50 max-h-96 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {renderHighlightedText()}
      </div>
    </div>
  );
};

export default TextVisualizer;
