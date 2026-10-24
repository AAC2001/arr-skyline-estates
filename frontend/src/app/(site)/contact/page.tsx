import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { fetchProperty, fetchSiteSettings } from "@/lib/api";
import { resolveContact, telLink, whatsappLink } from "@/lib/contact";

export const metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const sp = await searchParams;
  const settings = await fetchSiteSettings();
  const contact = resolveContact(settings);

  let propertyId: number | undefined;
  if (sp.property) {
    try {
      const property = await fetchProperty(sp.property);
      propertyId = property.id;
    } catch {
      propertyId = undefined;
    }
  }

  return (
    <div className="section-padding">
      <div className="container-wide grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-navy-900">Contact ARR Skyline Estates</h1>
          <p className="mt-3 text-navy-600">Hyderabad office — update contact details anytime from the admin dashboard.</p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-navy-900">Phone</dt>
              <dd>
                <a href={telLink(contact.phone)} className="text-gold-600 hover:underline">
                  {contact.phone || "Configure in admin"}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">WhatsApp</dt>
              <dd>
                {contact.whatsapp ? (
                  <a
                    href={whatsappLink(contact.whatsapp, "Hello ARR Skyline Estates, I would like to get in touch.")}
                    className="text-gold-600 hover:underline"
                  >
                    Chat on WhatsApp
                  </a>
                ) : (
                  "Configure in admin"
                )}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Email</dt>
              <dd>
                <a href={`mailto:${contact.email}`} className="text-gold-600 hover:underline">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Office</dt>
              <dd>{contact.address}</dd>
            </div>
          </dl>
          <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-navy-50 text-sm text-navy-500">
            {settings?.map_embed_url ? (
              <iframe src={settings.map_embed_url} className="h-full w-full rounded-2xl border-0" title="Office map" />
            ) : (
              "Google Maps embed placeholder — add map_embed_url in admin site settings."
            )}
          </div>
        </div>
        <div className="space-y-6">
          <EnquiryForm title="Contact Form" enquiryType="general" />
          <EnquiryForm title="Property Enquiry" enquiryType="property" propertyId={propertyId} />
          <EnquiryForm title="Construction Enquiry" enquiryType="construction" />
        </div>
      </div>
    </div>
  );
}
