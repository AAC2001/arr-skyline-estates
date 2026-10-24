from rest_framework import serializers

from .models import BlogPost, Enquiry, GalleryItem, Property, PropertyImage, SiteSettings, Testimonial


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["id", "url", "caption", "sort_order"]

    def get_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url


class PropertyListSerializer(serializers.ModelSerializer):
    cover = serializers.SerializerMethodField()
    property_type_label = serializers.CharField(source="get_property_type_display", read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "slug",
            "is_demo",
            "property_type",
            "property_type_label",
            "status",
            "status_label",
            "location",
            "city",
            "price",
            "price_on_request",
            "area_value",
            "area_unit",
            "short_description",
            "is_featured",
            "cover",
            "created_at",
        ]

    def get_cover(self, obj):
        request = self.context.get("request")
        if obj.cover_image:
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return obj.cover_image_url


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    area_unit_label = serializers.CharField(source="get_area_unit_display", read_only=True)

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "state",
            "description",
            "amenities",
            "nearby_landmarks",
            "documentation_details",
            "latitude",
            "longitude",
            "area_unit_label",
            "images",
            "updated_at",
        ]


class PropertyWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "title",
            "is_demo",
            "property_type",
            "status",
            "location",
            "city",
            "state",
            "price",
            "price_on_request",
            "area_value",
            "area_unit",
            "short_description",
            "description",
            "amenities",
            "nearby_landmarks",
            "documentation_details",
            "latitude",
            "longitude",
            "is_featured",
            "cover_image",
            "cover_image_url",
        ]


class EnquirySerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True)

    class Meta:
        model = Enquiry
        fields = [
            "id",
            "enquiry_type",
            "status",
            "name",
            "phone",
            "email",
            "message",
            "property",
            "property_title",
            "location",
            "plot_dimensions",
            "construction_type",
            "floors",
            "budget",
            "preferred_visit_date",
            "internal_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "internal_notes"]


class EnquiryPublicCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = [
            "enquiry_type",
            "name",
            "phone",
            "email",
            "message",
            "property",
            "location",
            "plot_dimensions",
            "construction_type",
            "floors",
            "budget",
            "preferred_visit_date",
        ]


class EnquiryAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = ["status", "internal_notes"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "name", "role", "quote", "is_demo", "is_published", "sort_order"]


class GalleryItemSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = ["id", "title", "category", "url", "is_published"]

    def get_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url


class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ["id", "title", "slug", "excerpt", "cover_image_url", "published_at", "created_at"]


class BlogPostDetailSerializer(BlogPostListSerializer):
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ["body", "updated_at"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "company_name",
            "tagline",
            "phone",
            "whatsapp",
            "email",
            "address",
            "map_embed_url",
            "hero_heading",
            "hero_subheading",
            "intro_heading",
            "intro_body",
            "about_intro",
            "vision",
            "mission",
            "values_text",
            "commitment",
            "facebook_url",
            "instagram_url",
            "linkedin_url",
            "youtube_url",
        ]


class DashboardStatsSerializer(serializers.Serializer):
    total_properties = serializers.IntegerField()
    available_properties = serializers.IntegerField()
    sold_properties = serializers.IntegerField()
    total_enquiries = serializers.IntegerField()
    new_enquiries = serializers.IntegerField()
    construction_enquiries = serializers.IntegerField()
