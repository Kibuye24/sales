"use client";

interface AreaBreakdownProps {
  byArea: Record<string, number>;
  byCategory: Record<string, number>;
  isLoading: boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  pharmacy: "💊",
  grocery: "🥬",
  bakery: "🍞",
  fast_food: "🍔",
  bar_lounge: "🍸",
  butchery: "🥩",
  supermarket: "🛒",
  other: "📦",
};

const AREA_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-status-new)",
  "var(--color-status-contacted)",
  "var(--color-status-interested)",
  "var(--color-status-negotiating)",
  "var(--color-status-signed)",
  "var(--color-status-rejected)",
  "#06b6d4",
  "#84cc16",
];

export default function AreaBreakdown({
  byArea,
  byCategory,
  isLoading,
}: AreaBreakdownProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-shimmer rounded-xl h-64" />
        ))}
      </div>
    );
  }

  const areaEntries = Object.entries(byArea).sort((a, b) => b[1] - a[1]);
  const catEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxArea = areaEntries.length > 0 ? areaEntries[0][1] : 1;
  const maxCat = catEntries.length > 0 ? catEntries[0][1] : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* By Area */}
      <section className="glass-card p-6" aria-labelledby="area-breakdown-heading">
        <h3
          id="area-breakdown-heading"
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Leads by Area
        </h3>
        <div className="space-y-3">
          {areaEntries.length === 0 && (
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No data yet
            </p>
          )}
          {areaEntries.map(([area, count], idx) => (
            <div key={area}>
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  📍 {area}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: AREA_COLORS[idx % AREA_COLORS.length] }}
                >
                  {count}
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--color-bg)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(count / maxArea) * 100}%`,
                    background: AREA_COLORS[idx % AREA_COLORS.length],
                    transition: "width var(--transition-slow)",
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* By Category */}
      <section className="glass-card p-6" aria-labelledby="category-breakdown-heading">
        <h3
          id="category-breakdown-heading"
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Leads by Category
        </h3>
        <div className="space-y-3">
          {catEntries.length === 0 && (
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No data yet
            </p>
          )}
          {catEntries.map(([cat, count], idx) => (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {CATEGORY_EMOJIS[cat] || "📦"} {cat.replace("_", " ")}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: AREA_COLORS[idx % AREA_COLORS.length] }}
                >
                  {count}
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--color-bg)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(count / maxCat) * 100}%`,
                    background: AREA_COLORS[idx % AREA_COLORS.length],
                    transition: "width var(--transition-slow)",
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
