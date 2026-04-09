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
  { value: "restaurant", label: "RESTAURANTS" },
  { value: "cafe", label: "CAFES" },
  { value: "pharmacy", label: "PHARMACIES" },
  { value: "grocery", label: "GROCERIES" },
  { value: "bakery", label: "BAKERIES" },
  { value: "fast_food", label: "FAST FOOD" },
  { value: "bar_lounge", label: "BARS" },
  { value: "butchery", label: "BUTCHERIES" },
  { value: "supermarket", label: "SUPERMARKETS" },
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
  const [result, setResult] = useState<any>(null);
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
        body: JSON.stringify({ area: selectedArea, category: selectedCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Agent failed");
      setResult(data);
      onScrapeComplete?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-premium" style={{ animationDelay: '400ms' }}>
      <div className="lg:col-span-2 glass-card p-10">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-2xl font-light tracking-tight mb-2">Discovery Agent</h2>
            <p className="text-sm text-white/40 mb-10 tracking-wide font-medium">CONFIGURE TARGET PARAMETERS</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/30">LOCATION</span>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Area</option>
                  {AREAS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/30">VERTICAL</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleScrape}
            disabled={!selectedArea || !selectedCategory || isRunning}
            className={`mt-10 btn-primary flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:scale-100 uppercase tracking-widest text-xs font-bold py-5`}
          >
            {isRunning ? (
              <span className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Analyzing Market...
              </span>
            ) : "Initialize Discovery"}
          </button>
        </div>
      </div>

      <div className="glass-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {result ? (
          <div className="animate-premium">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-light mb-2">Cycle Complete</h3>
            <p className="text-4xl font-light mb-1">{result.leads_new}</p>
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">New Leads Qualified</p>
          </div>
        ) : (
          <div className="text-white/20">
            <p className="text-sm tracking-widest font-bold uppercase mb-4">Awaiting Signal</p>
            <p className="text-xs max-w-[15ch] mx-auto leading-relaxed opacity-50">Select parameters to begin market analysis</p>
          </div>
        )}
        
        {error && (
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
             <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
