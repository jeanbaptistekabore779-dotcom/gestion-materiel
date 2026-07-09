# historiques/urls.py

from rest_framework.routers import DefaultRouter
from .views import HistoriqueViewSet

router = DefaultRouter()

# On laisse la chaîne vide '' car le préfixe 'api/historiques/' est déjà
# géré par le urls.py principal (config/urls.py) — sinon on obtient
# /api/historiques/historiques/ (doublé) et le frontend reçoit un 404.
router.register(r'', HistoriqueViewSet, basename='historiques')

urlpatterns = router.urls