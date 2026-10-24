import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImageLightbox } from "@/components/properties/ImageLightbox";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Button } from "@/components/ui/Button";
import { fetchProperty, fetchSiteSettings } from "@/lib/api";
import { resolveContact, whatsappLink } from "@/lib/contact";
import { formatArea, formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const property = await fetchProperty(slug);
    return {
      title: property.title,
      description: property.short_description,
    };
  } catch {
    return { title: "Property" };
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  let property;
  try {
    property = await fetchProperty(slug);
  } catch {
    notFound();
  }

  const settings = await fetchSiteSettings();
  const contact = resolveContact(settings);
  const waMessage = `Hello, I am interested in ${property.title} (${property.location}). Please share details.`;

  return (
    <div className="section-padding">
      <div className="container-wide grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            {property.is_demo && (
              <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">Demo Listing</span>
            )}
            <h1 className="mt-2 font-display text-4xl text-navy-900">{property.title}</h1>
            <p className="text-navy-600">
              {property.location}, {property.city}, {property.state}
            </p>
          </div>
          <ImageLightbox
            images={property.images?.length ? property.images.map((i) => ({ url: i.url, caption: i.caption })) : [{ url: property.cover }]}
            title={property.title}
          />
          <div className="grid gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-navy-500">Price</p>
              <p className="font-semibold text-navy-900">{formatPrice(Number(property.price), property.price_on_request)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-navy-500">Area</p>
              <p className="font-semibold text-navy-900">{formatArea(property.area_value, property.area_unit)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-navy-500">Status</p>
              <p className="font-semibold text-navy-900">{property.status_label}</p>
            </div>
          </div>
          <article className="prose max-w-none text-navy-700">
            <h2 className="font-display text-2xl text-navy-900">Description</h2>
            <p>{property.description || property.short_description}</p>
            <h3 className="font-display text-xl text-navy-900">Amenities</h3>
            <ul>{property.amenities?.map((a) => <li key={a}>{a}</li>)}</ul>
            <h3 className="font-display text-xl text-navy-900">Nearby Landmarks</h3>
            <ul>{property.nearby_landmarks?.map((l) => <li key={l}>{l}</li>)}</ul>
            <h3 className="font-display text-xl text-navy-900">Documentation</h3>
            <p>{property.documentation_details || "Documentation details will be shared during consultation."}</p>
          </article>
          <div className="rounded-2xl border border-navy-100 bg-navy-50 p-6">
            <h3 className="font-display text-xl text-navy-900">Location</h3>
            <p className="mt-2 text-sm text-navy-600">
              Map integration placeholder — add Google Maps embed URL in admin site settings.
            </p>
            <div className="mt-4 flex h-64 items-center justify-center rounded-xl border border-dashed border-navy-200 bg-white text-sm text-navy-500">
              {property.latitude && property.longitude
                ? `Coordinates: ${property.latitude}, ${property.longitude}`
                : "Hyderabad region map preview"}
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button href={`/contact?property=${property.slug}`}>Schedule Site Visit</Button>
            {contact.whatsapp && (
              <a
                href={whatsappLink(contact.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                WhatsApp Enquiry
              </a>
            )}
          </div>
          <EnquiryForm enquiryType="property" propertyId={property.id} title="Property Enquiry" />
          <EnquiryForm enquiryType="site_visit" propertyId={property.id} title="Book Site Visit" />
        </aside>
      </div>
    </div>
  );
}
