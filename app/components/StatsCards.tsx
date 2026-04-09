"use client";

interface StatsCardsProps {
  stats: any;
  isLoading: boolean;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      label: "TOTAL LEADS",
      value: stats?.total || 0,
      color: "var(--color-primary)",
      unit: "leads",
    },
    {
      label: "CONVERTED",
      value: stats?.signed || 0,
      color: "var(--color-status-interested)",
      unit: "partners",
    },
    {
      label: "IN PIPELINE",
      value: (stats?.negotiating || 0) + (stats?.interested || 0),
      color: "var(--color-status-negotiating)",
      unit: "active",
    },
    {
      label: "READY TO PITCH",
      value: stats?.notOnGlovo || 0,
      color: "var(--color-status-new)",
      unit: "vetted",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="glass-card p-8 animate-premium"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex flex-col gap-1">
            <span
              className="text-[10px] font-bold tracking-[0.2em] mb-4"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {card.label}
            </span>
            {isLoading ? (
              <div className="h-10 w-24 bg-white/5 animate-pulse rounded-lg" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light tracking-tight">
                  {card.value.toLocaleString()}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {card.unit}
                </span>
              </div>
            )}
            <div className="mt-4 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                 className="h-full rounded-full" 
                 style={{ 
                   width: '40%', 
                   background: card.color,
                   boxShadow: `0 0 10px ${card.color}88` 
                 }} 
               />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
