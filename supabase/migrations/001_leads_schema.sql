-- =============================================
-- Glovo Sales Agent — Lead Generation Schema
-- =============================================

-- Lead status enum
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'interested',
  'negotiating',
  'signed',
  'rejected',
  'churned'
);

-- Lead source enum
CREATE TYPE lead_source AS ENUM (
  'google_maps',
  'social_media',
  'google_my_business',
  'linkedin',
  'referral',
  'trade_association',
  'street_canvassing',
  'manual'
);

-- Business category enum
CREATE TYPE business_category AS ENUM (
  'restaurant',
  'cafe',
  'pharmacy',
  'grocery',
  'bakery',
  'fast_food',
  'bar_lounge',
  'butchery',
  'supermarket',
  'other'
);

-- =============================================
-- Main leads table
-- =============================================
CREATE TABLE leads (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Business info
  business_name TEXT NOT NULL,
  category      business_category NOT NULL DEFAULT 'restaurant',
  
  -- Contact info
  phone         TEXT,
  email         TEXT,
  website       TEXT,
  instagram     TEXT,
  facebook      TEXT,
  
  -- Location
  address       TEXT,
  area          TEXT,              -- e.g. Westlands, CBD, Karen, Kilimani
  city          TEXT DEFAULT 'Nairobi',
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  google_maps_url TEXT,
  
  -- Business signals
  google_rating    NUMERIC(2,1),   -- e.g. 4.5
  google_reviews   INTEGER,        -- review count
  has_delivery     BOOLEAN DEFAULT false,
  on_glovo         BOOLEAN DEFAULT false,
  on_other_apps    TEXT[],          -- e.g. {'uber_eats', 'bolt_food'}
  follower_count   INTEGER,        -- social follower count
  operating_hours  TEXT,
  staff_size       TEXT,
  
  -- Pipeline
  status        lead_status DEFAULT 'new',
  source        lead_source DEFAULT 'manual',
  priority      INTEGER DEFAULT 0 CHECK (priority BETWEEN 0 AND 5),
  notes         TEXT,
  
  -- Metadata
  scraped_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Auto-update updated_at on row change
-- =============================================
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- =============================================
-- Scrape runs log — tracks each agent run
-- =============================================
CREATE TABLE scrape_runs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source        lead_source NOT NULL,
  query         TEXT,                  -- what was searched
  area          TEXT,                  -- target area
  leads_found   INTEGER DEFAULT 0,
  leads_new     INTEGER DEFAULT 0,    -- net-new (not duplicated)
  status        TEXT DEFAULT 'running', -- running | completed | failed
  error_message TEXT,
  started_at    TIMESTAMPTZ DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_leads_status    ON leads (status);
CREATE INDEX idx_leads_area      ON leads (area);
CREATE INDEX idx_leads_category  ON leads (category);
CREATE INDEX idx_leads_source    ON leads (source);
CREATE INDEX idx_leads_on_glovo  ON leads (on_glovo);
CREATE INDEX idx_leads_created   ON leads (created_at DESC);

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_runs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (for demo)
CREATE POLICY "Allow all for authenticated" ON leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON scrape_runs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anon read access (for demo dashboard)
CREATE POLICY "Allow anon read" ON leads
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert" ON leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon update" ON leads
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon read" ON scrape_runs
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert" ON scrape_runs
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon update" ON scrape_runs
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
