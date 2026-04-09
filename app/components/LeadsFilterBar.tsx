"use client";

interface LeadsFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  areaFilter: string;
  onAreaFilterChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  totalResults: number;
}

const AREAS = ["Westlands", "Nairobi CBD", "Karen", "Kilimani", "Lavington", "Kileleshwa", "Hurlingham", "South B/C", "Parklands"];
const STATUSES = ["new", "contacted", "interested", "negotiating", "signed", "rejected", "churned"];
const CATEGORIES = ["restaurant", "cafe", "pharmacy", "grocery", "bakery", "fast_food", "bar_lounge", "butchery", "supermarket"];

export default function LeadsFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  areaFilter,
  onAreaFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  totalResults,
}: LeadsFilterBarProps) {
  return (
    <div className="glass-card p-6 flex flex-wrap items-center gap-6 border-white/5 bg-white/[0.02] rounded-[40px] mb-10">
      <div className="flex-1 min-w-[300px] relative">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="SEARCH MARKET..."
          className="w-full bg-white/5 border border-white/5 rounded-full px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase ml-2">Area</span>
          <select
            value={areaFilter}
            onChange={(e) => onAreaFilterChange(e.target.value)}
            className="bg-transparent text-[10px] font-bold tracking-widest uppercase text-white/70 outline-none cursor-pointer hover:text-white transition-colors"
          >
            <option value="">ALL AREAS</option>
            {AREAS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="h-8 w-[1px] bg-white/5" />

        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase ml-2">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-transparent text-[10px] font-bold tracking-widest uppercase text-white/70 outline-none cursor-pointer hover:text-white transition-colors"
          >
            <option value="">ALL STATUSES</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="h-8 w-[1px] bg-white/5" />

        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase ml-2">Vertical</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="bg-transparent text-[10px] font-bold tracking-widest uppercase text-white/70 outline-none cursor-pointer hover:text-white transition-colors"
          >
            <option value="">ALL CATEGORIES</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="ml-6 px-6 py-3 rounded-full bg-white/5 border border-white/5">
           <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400">{totalResults} MATCHES</span>
        </div>
      </div>
    </div>
  );
}
