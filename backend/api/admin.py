from django.contrib import admin

from .models import BlogPost, Enquiry, GalleryItem, Property, PropertyImage, SiteSettings, Testimonial


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("title", "property_type", "status", "location", "is_featured", "is_demo")
    list_filter = ("property_type", "status", "is_featured", "is_demo")
    search_fields = ("title", "location", "slug")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PropertyImageInline]


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "enquiry_type", "status", "created_at")
    list_filter = ("enquiry_type", "status")
    search_fields = ("name", "phone", "email")


admin.site.register(SiteSettings)
admin.site.register(Testimonial)
admin.site.register(GalleryItem)
admin.site.register(BlogPost)
