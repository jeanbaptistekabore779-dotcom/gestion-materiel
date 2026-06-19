# historiques/urls.py

from rest_framework.routers import DefaultRouter
from .views import HistoriqueViewSet

router = DefaultRouter()

router.register(r'historiques',HistoriqueViewSet,basename='historiques'
)

urlpatterns = router.urls