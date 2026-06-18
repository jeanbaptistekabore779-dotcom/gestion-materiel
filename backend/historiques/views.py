

from rest_framework import viewsets
from .models import Historique
from .serializers import HistoriqueSerializer

#ReadOnlyModelViewSet permet uniquement :

#GET /api/historiques/
#GET /api/historiques/1/
class HistoriqueViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Historique.objects.all()
    serializer_class = HistoriqueSerializer