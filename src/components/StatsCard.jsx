import React from 'react';
import { Activity, MousePointer2, MoveRight, Clock, Box } from 'lucide-react';

const MetricItem = ({ icon: Icon, label, value, subValue, colorClass }) => (
  <div className="flex items-center gap-4 p-4 bg-dark-bg/50 border border-dark-border/50 rounded-lg">
    <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
      <Icon className={`w-4 h-4 ${colorClass}`} />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-gray-200">{value}</span>
        {subValue && <span className="text-xs text-gray-500 font-mono">{subValue}</span>}
      </div>
    </div>
  </div>
);

const StatsCard = ({ title, results, variant = 'blue' }) => {
  const colorClass = variant === 'blue' ? 'text-neon-blue' : 'text-neon-green';
  const accentBorder = variant === 'blue' ? 'border-neon-blue/30' : 'border-neon-green/30';
  const accentBg = variant === 'blue' ? 'bg-neon-blue/5' : 'bg-neon-green/5';

  return (
    <div className={`flex flex-col gap-4 p-6 rounded-2xl bg-dark-card border border-dark-border ${accentBg} transition-all duration-500 hover:scale-[1.01]`}>
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <h3 className={`text-xl font-bold ${colorClass} flex items-center gap-2`}>
          <Activity className="w-5 h-5" />
          {title}
        </h3>
        {results.matches.length > 0 ? (
          <span className="px-3 py-1 bg-neon-green/10 text-neon-green text-xs font-bold rounded-full border border-neon-green/20">
            MATCH FOUND
          </span>
        ) : (
          <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full border border-red-500/20">
            NO MATCH
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricItem 
          icon={MousePointer2} 
          label="Comparisons" 
          value={results.comparisons} 
          colorClass={colorClass} 
        />
        <MetricItem 
          icon={MoveRight} 
          label="Total Shifts" 
          value={results.shifts} 
          colorClass={colorClass} 
        />
        <MetricItem 
          icon={Clock} 
          label="Exec Time" 
          value={results.time.toFixed(4)} 
          subValue="ms"
          colorClass={colorClass} 
        />
        <MetricItem 
          icon={Box} 
          label="Complexity" 
          value={results.complexity.time} 
          subValue={results.complexity.space}
          colorClass={colorClass} 
        />
      </div>

      <div className="mt-2 flex items-center gap-2 p-3 bg-dark-bg/80 rounded-lg border border-dark-border/50">
        <span className="text-xs font-mono text-gray-500 italic">
          Occurrences: <span className={colorClass}>{results.matches.length}</span>
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
            {results.matches.slice(0, 10).map((idx, i) => (
              <span key={i} className="text-[10px] font-mono bg-dark-border px-2 py-0.5 rounded text-gray-400">
                @{idx}
              </span>
            ))}
            {results.matches.length > 10 && <span className="text-[10px] text-gray-600">...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
