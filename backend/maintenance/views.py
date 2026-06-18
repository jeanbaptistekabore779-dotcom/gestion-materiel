from rest_framework import viewsets
from maintenance.models import Maintenance
from .models import CategorieMaintenance
from .serializers import MaintenanceSerializer, CategorieMaintenanceSerializer
from maintenance.serializers import MaintenanceSerializer
from historiques.utils import enregistrer_historique

class CategorieMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = CategorieMaintenance.objects.all()
    serializer_class = CategorieMaintenanceSerializer
class MaintenanceViewSet(viewsets.ModelViewSet):
    # 1. Source des données
    queryset = Maintenance.objects.all()
    # 2. Sérialiseur associé
    serializer_class = MaintenanceSerializer

    def perform_create(self, serializer):
        # Sauvegarde de l'instance
        instance = serializer.save()
        # Enregistrement de l'historique
        enregistrer_historique(
            self.request.user, 
            'MAINTENANCE', 
            f"Déclaration de maintenance pour {instance.materiel.libelle}"
        )

    def perform_update(self, serializer):
        # Sauvegarde des modifications
        instance = serializer.save()
        # Enregistrement de l'historique
        enregistrer_historique(
            self.request.user, 
            'MODIFICATION', 
            f"Mise à jour maintenance ID {instance.id}"
        )

    def perform_destroy(self, instance):
        # On récupère l'info avant suppression
        id_maintenance = instance.id
        # Suppression
        instance.delete()
        # Enregistrement de l'historique
        enregistrer_historique(
            self.request.user, 
            'SUPPRESSION', 
            f"Maintenance ID {id_maintenance} supprimée"
        )