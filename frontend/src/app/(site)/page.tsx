import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { FadeIn } from "@/components/motion/FadeIn";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/Button";
import { fetchFeaturedProperties, fetchGallery, fetchSiteSettings, fetchTestimonials } from "@/lib/api";
import { PROCESS_STEPS, SERVICES, WHY_CHOOSE } from "@/lib/constants";

export default async function HomePage() {
  const [settings, featured, testimonials, gallery] = await Promise.all([
    fetchSiteSettings(),
    fetchFeaturedProperties().catch(() => []),
    fetchTestimonials().catch(() => []),
    fetchGallery().catch(() => []),
  ]);

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt="Premium real estate in Hyderabad"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/70 to-navy-900/40" />
        <div className="relative container-wide flex min-h-[88vh] flex-col justify-center px-4 py-20 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold-300">Hyderabad, Telangana</p>
          <h1 className="max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
            {settings?.hero_heading ?? "Find Your Dream Property with ARR Skyline Estates"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">
            {settings?.hero_subheading ??
              "Discover premium plots, residential properties, apartments and construction solutions in Hyderabad."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/properties">Explore Properties</Button>
            <Button href="/contact" variant="secondary" className="bg-white/95">
              Contact Our Experts
            </Button>
          </div>
          <div className="mt-10 max-w-5xl">
            <HeroSearch />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <FadeIn className="container-wide grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-navy-900 md:text-4xl">
              {settings?.intro_heading ?? "Welcome to ARR Skyline Estates"}
            </h2>
            <p className="mt-4 text-navy-700 leading-relaxed">
              {settings?.intro_body ??
                "We help customers find the right property, invest in land, purchase homes, and build dream residences with transparent guidance across Hyderabad."}
            </p>
          </div>
          <div className="relative h-80 overflow-hidden rounded-3xl shadow-soft">
            <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" alt="Luxury home" fill className="object-cover" />
          </div>
        </FadeIn>
      </section>

      <section className="section-padding bg-navy-50">
        <FadeIn className="container-wide">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-navy-900 md:text-4xl">Our Services</h2>
            <p className="mt-2 text-navy-600">Comprehensive property and construction solutions</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <article key={service.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
                <h3 className="font-display text-xl text-navy-900">{service.title}</h3>
                <p className="mt-2 text-sm text-navy-600">{service.description}</p>
                <Link href="/contact" className="mt-4 inline-flex text-sm font-semibold text-gold-600 hover:text-gold-500">
                  Enquire →
                </Link>
              </article>
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="section-padding bg-white">
        <FadeIn className="container-wide">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-navy-900">Featured Properties</h2>
              <p className="text-sm text-navy-600">Sample demo listings — replace with verified inventory in admin.</p>
            </div>
            <Button href="/properties" variant="secondary">
              View All
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="section-padding bg-navy-900 text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Why Choose ARR Skyline Estates?</h2>
            <ul className="mt-6 space-y-3">
              {WHY_CHOOSE.map((item) => (
                <li key={item} className="flex gap-3 text-navy-100">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gold-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-navy-700 bg-navy-950/60 p-8">
            <h3 className="font-display text-2xl text-gold-300">Our Process</h3>
            <div className="mt-6 space-y-5">
              {PROCESS_STEPS.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <span className="font-display text-xl text-gold-400">{step.step}</span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-navy-200">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-navy-900">Construction Showcase</h2>
          <p className="mt-2 text-navy-600">Residential and commercial construction capabilities</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {gallery.slice(0, 6).map((item) => (
              <div key={item.id} className="relative h-56 overflow-hidden rounded-2xl">
                <Image src={item.url} alt={item.title} fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-4 text-sm font-medium text-white">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
          <Button href="/construction" className="mt-8">
            View Construction Services
          </Button>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-navy-900">Customer Testimonials</h2>
          <p className="mt-2 text-sm text-navy-600">Placeholder testimonials until verified reviews are added.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
                <p className="text-navy-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-navy-900">
                  {t.name}
                  {t.is_demo && <span className="ml-2 rounded bg-gold-100 px-2 py-0.5 text-xs text-gold-700">Demo</span>}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-950 text-center text-white">
        <h2 className="font-display text-3xl md:text-4xl">Your Dream Property Is Just One Step Away.</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/properties" variant="gold">
            Find Your Property
          </Button>
          <Button href="/contact" variant="secondary" className="border-white/30 bg-transparent text-white hover:bg-white/10">
            Talk to Our Team
          </Button>
        </div>
      </section>
    </>
  );
}
