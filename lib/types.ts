export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "negotiating"
  | "signed"
  | "rejected"
  | "churned";

export type LeadSource =
  | "google_maps"
  | "social_media"
  | "google_my_business"
  | "linkedin"
  | "referral"
  | "trade_association"
  | "street_canvassing"
  | "manual";

export type BusinessCategory =
  | "restaurant"
  | "cafe"
  | "pharmacy"
  | "grocery"
  | "bakery"
  | "fast_food"
  | "bar_lounge"
  | "butchery"
  | "supermarket"
  | "other";

export interface Lead {
  id: string;
  business_name: string;
  category: BusinessCategory;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
  area: string | null;
  city: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  google_rating: number | null;
  google_reviews: number | null;
  has_delivery: boolean;
  on_glovo: boolean;
  on_other_apps: string[] | null;
  follower_count: number | null;
  operating_hours: string | null;
  staff_size: string | null;
  status: LeadStatus;
  source: LeadSource;
  priority: number;
  notes: string | null;
  scraped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScrapeRun {
  id: string;
  source: LeadSource;
  query: string | null;
  area: string | null;
  leads_found: number;
  leads_new: number;
  status: string;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  signed: number;
  notOnGlovo: number;
  byCategory: Record<string, number>;
  byArea: Record<string, number>;
  bySource: Record<string, number>;
}
