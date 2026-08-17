from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MediaViewSet, RegisterView


# =========================================
# ROUTER
# =========================================

router = DefaultRouter()

router.register(
    r"media",
    MediaViewSet,
    basename="media"
)


# =========================================
# URLS
# =========================================

urlpatterns = [

    path(
        "auth/register/",
        RegisterView.as_view(),
        name="register"
    ),

]

urlpatterns += router.urls