from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Les Routes d'authentification JWT (Indispensables pour se connecter)

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Les modules applicatifs
    
    path('api/', include('utilisateurs.urls')),
    path('api/', include('emprunts.urls')),
]