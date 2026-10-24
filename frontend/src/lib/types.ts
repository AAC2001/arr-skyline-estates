export type PropertyType =
  | "open_plot"
  | "residential_plot"
  | "apartment"
  | "flat"
  | "villa"
  | "independent_house"
  | "commercial"
  | "agricultural";

export type PropertyStatus = "available" | "sold" | "negotiation";

export interface PropertyListItem {
  id: number;
  title: string;
  slug: string;
  is_demo: boolean;
  property_type: PropertyType;
  property_type_label: string;
  status: PropertyStatus;
  status_label: string;
  location: string;
  city: string;
  price: string | number | null;
  price_on_request: boolean;
  area_value: string | number;
  area_unit: string;
  short_description: string;
  is_featured: boolean;
  cover: string;
  created_at: string;
}

export interface PropertyDetail extends PropertyListItem {
  state: string;
  description: string;
  amenities: string[];
  nearby_landmarks: string[];
  documentation_details: string;
  latitude: string | null;
  longitude: string | null;
  area_unit_label: string;
  images: { id: number; url: string; caption: string; sort_order: number }[];
  updated_at: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  map_embed_url: string;
  hero_heading: string;
  hero_subheading: string;
  intro_heading: string;
  intro_body: string;
  about_intro: string;
  vision: string;
  mission: string;
  values_text: string;
  commitment: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  is_demo: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  url: string;
}

export interface Enquiry {
  id: number;
  enquiry_type: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  property: number | null;
  property_title?: string;
  location: string;
  plot_dimensions: string;
  construction_type: string;
  floors: number | null;
  budget: string;
  preferred_visit_date: string | null;
  internal_notes: string;
  created_at: string;
}

export interface DashboardStats {
  total_properties: number;
  available_properties: number;
  sold_properties: number;
  total_enquiries: number;
  new_enquiries: number;
  construction_enquiries: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string | null;
  created_at: string;
  body?: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
