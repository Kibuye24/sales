import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * GET /api/leads/stats — aggregate dashboard statistics
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      stats: {
        total: 0,
        new: 0,
        contacted: 0,
        interested: 0,
        negotiating: 0,
        signed: 0,
        rejected: 0,
        notOnGlovo: 0,
        byCategory: {},
        byArea: {},
        bySource: {},
      },
      recentRuns: [],
      warning: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    });
  }

  try {
    // Fetch all leads to compute stats
    const { data: leads, error } = await supabase
      .from("leads")
      .select("status, category, area, source, on_glovo");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const stats = {
      total: leads?.length || 0,
      new: 0,
      contacted: 0,
      interested: 0,
      negotiating: 0,
      signed: 0,
      rejected: 0,
      notOnGlovo: 0,
      byCategory: {} as Record<string, number>,
      byArea: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
    };

    for (const lead of leads || []) {
      // Status counts
      const statusKey = lead.status as string;
      if (statusKey in stats && typeof (stats as Record<string, unknown>)[statusKey] === "number") {
        (stats as unknown as Record<string, number>)[statusKey]++;
      }

      // Not on Glovo count
      if (!lead.on_glovo) stats.notOnGlovo++;

      // By category
      const cat = lead.category || "other";
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;

      // By area
      const area = lead.area || "Unknown";
      stats.byArea[area] = (stats.byArea[area] || 0) + 1;

      // By source
      const src = lead.source || "manual";
      stats.bySource[src] = (stats.bySource[src] || 0) + 1;
    }

    // Recent scrape runs
    const { data: runs } = await supabase
      .from("scrape_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(10);

    return NextResponse.json({ stats, recentRuns: runs || [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
