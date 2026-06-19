"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# 📚 IMPORTATIONS POUR SWAGGER / OPENAPI
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # 🏢 Interface d'administration Django
    path('admin/', admin.site.urls),
    
    # 🔑 Route pour la connexion (génère le jeton JWT d'accès et de rafraîchissement)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 🔄 Route pour renouveler le jeton d'accès expiré
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 🛠️ BRANCHEMENT DES APPLICATIONS (Le travail de votre binôme)
    path('api/', include('materiels.urls')),
    path('api/', include('utilisateurs.urls')),
    path('api/', include('emprunts.urls')),
    path('api/', include('maintenance.urls')),
    path('api/', include('notifications.urls')),
    path('api/', include('rendezvous.urls')),
    path('api/', include('historiques.urls')),

    # 📖 DOCUMENTATION API (SWAGGER)
    # Génère et télécharge le fichier de spécification OpenAPI au format YAML/JSON
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Affiche l'interface interactive Swagger UI dans le navigateur
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]