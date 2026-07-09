from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieMaintenanceViewSet, MaintenanceViewSet

router = DefaultRouter()
router.register(r'categories', CategorieMaintenanceViewSet, basename='categorie-maintenance')
router.register(r'', MaintenanceViewSet, basename='maintenance')

urlpatterns = [
    path('', include(router.urls)),
]