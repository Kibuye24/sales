"use client";

import { LeadStatus, LeadSource, BusinessCategory } from "@/lib/types";

interface LeadsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  areaFilter: string;
  onAreaFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (value: string) => void;
  totalResults: number;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "negotiating",
  "signed",
  "rejected",
  "churned",
];

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

const CATEGORIES: BusinessCategory[] = [
  "restaurant",
  "cafe",
  "pharmacy",
  "grocery",
  "bakery",
  "fast_food",
  "bar_lounge",
  "butchery",
  "supermarket",
  "other",
];

const SOURCES: LeadSource[] = [
  "google_maps",
  "social_media",
  "google_my_business",
  "linkedin",
  "referral",
  "trade_association",
  "street_canvassing",
  "manual",
];

const selectStyles = {
  background: "var(--color-bg-input)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
  transition: "var(--transition-fast)",
};

export default function LeadsFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  areaFilter,
  onAreaFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sourceFilter,
  onSourceFilterChange,
  totalResults,
}: LeadsFilterBarProps) {
  const hasFilters =
    search || statusFilter || areaFilter || categoryFilter || sourceFilter;

  return (
    <div className="glass-card p-4 lg:p-6">
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="lead-search"
          type="search"
          placeholder="Search businesses, areas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
          style={{
            ...selectStyles,
            borderColor: search ? "var(--color-primary)" : "var(--color-border)",
          }}
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer focus:outline-none"
          style={selectStyles}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          id="area-filter"
          value={areaFilter}
          onChange={(e) => onAreaFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer focus:outline-none"
          style={selectStyles}
        >
          <option value="">All Areas</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer focus:outline-none"
          style={selectStyles}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1).replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          id="source-filter"
          value={sourceFilter}
          onChange={(e) => onSourceFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer focus:outline-none"
          style={selectStyles}
        >
          <option value="">All Sources</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Results count & clear */}
        <div className="flex items-center gap-3 ml-auto">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {totalResults.toLocaleString()} lead{totalResults !== 1 ? "s" : ""}
          </span>
          {hasFilters && (
            <button
              id="clear-filters"
              onClick={() => {
                onSearchChange("");
                onStatusFilterChange("");
                onAreaFilterChange("");
                onCategoryFilterChange("");
                onSourceFilterChange("");
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
              style={{
                color: "var(--color-status-rejected)",
                background: "color-mix(in srgb, var(--color-status-rejected) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-status-rejected) 20%, transparent)",
                transition: "var(--transition-fast)",
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
