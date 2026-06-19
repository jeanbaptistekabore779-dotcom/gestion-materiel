from django.contrib import admin
from django.urls import path, include
<<<<<<< HEAD
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
=======
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
>>>>>>> origin/Ma-Partie-De-Gestion

urlpatterns = [

# Routes Swagger
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    path('admin/', admin.site.urls),
<<<<<<< HEAD
    
    # Les Routes d'authentification JWT (Indispensables pour se connecter)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Les modules applicatifs fusionnés
    path('api/', include('utilisateurs.urls')),
    path('api/', include('emprunts.urls')),
    path('api/', include('notifications.urls')),  # Ajout de l'application notifications
]
=======
    path('api/materiels/', include('materiels.urls')),
    path('api/maintenance/', include('maintenance.urls')),
    path('api/', include('rendezvous.urls')),
    path('api/',include('historiques.urls')
),
]
>>>>>>> origin/Ma-Partie-De-Gestion
