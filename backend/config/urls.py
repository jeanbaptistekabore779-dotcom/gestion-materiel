from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 🔐 Routes d'authentification JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 🏢 Routes des applications métiers
    path('api/utilisateurs/', include('utilisateurs.urls')),
    path('api/materiels/', include('materiels.urls')),
    path('api/emprunts/', include('emprunts.urls')),
    path('api/notifications/', include('notifications.urls')),
    
    # 🔧 AJOUTER CES 3 LIGNES :
    path('api/maintenance/', include('maintenance.urls')),      
    path('api/rendezvous/', include('rendezvous.urls')),        
    path('api/historiques/', include('historiques.urls')),     

    # 📖 Documentation Swagger
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]