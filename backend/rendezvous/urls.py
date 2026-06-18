from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RendezVousViewSet

# Le routeur de Django Rest Framework génère automatiquement toutes les routes CRUD
router = DefaultRouter()
router.register(r'rendezvous', RendezVousViewSet, basename='rendezvous')

urlpatterns = [
    # Inclut toutes les routes générées (ex: /api/rendezvous/)
    path('', include(router.urls)),
]