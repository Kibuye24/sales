"use client";

interface AreaBreakdownProps {
  byArea: Record<string, number>;
  byCategory: Record<string, number>;
  isLoading: boolean;
}

export default function AreaBreakdown({
  byArea,
  byCategory,
  isLoading,
}: AreaBreakdownProps) {
  const areas = Object.entries(byArea).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = Object.values(byArea).reduce((acc, val) => acc + val, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-premium" style={{ animationDelay: '200ms' }}>
      <div className="glass-card p-10">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-10">Area Distribution</h3>
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-4 bg-white/5 rounded-full animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-8">
            {areas.length > 0 ? areas.map(([name, count], i) => (
              <div key={name} className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-bold tracking-widest text-white/60 uppercase">{name}</span>
                   <span className="text-[10px] font-bold text-white/20">{Math.round((count / total) * 100)}%</span>
                </div>
                <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                   <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(count / total) * 100}%`,
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                        boxShadow: '0 0 10px rgba(0, 160, 130, 0.4)',
                        transitionDelay: `${i * 100}ms`
                      }}
                   />
                </div>
              </div>
            )) : (
              <p className="text-xs text-white/20 italic">No distribution data calibrated</p>
            )}
          </div>
        )}
      </div>

      <div className="glass-card p-10">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-10">Category Saturation</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(byCategory).map(([cat, count]) => (
            <div 
              key={cat} 
              className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-1 min-w-[120px]"
            >
               <span className="text-[9px] font-bold text-white/20 tracking-[0.1em] uppercase">{cat}</span>
               <span className="text-lg font-light">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
