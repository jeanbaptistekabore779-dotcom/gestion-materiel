from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from rendezvous.views import DisponibiliteViewSet
from .logging_token_view import LoggingTokenObtainPairView  # adapte le chemin d'import si le fichier est ailleurs

# Routeur dédié aux ressources déclarées directement ici (pas via include('xxx.urls'))
router = DefaultRouter()
router.register(r'disponibilites', DisponibiliteViewSet, basename='disponibilite')

urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/token/',         LoggingTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),           name='token_refresh'),

    path('api/utilisateurs/', include('utilisateurs.urls')),
    path('api/materiels/',    include('materiels.urls')),
    path('api/emprunts/',     include('emprunts.urls')),
    path('api/notifications/',include('notifications.urls')),
    path('api/maintenance/',  include('maintenance.urls')),
    path('api/rendezvous/',   include('rendezvous.urls')),
    path('api/historiques/',  include('historiques.urls')),

    # Routes générées par le routeur ci-dessus : expose api/disponibilites/
    path('api/', include(router.urls)),

    path('api/schema/', SpectacularAPIView.as_view(),                      name='schema'),
    path('api/docs/',   SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/',  SpectacularRedocView.as_view(url_name='schema'),   name='redoc'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)