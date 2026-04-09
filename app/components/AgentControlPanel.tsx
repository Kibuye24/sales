"use client";

import { useState } from "react";

const AREAS = [
  "Westlands",
  "Nairobi CBD",
  "Karen",
  "Kilimani",
  "Lavington",
  "Kileleshwa",
  "Hurlingham",
  "South B/C",
  "Parklands",
  "Garden City / Thika Road",
];

const CATEGORIES = [
  { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { value: "cafe", label: "Café", emoji: "☕" },
  { value: "pharmacy", label: "Pharmacy", emoji: "💊" },
  { value: "grocery", label: "Grocery", emoji: "🥬" },
  { value: "bakery", label: "Bakery", emoji: "🍞" },
  { value: "fast_food", label: "Fast Food", emoji: "🍔" },
  { value: "bar_lounge", label: "Bar / Lounge", emoji: "🍸" },
  { value: "butchery", label: "Butchery", emoji: "🥩" },
  { value: "supermarket", label: "Supermarket", emoji: "🛒" },
  { value: "other", label: "Other", emoji: "📦" },
];

interface AgentControlPanelProps {
  onScrapeComplete?: () => void;
}

export default function AgentControlPanel({
  onScrapeComplete,
}: AgentControlPanelProps) {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    leads_found: number;
    leads_new: number;
    metadata?: { search_notes: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!selectedArea || !selectedCategory) return;

    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/agent/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: selectedArea,
          category: selectedCategory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Agent failed");
      }

      setResult(data);
      onScrapeComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="glass-card p-6 lg:p-8" aria-labelledby="agent-heading">
      <header className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--color-primary)", opacity: 0.9 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <div>
          <h2
            id="agent-heading"
            className="text-lg font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Lead Discovery Agent
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            AI-powered business discovery for Nairobi
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Area Select */}
        <div>
          <label
            htmlFor="area-select"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Target Area
          </label>
          <select
            id="area-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            disabled={isRunning}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2"
            style={{
              background: "var(--color-bg-input)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              transition: "var(--transition-fast)",
            }}
          >
            <option value="">Select area...</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                📍 {area}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div>
          <label
            htmlFor="category-select"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Business Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isRunning}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2"
            style={{
              background: "var(--color-bg-input)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              transition: "var(--transition-fast)",
            }}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Run Button */}
      <button
        id="run-agent-button"
        onClick={handleScrape}
        disabled={!selectedArea || !selectedCategory || isRunning}
        className="w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: isRunning
            ? "var(--color-bg-card)"
            : "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
          color: isRunning ? "var(--color-text-secondary)" : "white",
          border: isRunning ? "1px solid var(--color-border)" : "none",
          transition: "var(--transition-base)",
          boxShadow: isRunning ? "none" : "var(--shadow-glow-primary)",
        }}
      >
        {isRunning ? (
          <>
            <svg
              className="animate-spin-slow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Agent is researching...
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Run Lead Discovery
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div
          className="mt-4 p-4 rounded-xl animate-fade-in-up"
          style={{
            background: "color-mix(in srgb, var(--color-status-signed) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-status-signed) 25%, transparent)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-status-signed)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--color-status-signed)" }}
            >
              Discovery Complete
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Found <strong style={{ color: "var(--color-text)" }}>{result.leads_found}</strong> businesses
            {" · "}
            <strong style={{ color: "var(--color-primary)" }}>{result.leads_new}</strong> new leads added
          </p>
          {result.metadata?.search_notes && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {result.metadata.search_notes}
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mt-4 p-4 rounded-xl animate-fade-in-up"
          style={{
            background: "color-mix(in srgb, var(--color-status-rejected) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-status-rejected) 25%, transparent)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--color-status-rejected)" }}>
            ⚠ {error}
          </p>
        </div>
      )}
    </section>
  );
}
