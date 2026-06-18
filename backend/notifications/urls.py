from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet

# Le DefaultRouter génère automatiquement toutes les routes CRUD standard 
# ainsi que ton action personnalisée 'marquer-lue'
router = DefaultRouter()
router.register(r'', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]