import Image from "next/image";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Button } from "@/components/ui/Button";
import { fetchGallery } from "@/lib/api";
import { CONSTRUCTION_SERVICES, PROCESS_STEPS } from "@/lib/constants";

export const metadata = { title: "Construction Services" };

export default async function ConstructionPage() {
  const gallery = await fetchGallery().catch(() => []);

  return (
    <div>
      <section className="relative flex min-h-[50vh] items-center overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80" alt="Construction" fill className="object-cover" />
        <div className="absolute inset-0 bg-navy-950/70" />
        <div className="relative container-wide px-4 py-20 text-white lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl">Construction Services</h1>
          <p className="mt-3 max-w-2xl text-navy-100">
            Individual homes, villas, residential buildings, and commercial projects with planning, design, and execution support.
          </p>
          <Button href="#estimate" variant="gold" className="mt-6">
            Request a Construction Estimate
          </Button>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-navy-900">Our Construction Expertise</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CONSTRUCTION_SERVICES.map((service) => (
                <li key={service} className="rounded-xl border border-navy-100 bg-navy-50 px-4 py-3 text-sm font-medium text-navy-800">
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-navy-900">Construction Process</h2>
            <div className="mt-6 space-y-4">
              {PROCESS_STEPS.map((step) => (
                <div key={step.step} className="rounded-xl border border-navy-100 p-4">
                  <p className="font-semibold text-navy-900">{step.title}</p>
                  <p className="text-sm text-navy-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-navy-900">Project Gallery</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {gallery.map((item) => (
              <div key={item.id} className="relative h-56 overflow-hidden rounded-2xl">
                <Image src={item.url} alt={item.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="estimate" className="section-padding bg-white">
        <div className="container-wide grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-navy-900">Project Enquiry</h2>
            <p className="mt-2 text-navy-600">
              Share plot dimensions, construction type, floors, and budget to receive a tailored estimate consultation.
            </p>
          </div>
          <EnquiryForm enquiryType="construction" title="Request Construction Estimate" />
        </div>
      </section>
    </div>
  );
}
