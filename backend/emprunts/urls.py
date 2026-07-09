from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmpruntViewSet

router = DefaultRouter()
router.register(r'', EmpruntViewSet, basename='emprunt')  # ← r'' au lieu de r'emprunts'

urlpatterns = [
    path('', include(router.urls)),
]