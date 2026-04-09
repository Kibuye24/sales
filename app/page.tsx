"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead, LeadStatus } from "@/lib/types";
import AgentControlPanel from "./components/AgentControlPanel";
import StatsCards from "./components/StatsCards";
import LeadsFilterBar from "./components/LeadsFilterBar";
import LeadsTable from "./components/LeadsTable";
import AreaBreakdown from "./components/AreaBreakdown";

interface StatsData {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  negotiating: number;
  signed: number;
  rejected: number;
  notOnGlovo: number;
  byCategory: Record<string, number>;
  byArea: Record<string, number>;
  bySource: Record<string, number>;
}

export default function HomePage() {
  // Stats
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/leads/stats");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("Stats API returned non-JSON response");
        return;
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (areaFilter) params.set("area", areaFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      params.set("limit", "100");

      const res = await fetch(`/api/leads?${params.toString()}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("Leads API returned non-JSON response");
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalLeads(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLeadsLoading(false);
    }
  }, [search, statusFilter, areaFilter, categoryFilter, sourceFilter]);

  // Update lead status
  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l))
        );
        // Refresh stats
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchStats();
    fetchLeads();
  }, [fetchStats, fetchLeads]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Refresh on filter change
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, areaFilter, categoryFilter, sourceFilter]);

  const handleScrapeComplete = () => {
    fetchStats();
    fetchLeads();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Section */}
      <section className="mb-2 animate-fade-in-up" aria-labelledby="page-title">
        <h2
          id="page-title"
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          Lead Discovery{" "}
          <span className="gradient-text">Dashboard</span>
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          AI-powered business intelligence for Glovo sales in Nairobi
        </p>
      </section>

      {/* Stats */}
      <StatsCards stats={stats} isLoading={statsLoading} />

      {/* Agent Panel */}
      <AgentControlPanel onScrapeComplete={handleScrapeComplete} />

      {/* Area & Category Breakdown */}
      <AreaBreakdown
        byArea={stats?.byArea || {}}
        byCategory={stats?.byCategory || {}}
        isLoading={statsLoading}
      />

      {/* Leads Section */}
      <section aria-labelledby="leads-heading">
        <header className="flex items-center justify-between mb-4">
          <h2
            id="leads-heading"
            className="text-lg font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            All Leads
          </h2>
        </header>

        <div className="space-y-4">
          <LeadsFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            areaFilter={areaFilter}
            onAreaFilterChange={setAreaFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
            totalResults={totalLeads}
          />

          <LeadsTable
            leads={leads}
            isLoading={leadsLoading}
            onStatusChange={handleStatusChange}
          />
        </div>
      </section>
    </div>
  );
}
