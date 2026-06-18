from rest_framework import viewsets
from .models import CategorieMaintenance, Maintenance
from .serializers import CategorieMaintenanceSerializer, MaintenanceSerializer


# ici aussi on va utiliser setviews pour générer le crud de maintenance et categorie de mainteance
class CategorieMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = CategorieMaintenance.objects.all()
    serializer_class = CategorieMaintenanceSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer