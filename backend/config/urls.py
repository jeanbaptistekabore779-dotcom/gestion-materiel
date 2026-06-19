from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # 🏢 Interface d'administration Django
    path('admin/', admin.site.urls),
    
    # 🔑 Authentification JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 🛠️ Les modules applicatifs fusionnés (Toutes les applications)
    path('api/', include('utilisateurs.urls')),
    path('api/', include('emprunts.urls')),
    path('api/', include('notifications.urls')),
    path('api/', include('materiels.urls')),
    path('api/', include('maintenance.urls')),
    path('api/', include('rendezvous.urls')),
    path('api/', include('historiques.urls')),

    # 📖 Documentation API (Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]