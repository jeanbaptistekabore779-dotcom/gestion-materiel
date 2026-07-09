from rest_framework.routers import DefaultRouter
from .views import UtilisateurViewSet

router = DefaultRouter()
# On laisse la chaîne vide '' car le préfixe 'api/utilisateurs/' est déjà géré par le urls.py principal
router.register(r'', UtilisateurViewSet, basename='utilisateur')

urlpatterns = router.urls