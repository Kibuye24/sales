import { NextRequest, NextResponse } from "next/server";
import { runLeadAgent } from "@/lib/gemini-agent";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Valid columns in the leads table — only these fields get inserted.
 * Strips any extra fields the LLM might return (confidence, verification_needed, etc.)
 */
function sanitizeLead(raw: Record<string, unknown>, area: string) {
  return {
    business_name: raw.business_name as string,
    category: raw.category as string || "other",
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    website: (raw.website as string) || null,
    instagram: (raw.instagram as string) || null,
    facebook: (raw.facebook as string) || null,
    address: (raw.address as string) || null,
    area: (raw.area as string) || area,
    city: "Nairobi",
    latitude: (raw.latitude as number) || null,
    longitude: (raw.longitude as number) || null,
    google_maps_url: (raw.google_maps_url as string) || null,
    google_rating: (raw.google_rating as number) || null,
    google_reviews: (raw.google_reviews as number) || null,
    has_delivery: Boolean(raw.has_delivery),
    on_glovo: Boolean(raw.on_glovo),
    on_other_apps: Array.isArray(raw.on_other_apps) ? raw.on_other_apps : null,
    follower_count: (raw.follower_count as number) || null,
    operating_hours: (raw.operating_hours as string) || null,
    staff_size: (raw.staff_size as string) || null,
    status: "new",
    source: "google_maps" as const,
    priority: typeof raw.priority === "number" ? raw.priority : 3,
    notes: (raw.notes as string) || null,
    scraped_at: new Date().toISOString(),
  };
}

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

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured. Add credentials to .env.local" },
        { status: 503 }
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

    // 2. Run the agent
    const result = await runLeadAgent({ area, category });

    // 3. Insert leads into Supabase (skip duplicates by business_name + area)
    let newLeads = 0;
    const insertedLeads = [];
    const errors: string[] = [];

    for (const rawLead of result.leads) {
      const name = rawLead.business_name as string;
      const leadArea = (rawLead.area as string) || area;

      if (!name) {
        errors.push("Skipped lead with no business_name");
        continue;
      }

      // Check for existing lead
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("business_name", name)
        .eq("area", leadArea)
        .maybeSingle();

      if (existing) {
        continue; // Already exists, skip
      }

      // Sanitize — only include valid DB columns
      const cleanLead = sanitizeLead(rawLead, area);

      const { data: inserted, error: insertError } = await supabase
        .from("leads")
        .insert(cleanLead)
        .select()
        .single();

      if (!insertError && inserted) {
        newLeads++;
        insertedLeads.push(inserted);
      } else if (insertError) {
        console.error("Insert error for", name, insertError.message);
        errors.push(`${name}: ${insertError.message}`);
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
      ...(errors.length > 0 && { insert_errors: errors }),
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
