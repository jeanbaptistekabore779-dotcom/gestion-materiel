from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterielViewSet

# Configuration du routeur DRF
router = DefaultRouter()
router.register(r'', MaterielViewSet, basename='materiel')

urlpatterns = [
    path('', include(router.urls)),
]