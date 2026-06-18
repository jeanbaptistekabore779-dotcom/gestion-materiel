"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # 🏢 Interface d'administration Django
    path('admin/', admin.site.urls),
    
    # 🔑 Route pour la connexion (génère le jeton JWT d'accès et de rafraîchissement)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 🔄 Route pour renouveler le jeton d'accès expiré
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]