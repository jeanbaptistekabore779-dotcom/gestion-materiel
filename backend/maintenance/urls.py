from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieMaintenanceViewSet, MaintenanceViewSet



router = DefaultRouter()

# api/maintenance/categories-maintenances
router.register(r'categories-maintenance', CategorieMaintenanceViewSet, basename='categorie-maintenance')

#api/maintenance/maintenances
router.register(r'maintenance', MaintenanceViewSet, basename='maintenance')

urlpatterns = [
    path('', include(router.urls)),
]