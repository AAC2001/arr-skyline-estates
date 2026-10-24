import type {
  BlogPost,
  DashboardStats,
  Enquiry,
  GalleryItem,
  Paginated,
  PropertyDetail,
  PropertyListItem,
  SiteSettings,
  Testimonial,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

async function request<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  };
  if (init?.token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${init.token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function getApiBase() {
  return API_BASE;
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await request<SiteSettings>("/site-settings/");
  } catch {
    return null;
  }
}

export async function fetchProperties(params?: Record<string, string>): Promise<Paginated<PropertyListItem>> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return request<Paginated<PropertyListItem>>(`/properties/${qs}`);
}

export async function fetchProperty(slug: string): Promise<PropertyDetail> {
  return request<PropertyDetail>(`/properties/${slug}/`);
}

export async function fetchFeaturedProperties(): Promise<PropertyListItem[]> {
  const data = await fetchProperties({ featured: "true", page_size: "6" });
  return data.results;
}

export async function fetchRecentProperties(): Promise<PropertyListItem[]> {
  const data = await fetchProperties({ ordering: "-created_at", page_size: "6" });
  return data.results;
}

async function fetchList<T>(path: string, token?: string): Promise<T[]> {
  const data = await request<Paginated<T> | T[]>(path, token ? { token } : undefined);
  return Array.isArray(data) ? data : data.results;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return fetchList<Testimonial>("/testimonials/?page_size=20");
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  return fetchList<GalleryItem>("/gallery/?page_size=20");
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const data = await request<Paginated<BlogPost> | BlogPost[]>("/blog/");
  return Array.isArray(data) ? data : data.results;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  return request<BlogPost>(`/blog/${slug}/`);
}

export async function compareProperties(slugs: string[]): Promise<PropertyDetail[]> {
  return request<PropertyDetail[]>(`/properties/compare/?slugs=${encodeURIComponent(slugs.join(","))}`);
}

export async function submitEnquiry(payload: Record<string, unknown>) {
  return request<Enquiry>("/enquiries/", { method: "POST", body: JSON.stringify(payload) });
}

export async function loginAdmin(username: string, password: string) {
  return request<{ access: string; refresh: string }>("/auth/token/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchDashboardStats(token: string) {
  return request<DashboardStats>("/dashboard/stats/", { token });
}

export async function fetchEnquiries(token: string) {
  return fetchList<Enquiry>("/enquiries/?page_size=200", token);
}

export async function updateEnquiry(token: string, id: number, data: Partial<Enquiry>) {
  return request<Enquiry>(`/enquiries/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
}

export async function updateSiteSettings(token: string, data: Partial<SiteSettings>) {
  return request<SiteSettings>("/site-settings/", { method: "PATCH", body: JSON.stringify(data), token });
}

export async function adminCreateProperty(token: string, data: FormData | Record<string, unknown>) {
  const isForm = data instanceof FormData;
  const res = await fetch(`${API_BASE}/properties/`, {
    method: "POST",
    headers: isForm ? { Authorization: `Bearer ${token}` } : { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: isForm ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function adminUpdateProperty(token: string, slug: string, data: FormData | Record<string, unknown>) {
  const isForm = data instanceof FormData;
  const res = await fetch(`${API_BASE}/properties/${slug}/`, {
    method: "PATCH",
    headers: isForm ? { Authorization: `Bearer ${token}` } : { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: isForm ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function adminDeleteProperty(token: string, slug: string) {
  await request<void>(`/properties/${slug}/`, { method: "DELETE", token });
}

export async function adminListProperties(token: string) {
  const data = await request<Paginated<PropertyListItem>>(`/properties/?page_size=100`, { token });
  return data.results;
}
