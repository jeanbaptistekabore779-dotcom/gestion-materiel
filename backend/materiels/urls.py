from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieViewSet, MaterielViewSet

router = DefaultRouter()
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'', MaterielViewSet, basename='materiel')  # → /api/materiels/

urlpatterns = [
    path('', include(router.urls)),
]