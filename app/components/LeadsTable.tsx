"use client";

import { Lead, LeadStatus } from "@/lib/types";
import { Fragment, useState } from "react";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onStatusChange?: (id: string, status: LeadStatus) => void;
  onUpdateLead?: (id: string, updates: Partial<Lead>) => Promise<void>;
}

const CATEGORY_MAP: any = {
  restaurant: "REST",
  cafe: "CAFE",
  pharmacy: "PHRM",
  grocery: "GRCR",
  bakery: "BKRY",
  fast_food: "FAST",
  bar_lounge: "BAR",
  butchery: "BTCH",
  supermarket: "SPMR",
  other: "OTHR",
};

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "negotiating",
  "signed",
  "rejected",
  "churned",
];

export default function LeadsTable({ leads, isLoading, onStatusChange, onUpdateLead }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editState, setEditState] = useState<{ id: string, field: keyof Lead, value: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (id: string) => {
    if (!editState || !onUpdateLead) return;
    setIsSaving(true);
    try {
      await onUpdateLead(id, { [editState.field]: editState.value });
      setEditState(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditableField = (lead: Lead, field: keyof Lead, label: string) => {
    const isEditing = editState?.id === lead.id && editState?.field === field;
    const value = lead[field] as string || "";

    if (isEditing) {
      return (
        <div className="flex flex-col gap-2">
           <p className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">{label}</p>
           <div className="flex gap-2">
             <input 
               autoFocus
               value={editState.value}
               onChange={(e) => setEditState({ ...editState, value: e.target.value })}
               className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/80 outline-none focus:border-emerald-500/30 flex-1"
             />
             <button onClick={() => handleSave(lead.id)} className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">SAVE</button>
             <button onClick={() => setEditState(null)} className="text-[9px] font-bold text-white/20 uppercase tracking-widest">X</button>
           </div>
        </div>
      );
    }

    return (
      <div className="group/field relative">
         <p className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase mb-2">{label}</p>
         <div className="flex items-center justify-between">
            <p className="text-sm font-light text-white/60 tracking-tight truncate max-w-[200px]">{value || "NONE RECOGNIZED"}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setEditState({ id: lead.id, field, value }); }}
              className="text-[8px] font-bold text-white/10 hover:text-emerald-400 uppercase tracking-widest opacity-0 group-hover/field:opacity-100 transition-all cursor-pointer"
            >
              EDIT
            </button>
         </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(n => (
          <div key={n} className="glass-card h-20 animate-pulse rounded-[32px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-premium" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center justify-between px-8 mb-4">
        <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">Intelligence Grid</h2>
        <div className="h-[1px] flex-1 mx-10 bg-white/5" />
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{leads.length} Records Loaded</span>
      </div>

      <div className="flex flex-col gap-3">
        {leads.map((lead, i) => (
          <Fragment key={lead.id}>
            <div 
              onClick={() => {
                setExpandedId(expandedId === lead.id ? null : lead.id);
                setEditState(null);
              }}
              className="glass-card p-6 pr-10 flex items-center justify-between gap-6 cursor-pointer hover:bg-white/[0.04] transition-all group relative overflow-hidden"
              style={{ animationDelay: `${i * 50}ms`, borderRadius: '32px' }}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500" 
                style={{ 
                  background: lead.priority >= 4 ? 'var(--color-primary)' : lead.priority >= 3 ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                  boxShadow: lead.priority >= 4 ? '0 0 20px rgba(0, 160, 130, 0.4)' : 'none'
                }} 
              />

              <div className="flex items-center gap-8">
                 <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-white/30 tracking-widest group-hover:border-white/20 transition-all">
                    {CATEGORY_MAP[lead.category] || "MISC"}
                 </div>
                 <div>
                   <p className="text-base font-light tracking-tight mb-1 group-hover:text-emerald-400 transition-colors uppercase">{lead.business_name}</p>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">{lead.area}</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] font-bold text-emerald-400/40 tracking-[0.2em] uppercase">{lead.category}</span>
                   </div>
                 </div>
              </div>

              <div className="flex items-center gap-16">
                <div className="hidden lg:flex flex-col items-end">
                   <span className="text-[9px] font-black text-white/10 tracking-[0.3em] uppercase mb-1.5">Priority</span>
                   <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                         <div 
                            key={star} 
                            className={`w-1.5 h-1.5 rounded-full ${star <= lead.priority ? 'bg-emerald-400' : 'bg-white/5'}`} 
                            style={{ boxShadow: star <= lead.priority ? '0 0 8px rgba(16,185,129,0.5)' : 'none' }}
                         />
                      ))}
                   </div>
                </div>

                <div className="flex flex-col items-end min-w-[170px]" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[9px] font-black text-white/10 tracking-[0.3em] uppercase mb-2">Cycle Status</span>
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange?.(lead.id, e.target.value as LeadStatus)}
                    className={`status-pill status-${lead.status} bg-white/5 border border-white/5 text-[10px] font-bold tracking-widest outline-none cursor-pointer hover:border-white/20 transition-all appearance-none text-center min-w-[120px] py-1.5`}
                    style={{ WebkitAppearance: 'none' }}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900">{opt.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {expandedId === lead.id && (
              <div className="px-6 -mt-3 mb-6 animate-premium origin-top">
                <div className="glass-card p-12 bg-white/[0.02] border-t-0 rounded-t-none" style={{ borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px' }}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                     {/* Contact Intelligence */}
                     <div className="space-y-8">
                        {renderEditableField(lead, "phone", "Direct Line")}
                        {renderEditableField(lead, "website", "Digital Platform")}
                        {renderEditableField(lead, "address", "Physical Vector")}
                     </div>

                     {/* Partner Signals */}
                     <div className="space-y-8 border-l border-white/5 pl-16">
                        <div>
                           <p className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase mb-6">Partner Analysis</p>
                           <div className="grid grid-cols-1 gap-4">
                              <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 flex justify-between items-center group/toggle cursor-pointer" 
                                   onClick={() => onUpdateLead?.(lead.id, { on_glovo: !lead.on_glovo })}>
                                 <div>
                                   <p className="text-[9px] font-bold text-white/20 mb-1 uppercase tracking-widest">Glovo Presence</p>
                                   <p className="text-xs font-medium text-white/80">{lead.on_glovo ? "ACTIVE PARTNER" : "INDEPENDENT"}</p>
                                 </div>
                                 <div className={`w-8 h-4 rounded-full transition-all ${lead.on_glovo ? 'bg-emerald-500' : 'bg-white/10'}`} />
                              </div>
                              <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 flex justify-between items-center group/toggle cursor-pointer"
                                   onClick={() => onUpdateLead?.(lead.id, { has_delivery: !lead.has_delivery })}>
                                 <div>
                                   <p className="text-[9px] font-bold text-white/20 mb-1 uppercase tracking-widest">Logistics</p>
                                   <p className="text-xs font-medium text-white/80">{lead.has_delivery ? "ESTABLISHED" : "NONE"}</p>
                                 </div>
                                 <div className={`w-8 h-4 rounded-full transition-all ${lead.has_delivery ? 'bg-emerald-500' : 'bg-white/10'}`} />
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Strategic Notes */}
                     <div className="space-y-8 border-l border-white/5 pl-16">
                        <div className="h-full flex flex-col">
                           <div className="flex justify-between items-center mb-6">
                              <p className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">Intelligence Report</p>
                              {editState?.field === 'notes' ? (
                                <div className="flex gap-4">
                                   <button 
                                      onClick={() => handleSave(lead.id)} 
                                      disabled={isSaving}
                                      className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                                   >
                                      {isSaving ? "SYNCING..." : "COMMIT"}
                                   </button>
                                   <button 
                                      onClick={() => setEditState(null)} 
                                      className="text-[9px] font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                                   >
                                      ABORT
                                   </button>
                                </div>
                              ) : (
                                <button 
                                   onClick={(e) => { e.stopPropagation(); setEditState({ id: lead.id, field: 'notes', value: lead.notes || "" }); }}
                                   className="text-[9px] font-bold text-white/40 uppercase tracking-widest hover:text-emerald-400 transition-colors cursor-pointer"
                                >
                                   EDIT
                                </button>
                              )}
                           </div>
                           
                           {editState?.field === 'notes' ? (
                             <textarea 
                                autoFocus
                                value={editState.value}
                                onChange={(e) => setEditState({ ...editState, field: 'notes', value: e.target.value })}
                                className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/80 outline-none focus:border-emerald-500/30 transition-all resize-none min-h-[120px]"
                                placeholder="Enter market observations..."
                             />
                           ) : (
                             <p className="text-xs text-white/40 leading-relaxed italic pr-4">
                               {lead.notes || "Awaiting intelligence reports."}
                             </p>
                           )}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
