import { NextRequest, NextResponse } from "next/server";
import { runLeadAgent } from "@/lib/gemini-agent";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area, category } = body;

    if (!area || !category) {
      return NextResponse.json(
        { error: "area and category are required" },
        { status: 400 }
      );
    }

    // 1. Create a scrape run record
    const { data: run, error: runError } = await supabase
      .from("scrape_runs")
      .insert({
        source: "google_maps",
        query: `${category} in ${area}`,
        area,
        status: "running",
      })
      .select()
      .single();

    if (runError) {
      console.error("Failed to create scrape run:", runError);
    }

    // 2. Run the Gemini agent
    const result = await runLeadAgent({ area, category });

    // 3. Insert leads into Supabase (skip duplicates by business_name + area)
    let newLeads = 0;
    const insertedLeads = [];

    for (const lead of result.leads) {
      // Check for existing lead
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("business_name", lead.business_name as string)
        .eq("area", lead.area as string)
        .maybeSingle();

      if (!existing) {
        const { data: inserted, error: insertError } = await supabase
          .from("leads")
          .insert({
            ...lead,
            source: "google_maps",
            scraped_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!insertError && inserted) {
          newLeads++;
          insertedLeads.push(inserted);
        } else if (insertError) {
          console.error("Insert error for", lead.business_name, insertError);
        }
      }
    }

    // 4. Update the scrape run
    if (run) {
      await supabase
        .from("scrape_runs")
        .update({
          status: "completed",
          leads_found: result.leads.length,
          leads_new: newLeads,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id);
    }

    return NextResponse.json({
      success: true,
      leads_found: result.leads.length,
      leads_new: newLeads,
      leads: insertedLeads,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      {
        error: "Agent failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
