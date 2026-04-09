"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead, LeadStatus } from "@/lib/types";
import AgentControlPanel from "./components/AgentControlPanel";
import StatsCards from "./components/StatsCards";
import LeadsTable from "./components/LeadsTable";
import AreaBreakdown from "./components/AreaBreakdown";
import LeadsFilterBar from "./components/LeadsFilterBar";

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);

  // Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Pagination State
  const [page, setPage] = useState(0);
  const limit = 10;

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/leads/stats");
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (areaFilter) params.set("area", areaFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      params.set("limit", limit.toString());
      params.set("offset", (page * limit).toString());

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalLeads(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLeadsLoading(false);
    }
  }, [search, statusFilter, areaFilter, categoryFilter, page]);

  useEffect(() => {
    fetchStats();
    fetchLeads();
  }, [fetchStats, fetchLeads]);

  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
        if (updates.status) fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalLeads / limit);

  return (
    <main className="min-h-screen py-20 px-10 lg:px-20 max-w-[2000px] mx-auto space-y-20 relative">
      <div className="fixed top-[10%] left-[5%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
      <div className="fixed bottom-[10%] right-[5%] w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[80px] -z-10" />

      <header className="animate-premium">
        <div className="flex flex-col gap-2">
           <h1 className="text-6xl font-light tracking-tighter">
             GLOVO <span className="text-emerald-400 font-medium">SALES</span> AGENT
           </h1>
           <div className="flex items-center gap-6 mt-2">
              <span className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">Intelligence Terminal</span>
              <div className="h-[1px] w-20 bg-white/10" />
              <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-400/50 uppercase">Session Active</span>
           </div>
        </div>
      </header>

      <div className="space-y-12">
        <StatsCards stats={stats} isLoading={statsLoading} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
           <AgentControlPanel onScrapeComplete={() => { fetchStats(); fetchLeads(); }} />
           <AreaBreakdown byArea={stats?.byArea || {}} byCategory={stats?.byCategory || {}} isLoading={statsLoading} />
        </div>

        <section className="space-y-10">
           <LeadsFilterBar 
              search={search} onSearchChange={(v) => { setSearch(v); setPage(0); }}
              statusFilter={statusFilter} onStatusFilterChange={(v) => { setStatusFilter(v); setPage(0); }}
              areaFilter={areaFilter} onAreaFilterChange={(v) => { setAreaFilter(v); setPage(0); }}
              categoryFilter={categoryFilter} onCategoryFilterChange={(v) => { setCategoryFilter(v); setPage(0); }}
              totalResults={totalLeads}
           />

           <LeadsTable 
              leads={leads} 
              isLoading={leadsLoading} 
              onStatusChange={(id, status) => handleUpdateLead(id, { status })}
              onUpdateLead={handleUpdateLead}
           />

           {/* Pagination */}
           <div className="flex items-center justify-between pt-10 px-8">
              <span className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">
                 Page {page + 1} of {totalPages || 1}
              </span>
              <div className="flex gap-4">
                 <button 
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="glass-card px-8 py-3 text-[10px] font-bold tracking-widest text-white/40 uppercase hover:text-white disabled:opacity-20 cursor-pointer border-white/5 rounded-full"
                 >
                    Previous Page
                 </button>
                 <button 
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="glass-card px-8 py-3 text-[10px] font-bold tracking-widest text-white hover:text-emerald-400 disabled:opacity-20 cursor-pointer border-white/5 rounded-full"
                 >
                    Next Page
                 </button>
              </div>
           </div>
        </section>
      </div>

      <footer className="pt-20 pb-10 border-t border-white/5 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity">
         <p className="text-[10px] font-bold tracking-[0.2em] uppercase">© 2026 NEXUS DATA & DESIGN</p>
         <div className="flex gap-10 items-center">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">BUILD 2.1.8</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">ACTIVE SYNC ENGINE</span>
         </div>
      </footer>
    </main>
  );
}
