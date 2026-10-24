import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import BlogPost, GalleryItem, Property, PropertyImage, SiteSettings, Testimonial

DEMO_IMAGES = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1613490493574-7fde63acd811?w=1200&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    "https://images.unsplash.com/photo-1605276374101-dee2a0ed3cd6?w=1200&q=80",
]


class Command(BaseCommand):
    help = "Seed demo content for ARR Skyline Estates (clearly marked as sample data)"

    def handle(self, *args, **options):
        settings = SiteSettings.get()
        settings.company_name = "ARR Skyline Estates"
        settings.tagline = "Building Dreams. Creating Landmarks."
        settings.phone = os.getenv("DEFAULT_PHONE", "+91-XXXXXXXXXX")
        settings.whatsapp = os.getenv("DEFAULT_WHATSAPP", "919XXXXXXXXX")
        settings.email = os.getenv("DEFAULT_EMAIL", "contact@arrskylineestates.com")
        settings.address = os.getenv("DEFAULT_ADDRESS", "Hyderabad, Telangana, India")
        settings.hero_heading = "Find Your Dream Property with ARR Skyline Estates"
        settings.hero_subheading = (
            "Discover premium plots, residential properties, apartments and construction solutions in Hyderabad."
        )
        settings.intro_heading = "Welcome to ARR Skyline Estates"
        settings.intro_body = (
            "We help you find the right property, invest in land, purchase homes, and build dream residences "
            "with transparent guidance across Hyderabad and Telangana."
        )
        settings.about_intro = (
            "ARR Skyline Estates is a Hyderabad-based real estate and construction services company focused on "
            "premium property solutions and customer-first support."
        )
        settings.vision = "To create trusted landmarks and lasting value for every customer we serve."
        settings.mission = "Deliver transparent property guidance, quality construction, and end-to-end support."
        settings.values_text = "Integrity, clarity, craftsmanship, and respect for every client's goals."
        settings.commitment = "We prioritize clear communication and practical options aligned with your budget and timeline."
        settings.save()

        Property.objects.filter(is_demo=True).delete()

        demo_properties = [
            {
                "title": "Demo — Gachibowli Premium Open Plot",
                "property_type": Property.PropertyType.OPEN_PLOT,
                "location": "Gachibowli, Hyderabad",
                "price": 8500000,
                "area_value": 200,
                "area_unit": Property.AreaUnit.SQ_YD,
                "short_description": "Sample listing for layout demonstration only.",
                "description": "This is demo content showcasing an open plot listing. Replace with verified inventory.",
                "amenities": ["Approach Road", "Compound Wall", "Water Connection"],
                "nearby_landmarks": ["Financial District", "ORR Access"],
                "is_featured": True,
            },
            {
                "title": "Demo — Kondapur Residential Plot",
                "property_type": Property.PropertyType.RESIDENTIAL_PLOT,
                "location": "Kondapur, Hyderabad",
                "price_on_request": True,
                "price": None,
                "area_value": 150,
                "area_unit": Property.AreaUnit.SQ_YD,
                "short_description": "Sample residential plot card with price on request.",
                "description": "Demo property for UI testing. Not an actual offering.",
                "amenities": ["Park Facing", "24/7 Security"],
                "nearby_landmarks": ["HITEC City", "Metro Connectivity"],
                "is_featured": True,
            },
            {
                "title": "Demo — Jubilee Hills Luxury Villa",
                "property_type": Property.PropertyType.VILLA,
                "location": "Jubilee Hills, Hyderabad",
                "price": 45000000,
                "area_value": 400,
                "area_unit": Property.AreaUnit.SQ_YD,
                "short_description": "Sample luxury villa listing with premium amenities.",
                "description": "Placeholder villa listing for design preview purposes.",
                "amenities": ["Private Garden", "Modular Kitchen", "Smart Home Ready"],
                "nearby_landmarks": ["Film Nagar", "Shopping Avenues"],
                "status": Property.Status.NEGOTIATION,
            },
            {
                "title": "Demo — Madhapur 3BHK Apartment",
                "property_type": Property.PropertyType.APARTMENT,
                "location": "Madhapur, Hyderabad",
                "price": 12500000,
                "area_value": 1850,
                "area_unit": Property.AreaUnit.SQ_FT,
                "short_description": "Sample apartment listing near IT corridors.",
                "description": "Demo apartment entry. Availability and pricing are not verified.",
                "amenities": ["Clubhouse", "Gym", "Covered Parking"],
                "nearby_landmarks": ["Durgam Cheruvu", "Raidurg Metro"],
                "is_featured": True,
            },
            {
                "title": "Demo — Bachupally Independent House",
                "property_type": Property.PropertyType.INDEPENDENT_HOUSE,
                "location": "Bachupally, Hyderabad",
                "price": 9800000,
                "area_value": 2400,
                "area_unit": Property.AreaUnit.SQ_FT,
                "short_description": "Sample independent house with construction-ready plot.",
                "description": "Demonstration listing for house sales category.",
                "amenities": ["East Facing", "Duplex Design"],
                "nearby_landmarks": ["Schools", "NH Connectivity"],
            },
            {
                "title": "Demo — Shamshabad Commercial Space",
                "property_type": Property.PropertyType.COMMERCIAL,
                "location": "Shamshabad, Hyderabad",
                "price": 22000000,
                "area_value": 3200,
                "area_unit": Property.AreaUnit.SQ_FT,
                "short_description": "Sample commercial property near airport corridor.",
                "description": "Demo commercial listing for marketplace filters.",
                "amenities": ["High Ceiling", "Parking Bay"],
                "nearby_landmarks": ["RGIA Airport", "ORR"],
            },
        ]

        for idx, data in enumerate(demo_properties):
            cover = DEMO_IMAGES[idx % len(DEMO_IMAGES)]
            prop = Property.objects.create(is_demo=True, cover_image_url=cover, **data)
            for j in range(3):
                PropertyImage.objects.create(
                    property=prop,
                    image_url=DEMO_IMAGES[(idx + j) % len(DEMO_IMAGES)],
                    sort_order=j,
                )

        Testimonial.objects.filter(is_demo=True).delete()
        Testimonial.objects.create(
            is_demo=True,
            name="Demo Client A",
            role="Placeholder testimonial",
            quote="This is sample testimonial text until verified customer reviews are added.",
            sort_order=1,
        )
        Testimonial.objects.create(
            is_demo=True,
            name="Demo Client B",
            role="Placeholder testimonial",
            quote="Replace with authentic feedback from ARR Skyline Estates customers.",
            sort_order=2,
        )

        GalleryItem.objects.all().delete()
        for i, url in enumerate(DEMO_IMAGES):
            GalleryItem.objects.create(
                title=f"Demo construction showcase {i + 1}",
                category=GalleryItem.Category.CONSTRUCTION,
                image_url=url,
            )

        if not BlogPost.objects.exists():
            BlogPost.objects.create(
                title="Hyderabad Real Estate: Planning Your First Plot Purchase",
                slug="hyderabad-plot-purchase-guide",
                excerpt="Key considerations before investing in open plots in Hyderabad.",
                body="Demo blog article. Replace with company-authored updates and market insights.",
                cover_image_url=DEMO_IMAGES[0],
                is_published=True,
            )

        User = get_user_model()
        admin_user = os.getenv("DJANGO_ADMIN_USERNAME", "admin")
        admin_pass = os.getenv("DJANGO_ADMIN_PASSWORD")
        if admin_pass and not User.objects.filter(username=admin_user).exists():
            User.objects.create_superuser(username=admin_user, email="admin@example.com", password=admin_pass)
            self.stdout.write(self.style.SUCCESS(f"Created admin user '{admin_user}' from environment."))

        self.stdout.write(self.style.SUCCESS("Demo seed completed."))
