"use client";

import { Lead, LeadStatus } from "@/lib/types";
import { useState } from "react";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onStatusChange?: (id: string, status: LeadStatus) => void;
  onLeadClick?: (lead: Lead) => void;
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

function PriorityStars({ priority }: { priority: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Priority ${priority} of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={star <= priority ? "var(--color-accent)" : "none"}
          stroke={star <= priority ? "var(--color-accent)" : "var(--color-text-tertiary)"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function LeadsTable({
  leads,
  isLoading,
  onStatusChange,
  onLeadClick,
}: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-shimmer h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4"
          style={{ background: "var(--color-bg-elevated)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--color-text)" }}
        >
          No leads yet
        </h3>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Run the Lead Discovery Agent above to start finding businesses
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
              }}
            >
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                Business
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: "var(--color-text-tertiary)" }}>
                Area
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: "var(--color-text-tertiary)" }}>
                Rating
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: "var(--color-text-tertiary)" }}>
                Priority
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: "var(--color-text-tertiary)" }}>
                Contact
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <>
                <tr
                  key={lead.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    setExpandedId(expandedId === lead.id ? null : lead.id);
                    onLeadClick?.(lead);
                  }}
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    transition: "var(--transition-fast)",
                    animationDelay: `${index * 30}ms`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--color-bg-card-hover)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Business Name & Category */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`priority-bar priority-${lead.priority} hidden lg:block`}
                        style={{ alignSelf: "stretch" }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{CATEGORY_EMOJIS[lead.category] || "📦"}</span>
                          <span
                            className="font-semibold text-sm"
                            style={{ color: "var(--color-text)" }}
                          >
                            {lead.business_name}
                          </span>
                        </div>
                        <span
                          className="text-xs capitalize"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          {lead.category.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Area */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      📍 {lead.area || "—"}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    {lead.google_rating ? (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-accent)" }}
                        >
                          ⭐ {lead.google_rating}
                        </span>
                        {lead.google_reviews && (
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            ({lead.google_reviews})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "var(--color-text-tertiary)" }}>
                        —
                      </span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <PriorityStars priority={lead.priority} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <select
                      id={`status-select-${lead.id}`}
                      value={lead.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange?.(
                          lead.id,
                          e.target.value as LeadStatus
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`status-badge status-${lead.status} cursor-pointer border-0 text-xs font-semibold`}
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        paddingRight: "var(--space-4)",
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center w-7 h-7 rounded-lg"
                          style={{
                            background: "var(--color-bg-elevated)",
                            color: "var(--color-status-signed)",
                            transition: "var(--transition-fast)",
                          }}
                          title={lead.phone}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </a>
                      )}
                      {lead.instagram && (
                        <a
                          href={`https://instagram.com/${lead.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center w-7 h-7 rounded-lg"
                          style={{
                            background: "var(--color-bg-elevated)",
                            color: "var(--color-status-negotiating)",
                            transition: "var(--transition-fast)",
                          }}
                          title={`@${lead.instagram}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </a>
                      )}
                      {lead.google_maps_url && (
                        <a
                          href={lead.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center w-7 h-7 rounded-lg"
                          style={{
                            background: "var(--color-bg-elevated)",
                            color: "var(--color-status-new)",
                            transition: "var(--transition-fast)",
                          }}
                          title="Google Maps"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Detail Row */}
                {expandedId === lead.id && (
                  <tr
                    key={`${lead.id}-detail`}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      background: "var(--color-bg-elevated)",
                    }}
                  >
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                        {/* Contact Info */}
                        <div>
                          <h4
                            className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            Contact Info
                          </h4>
                          <div className="space-y-1.5">
                            {lead.phone && (
                              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                📞 {lead.phone}
                              </p>
                            )}
                            {lead.email && (
                              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                ✉️ {lead.email}
                              </p>
                            )}
                            {lead.website && (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm block"
                                style={{ color: "var(--color-primary)" }}
                              >
                                🌐 {lead.website}
                              </a>
                            )}
                            {lead.address && (
                              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                📍 {lead.address}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Business Signals */}
                        <div>
                          <h4
                            className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            Business Signals
                          </h4>
                          <div className="space-y-1.5">
                            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                              Delivery: {lead.has_delivery ? "✅ Yes" : "❌ No"}
                            </p>
                            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                              On Glovo: {lead.on_glovo ? "✅ Yes" : "❌ No"}
                            </p>
                            {lead.on_other_apps && lead.on_other_apps.length > 0 && (
                              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                Other Apps: {lead.on_other_apps.join(", ")}
                              </p>
                            )}
                            {lead.follower_count && (
                              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                Followers: {lead.follower_count.toLocaleString()}
                              </p>
                            )}
                            {lead.operating_hours && (
                              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                Hours: {lead.operating_hours}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <h4
                            className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            Notes
                          </h4>
                          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                            {lead.notes || "No notes"}
                          </p>
                          <p
                            className="text-xs mt-2"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            Source: {lead.source?.replace("_", " ")} · Added{" "}
                            {new Date(lead.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
