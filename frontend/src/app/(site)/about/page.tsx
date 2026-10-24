import Image from "next/image";
import { fetchSiteSettings } from "@/lib/api";
import { SERVICES } from "@/lib/constants";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const settings = await fetchSiteSettings();

  return (
    <div className="section-padding">
      <div className="container-wide space-y-16">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl text-navy-900 md:text-5xl">About ARR Skyline Estates</h1>
          <p className="mt-4 text-lg text-navy-700 leading-relaxed">
            {settings?.about_intro ??
              "ARR Skyline Estates is a Hyderabad-based real estate and construction services company focused on premium property solutions and customer-first support."}
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          {[
            ["Our Vision", settings?.vision],
            ["Our Mission", settings?.mission],
            ["Our Values", settings?.values_text],
            ["Our Commitment", settings?.commitment],
          ].map(([title, body]) => (
            <article key={title as string} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
              <h2 className="font-display text-2xl text-navy-900">{title}</h2>
              <p className="mt-3 text-navy-700">{body || "Update this content from the admin dashboard."}</p>
            </article>
          ))}
        </section>

        <section>
          <h2 className="font-display text-3xl text-navy-900">Property & Construction Services</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-xl bg-navy-50 p-4 text-sm text-navy-800">
                <p className="font-semibold text-navy-900">{s.title}</p>
                <p className="mt-1">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid items-center gap-8 rounded-3xl bg-navy-900 p-8 text-white lg:grid-cols-2">
          <div className="relative h-72 overflow-hidden rounded-2xl bg-navy-800">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
              alt="Leadership placeholder"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl">Leadership</h2>
            <p className="mt-3 text-navy-100">
              Management profile placeholder — add founder or leadership details and photography when ready. We have not listed
              unverified qualifications or achievements here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
