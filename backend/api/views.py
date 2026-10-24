from django.db.models import Q
from django_filters import rest_framework as filters
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BlogPost, Enquiry, GalleryItem, Property, PropertyImage, SiteSettings, Testimonial
from .permissions import IsStaffUser
from .serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    DashboardStatsSerializer,
    EnquiryAdminUpdateSerializer,
    EnquiryPublicCreateSerializer,
    EnquirySerializer,
    GalleryItemSerializer,
    PropertyDetailSerializer,
    PropertyListSerializer,
    PropertyWriteSerializer,
    SiteSettingsSerializer,
    TestimonialSerializer,
)


class PropertyFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_area = filters.NumberFilter(field_name="area_value", lookup_expr="gte")
    max_area = filters.NumberFilter(field_name="area_value", lookup_expr="lte")
    location = filters.CharFilter(field_name="location", lookup_expr="icontains")
    featured = filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = Property
        fields = ["property_type", "status", "city", "featured"]


class PropertyViewSet(viewsets.ModelViewSet):
    lookup_field = "slug"
    filterset_class = PropertyFilter
    search_fields = ["title", "location", "description"]
    ordering_fields = ["price", "created_at", "area_value"]

    def get_queryset(self):
        return Property.objects.all()

    def _is_staff(self):
        user = self.request.user
        return user and user.is_authenticated and user.is_staff

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy", "upload_images"):
            return [IsStaffUser()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return PropertyWriteSerializer
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertyListSerializer

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser], permission_classes=[IsStaffUser])
    def upload_images(self, request, slug=None):
        prop = self.get_object()
        files = request.FILES.getlist("images")
        created = []
        for idx, f in enumerate(files):
            img = PropertyImage.objects.create(property=prop, image=f, sort_order=idx)
            created.append(img.id)
        serializer = PropertyDetailSerializer(prop, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.select_related("property").all()
    filterset_fields = ["enquiry_type", "status"]
    search_fields = ["name", "phone", "email", "message"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsStaffUser()]

    def get_serializer_class(self):
        if self.action == "create":
            return EnquiryPublicCreateSerializer
        if self.action in ("update", "partial_update"):
            return EnquiryAdminUpdateSerializer
        return EnquirySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry = serializer.save()
        return Response(EnquirySerializer(enquiry).data, status=status.HTTP_201_CREATED)


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsStaffUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_staff):
            qs = qs.filter(is_published=True)
        return qs


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsStaffUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_staff):
            qs = qs.filter(is_published=True)
        return qs


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    queryset = BlogPost.objects.filter(is_published=True)
    search_fields = ["title", "excerpt", "body"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BlogPostDetailSerializer
        return BlogPostListSerializer


class SiteSettingsView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsStaffUser()]

    def get(self, request):
        settings_obj = SiteSettings.get()
        return Response(SiteSettingsSerializer(settings_obj).data)

    def patch(self, request):
        settings_obj = SiteSettings.get()
        serializer = SiteSettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DashboardStatsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        data = {
            "total_properties": Property.objects.count(),
            "available_properties": Property.objects.filter(status=Property.Status.AVAILABLE).count(),
            "sold_properties": Property.objects.filter(status=Property.Status.SOLD).count(),
            "total_enquiries": Enquiry.objects.count(),
            "new_enquiries": Enquiry.objects.filter(status=Enquiry.Status.NEW).count(),
            "construction_enquiries": Enquiry.objects.filter(enquiry_type=Enquiry.EnquiryType.CONSTRUCTION).count(),
        }
        return Response(DashboardStatsSerializer(data).data)


class PropertyCompareView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        slugs = request.query_params.get("slugs", "")
        slug_list = [s.strip() for s in slugs.split(",") if s.strip()][:4]
        if not slug_list:
            return Response({"detail": "Provide slugs query param"}, status=status.HTTP_400_BAD_REQUEST)
        props = Property.objects.filter(slug__in=slug_list)
        serializer = PropertyDetailSerializer(props, many=True, context={"request": request})
        return Response(serializer.data)
