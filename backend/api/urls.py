from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    BlogPostViewSet,
    DashboardStatsView,
    EnquiryViewSet,
    GalleryViewSet,
    PropertyCompareView,
    PropertyViewSet,
    SiteSettingsView,
    TestimonialViewSet,
)

router = DefaultRouter()
router.register(r"properties", PropertyViewSet, basename="property")
router.register(r"enquiries", EnquiryViewSet, basename="enquiry")
router.register(r"testimonials", TestimonialViewSet, basename="testimonial")
router.register(r"gallery", GalleryViewSet, basename="gallery")
router.register(r"blog", BlogPostViewSet, basename="blog")

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("site-settings/", SiteSettingsView.as_view(), name="site-settings"),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("properties/compare/", PropertyCompareView.as_view(), name="property-compare"),
    path("", include(router.urls)),
]
