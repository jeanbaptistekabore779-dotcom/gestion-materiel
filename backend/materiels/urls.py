from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieViewSet, MaterielViewSet

router = DefaultRouter()
# Route pour les catégories -> /api/materiels/categories/
router.register(r'categories', CategorieViewSet, basename='categorie')

# Route pour les matériels -> /api/materiels/materiels
router.register(r'materiels', MaterielViewSet, basename='materiel')

urlpatterns = [
    path('', include(router.urls)),
]