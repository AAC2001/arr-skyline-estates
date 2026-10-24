from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SiteSettings(models.Model):
    """Singleton-style site configuration editable from admin dashboard."""

    company_name = models.CharField(max_length=200, default="ARR Skyline Estates")
    tagline = models.CharField(max_length=255, default="Building Dreams. Creating Landmarks.")
    phone = models.CharField(max_length=30, blank=True)
    whatsapp = models.CharField(max_length=30, blank=True, help_text="Digits only with country code, e.g. 919876543210")
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    map_embed_url = models.URLField(blank=True)
    hero_heading = models.CharField(max_length=255, blank=True)
    hero_subheading = models.TextField(blank=True)
    intro_heading = models.CharField(max_length=255, blank=True)
    intro_body = models.TextField(blank=True)
    about_intro = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    values_text = models.TextField(blank=True)
    commitment = models.TextField(blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Property(TimeStampedModel):
    class PropertyType(models.TextChoices):
        OPEN_PLOT = "open_plot", "Open Plots"
        RESIDENTIAL_PLOT = "residential_plot", "Residential Plots"
        APARTMENT = "apartment", "Apartments"
        FLAT = "flat", "Flats"
        VILLA = "villa", "Villas"
        INDEPENDENT_HOUSE = "independent_house", "Independent Houses"
        COMMERCIAL = "commercial", "Commercial Properties"
        AGRICULTURAL = "agricultural", "Agricultural Land"

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        SOLD = "sold", "Sold"
        NEGOTIATION = "negotiation", "Under Negotiation"

    class AreaUnit(models.TextChoices):
        SQ_YD = "sq_yd", "Square Yards"
        SQ_FT = "sq_ft", "Square Feet"
        ACRES = "acres", "Acres"

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    is_demo = models.BooleanField(default=True, help_text="Demo/sample listing — not verified inventory")
    property_type = models.CharField(max_length=32, choices=PropertyType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default="Hyderabad")
    state = models.CharField(max_length=100, default="Telangana")
    price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    price_on_request = models.BooleanField(default=False)
    area_value = models.DecimalField(max_digits=12, decimal_places=2)
    area_unit = models.CharField(max_length=10, choices=AreaUnit.choices, default=AreaUnit.SQ_YD)
    short_description = models.TextField(blank=True)
    description = models.TextField(blank=True)
    amenities = models.JSONField(default=list, blank=True)
    nearby_landmarks = models.JSONField(default=list, blank=True)
    documentation_details = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    cover_image = models.ImageField(upload_to="properties/", blank=True, null=True)
    cover_image_url = models.URLField(blank=True, help_text="External image URL when no upload")

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Properties"

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:240]
            slug = base
            n = 1
            while Property.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="properties/gallery/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    caption = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]


class Testimonial(TimeStampedModel):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    quote = models.TextField()
    is_demo = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "-created_at"]


class GalleryItem(TimeStampedModel):
    class Category(models.TextChoices):
        CONSTRUCTION = "construction", "Construction"
        ARCHITECTURE = "architecture", "Architecture"
        RESIDENTIAL = "residential", "Residential"
        COMMERCIAL = "commercial", "Commercial"

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=32, choices=Category.choices, default=Category.CONSTRUCTION)
    image = models.ImageField(upload_to="gallery/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]


class BlogPost(TimeStampedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField()
    cover_image_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:270]
        super().save(*args, **kwargs)


class Enquiry(TimeStampedModel):
    class EnquiryType(models.TextChoices):
        GENERAL = "general", "General Contact"
        PROPERTY = "property", "Property Enquiry"
        CONSTRUCTION = "construction", "Construction Enquiry"
        SITE_VISIT = "site_visit", "Site Visit Booking"

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        COMPLETED = "completed", "Completed"

    enquiry_type = models.CharField(max_length=20, choices=EnquiryType.choices, default=EnquiryType.GENERAL)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    message = models.TextField(blank=True)
    property = models.ForeignKey(Property, null=True, blank=True, on_delete=models.SET_NULL, related_name="enquiries")
    location = models.CharField(max_length=255, blank=True)
    plot_dimensions = models.CharField(max_length=120, blank=True)
    construction_type = models.CharField(max_length=120, blank=True)
    floors = models.PositiveSmallIntegerField(null=True, blank=True)
    budget = models.CharField(max_length=120, blank=True)
    preferred_visit_date = models.DateField(null=True, blank=True)
    internal_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Enquiries"
