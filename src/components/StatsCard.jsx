import React from 'react';
import { Activity, MousePointer2, MoveRight, Clock, Box, ShieldAlert, Award, Zap } from 'lucide-react';

const MetricItem = ({ icon: Icon, label, value, subValue, colorClass }) => (
  <div className="flex items-center gap-4 p-4 bg-dark-bg/60 border border-dark-border/40 rounded-xl hover:border-dark-border transition-colors duration-300">
    <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10 border border-current border-opacity-10`}>
      <Icon className={`w-4 h-4 ${colorClass}`} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-lg font-black text-gray-200 font-mono">{value}</span>
        {subValue && <span className="text-xs text-gray-500 font-mono">{subValue}</span>}
      </div>
    </div>
  </div>
);

export const StatsCard = ({ title, results, variant = 'blue' }) => {
  const colorClass = variant === 'blue' ? 'text-neon-blue' : 'text-neon-green';
  const accentBorder = variant === 'blue' ? 'border-neon-blue/30' : 'border-neon-green/30';
  const accentBg = variant === 'blue' ? 'bg-neon-blue/5' : 'bg-neon-green/5';

  return (
    <div className={`flex flex-col gap-4 p-6 rounded-2xl bg-dark-card border border-dark-border ${accentBg} transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]`}>
      
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <h3 className={`text-base font-bold font-mono tracking-tight ${colorClass} flex items-center gap-2.5`}>
          <Activity className="w-5 h-5" />
          {title}
        </h3>
        {results.matches.length > 0 ? (
          <span className="px-3 py-1 bg-neon-green/10 text-neon-green text-[10px] font-bold rounded-full border border-neon-green/20 font-mono uppercase tracking-wider">
            Match Found
          </span>
        ) : (
          <span className="px-3 py-1 bg-neon-rose/10 text-neon-rose text-[10px] font-bold rounded-full border border-neon-rose/20 font-mono uppercase tracking-wider animate-pulse-subtle">
            No Match
          </span>
        )}
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <MetricItem 
          icon={MousePointer2} 
          label="Char Comparisons" 
          value={results.comparisons} 
          colorClass={colorClass} 
        />
        <MetricItem 
          icon={MoveRight} 
          label="Pointer Shifts" 
          value={results.shifts} 
          colorClass={colorClass} 
        />
        <MetricItem 
          icon={Clock} 
          label="Execution Speed" 
          value={results.time < 0.001 ? "0.0001" : results.time.toFixed(4)} 
          subValue="ms"
          colorClass={colorClass} 
        />
        <MetricItem 
          icon={Box} 
          label="Big-O Complexity" 
          value={results.complexity.time} 
          subValue={results.complexity.space}
          colorClass={colorClass} 
        />
      </div>

      {/* Match Indexes Trace */}
      <div className="mt-2 flex items-center gap-3 p-3 bg-dark-bg/60 rounded-xl border border-dark-border/40">
        <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase tracking-wider">
          Matches ({results.matches.length}):
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            {results.matches.length > 0 ? (
              results.matches.slice(0, 12).map((idx, i) => (
                <span key={i} className="text-[10px] font-mono bg-dark-border px-2 py-0.5 rounded text-gray-300 font-bold border border-white/5">
                  @{idx}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-mono text-gray-600 italic">None found</span>
            )}
            {results.matches.length > 12 && <span className="text-[10px] text-gray-600 font-mono">+{results.matches.length - 12} more</span>}
          </div>
        </div>
      </div>

    </div>
  );
};

export const StatsComparison = ({ bruteForce, horspool }) => {
  if (!bruteForce || !horspool) return null;

  // Calculate comparisons speedup percentage
  const compDiff = bruteForce.comparisons - horspool.comparisons;
  const speedupFactor = horspool.comparisons > 0 
    ? (bruteForce.comparisons / horspool.comparisons).toFixed(1) 
    : '1.0';

  const bfPercent = 100;
  const hpPercent = bruteForce.comparisons > 0 
    ? Math.max(8, Math.round((horspool.comparisons / bruteForce.comparisons) * 100)) 
    : 100;

  return (
    <div className="cyber-card p-6 mt-6 bg-dark-card border border-dark-border flex flex-col gap-5 animate-in fade-in duration-500">
      
      {/* Benchmark Title */}
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <div className="flex items-center gap-2 text-gray-300 font-bold font-mono text-sm">
          <Award className="w-5 h-5 text-neon-violet text-glow-violet animate-pulse-subtle" />
          Algorithmic Space-Time Benchmark
        </div>
        
        {compDiff > 0 ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-neon-green/10 border border-neon-green/20 text-neon-green text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Horspool: {speedupFactor}x Less Work
          </span>
        ) : (
          <span className="px-3 py-1 bg-dark-bg border border-dark-border text-gray-500 text-[10px] font-bold rounded-full font-mono">
            Equal Performance
          </span>
        )}
      </div>

      {/* Side-by-Side Flex Bar Charts */}
      <div className="flex flex-col gap-4">
        {/* Comparisons Meter */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-mono text-gray-400">
            <span>Character Comparisons (Workload Density)</span>
            <span className="text-gray-500">Lower is better</span>
          </div>

          <div className="flex flex-col gap-2.5 bg-dark-bg/60 p-4 border border-dark-border/40 rounded-xl">
            {/* Brute Force Row */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-[10px] font-mono text-neon-blue uppercase tracking-wider font-semibold">Brute Force</span>
              <div className="flex-1 h-3 bg-dark-border rounded-full overflow-hidden">
                <div 
                  style={{ width: `${bfPercent}%` }} 
                  className="h-full bg-neon-blue rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                ></div>
              </div>
              <span className="w-16 text-xs text-right font-mono text-gray-300 font-bold">{bruteForce.comparisons}</span>
            </div>

            {/* Horspool Row */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-[10px] font-mono text-neon-green uppercase tracking-wider font-semibold">Horspool</span>
              <div className="flex-1 h-3 bg-dark-border rounded-full overflow-hidden">
                <div 
                  style={{ width: `${hpPercent}%` }} 
                  className="h-full bg-neon-green rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse-subtle"
                ></div>
              </div>
              <span className="w-16 text-xs text-right font-mono text-neon-green font-black">{horspool.comparisons}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory summary text */}
      <div className="flex items-start gap-2.5 p-3 bg-dark-bg/80 border border-dark-border/50 rounded-xl">
        <ShieldAlert className="w-4 h-4 text-neon-violet mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-gray-500 font-mono leading-relaxed">
          {compDiff > 0 ? (
            <>
              Horspool's bad character table skipped matching redundant positions, saving <strong>{compDiff}</strong> character comparisons. This translates to a workload reduction factor of <strong>{speedupFactor}x</strong>, proving the benefits of preprocessing search queries.
            </>
          ) : (
            <>
              Query length is too small or matching occurred immediately, resulting in equal comparison distributions. Larger patterns and datasets maximize Horspool's speedups.
            </>
          )}
        </p>
      </div>

    </div>
  );
};

export default StatsCard;
