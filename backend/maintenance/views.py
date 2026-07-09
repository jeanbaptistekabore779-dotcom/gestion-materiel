# maintenance/views.py
from rest_framework import viewsets, permissions
from .models import CategorieMaintenance, Maintenance
from .serializers import CategorieMaintenanceSerializer, MaintenanceSerializer
from historiques.utils import enregistrer_historique
from notifications.models import Notification


class CategorieMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = CategorieMaintenance.objects.all()
    serializer_class = CategorieMaintenanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save()

        # Mettre le matériel EN_PANNE automatiquement
        if instance.materiel:
            instance.materiel.statut = 'EN_PANNE'
            instance.materiel.etat = 'EN_MAINTENANCE'
            instance.materiel.save()

        # ✅ Notifier le technicien assigné à la création
        if instance.technicien:
            Notification.objects.create(
                destinataire=instance.technicien,
                message=f"Nouvelle intervention assignée : {instance.materiel.designation if instance.materiel else 'matériel inconnu'}.",
                typeNotification='ALERTE',
            )

        enregistrer_historique(
            self.request.user,
            'MAINTENANCE',
            f"Déclaration de maintenance pour {instance.materiel.designation if instance.materiel else 'matériel inconnu'}"
        )

    def perform_update(self, serializer):
        # On récupère l'ancien technicien AVANT la sauvegarde pour détecter un changement d'assignation
        ancien_technicien_id = None
        if serializer.instance:
            ancien_technicien_id = serializer.instance.technicien_id

        instance = serializer.save()

        # Si la maintenance est TERMINEE → remettre le matériel DISPONIBLE
        if instance.statut == 'TERMINE' and instance.materiel:
            instance.materiel.statut = 'DISPONIBLE'
            instance.materiel.etat = 'DISPONIBLE'
            instance.materiel.save()

        # Si ANNULE → remettre DISPONIBLE aussi
        if instance.statut == 'ANNULE' and instance.materiel:
            instance.materiel.statut = 'DISPONIBLE'
            instance.materiel.etat = 'DISPONIBLE'
            instance.materiel.save()

        # ✅ Notifier le technicien si un nouveau technicien vient d'être assigné
        if instance.technicien and instance.technicien_id != ancien_technicien_id:
            Notification.objects.create(
                destinataire=instance.technicien,
                message=f"Intervention assignée : {instance.materiel.designation if instance.materiel else 'matériel inconnu'}.",
                typeNotification='ALERTE',
            )

        # ✅ Notifier le technicien si le statut de sa maintenance change (ex: terminé/annulé par un admin)
        if instance.technicien and instance.technicien_id == ancien_technicien_id and instance.statut in ('TERMINE', 'ANNULE'):
            Notification.objects.create(
                destinataire=instance.technicien,
                message=f"L'intervention sur {instance.materiel.designation if instance.materiel else 'matériel inconnu'} est marquée : {instance.get_statut_display()}.",
                typeNotification='INFO',
            )

        enregistrer_historique(
            self.request.user,
            'MODIFICATION',
            f"Mise à jour maintenance ID {instance.id} → {instance.statut}"
        )

    def perform_destroy(self, instance):
        id_maintenance = instance.id
        # Remettre le matériel disponible si on supprime la maintenance
        if instance.materiel:
            instance.materiel.statut = 'DISPONIBLE'
            instance.materiel.etat = 'DISPONIBLE'
            instance.materiel.save()
        instance.delete()
        enregistrer_historique(
            self.request.user,
            'SUPPRESSION',
            f"Maintenance ID {id_maintenance} supprimée"
        )