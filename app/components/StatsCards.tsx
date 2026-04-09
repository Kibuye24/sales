"use client";

interface StatsCardsProps {
  stats: {
    total: number;
    new: number;
    contacted: number;
    interested: number;
    negotiating?: number;
    signed: number;
    notOnGlovo: number;
    byCategory: Record<string, number>;
    byArea: Record<string, number>;
  } | null;
  isLoading: boolean;
}

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Leads",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "var(--color-primary)",
    bgGlow: "rgba(0, 160, 130, 0.08)",
  },
  {
    key: "new",
    label: "New",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="16" />
        <line x1="8" x2="16" y1="12" y2="12" />
      </svg>
    ),
    color: "var(--color-status-new)",
    bgGlow: "rgba(59, 130, 246, 0.08)",
  },
  {
    key: "contacted",
    label: "Contacted",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    color: "var(--color-status-contacted)",
    bgGlow: "rgba(139, 92, 246, 0.08)",
  },
  {
    key: "interested",
    label: "Interested",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: "var(--color-status-interested)",
    bgGlow: "rgba(245, 158, 11, 0.08)",
  },
  {
    key: "signed",
    label: "Signed",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    color: "var(--color-status-signed)",
    bgGlow: "rgba(16, 185, 129, 0.08)",
  },
  {
    key: "notOnGlovo",
    label: "Not on Glovo",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
    color: "var(--color-accent)",
    bgGlow: "rgba(255, 194, 68, 0.08)",
  },
];

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-shimmer rounded-xl p-4"
            style={{
              height: "104px",
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {STAT_CARDS.map((card, index) => {
        const value = stats
          ? (stats[card.key as keyof typeof stats] as number) ?? 0
          : 0;

        return (
          <article
            key={card.key}
            className="glass-card p-4 animate-fade-in-up"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg"
                style={{
                  background: card.bgGlow,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
            </div>
            <p
              className="text-2xl font-bold tracking-tight"
              style={{ color: card.color }}
            >
              {value.toLocaleString()}
            </p>
            <p
              className="text-xs font-medium mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {card.label}
            </p>
          </article>
        );
      })}
    </div>
  );
}
