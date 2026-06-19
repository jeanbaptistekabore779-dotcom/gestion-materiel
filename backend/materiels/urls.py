from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import MaterielViewSet

# Configuration du routeur DRF
router = DefaultRouter()
router.register(r'', MaterielViewSet, basename='materiel')
=======
from .views import CategorieViewSet, MaterielViewSet

router = DefaultRouter()
# Route pour les catégories -> /api/materiels/categories/
router.register(r'categories', CategorieViewSet, basename='categorie')

# Route pour les matériels -> /api/materiels/materiels
router.register(r'materiels', MaterielViewSet, basename='materiel')
>>>>>>> origin/Ma-Partie-De-Gestion

urlpatterns = [
    path('', include(router.urls)),
]