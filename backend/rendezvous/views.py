# rendezvous/views.py
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Disponibilite, RendezVous
from .serializers import DisponibiliteSerializer, RendezVousSerializer
from historiques.utils import enregistrer_historique


def est_admin(user):
    return user.is_staff or getattr(user, 'role', '') in ['ADMIN', 'TECHNICIEN']


class DisponibiliteViewSet(viewsets.ModelViewSet):
    """CRUD des créneaux hebdomadaires — réservé aux administrateurs."""
    queryset = Disponibilite.objects.all()
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if not est_admin(self.request.user):
            raise PermissionDenied("Seul un administrateur peut configurer les créneaux.")
        creneau = serializer.save()
        enregistrer_historique(
            self.request.user,
            'CREATION',
            f'Créneau ajouté : {creneau.get_jour_semaine_display()} {creneau.heure_debut}–{creneau.heure_fin} ({creneau.lieu}).',
        )

    def perform_update(self, serializer):
        if not est_admin(self.request.user):
            raise PermissionDenied("Seul un administrateur peut modifier les créneaux.")
        creneau = serializer.save()
        enregistrer_historique(
            self.request.user,
            'MODIFICATION',
            f'Créneau modifié : {creneau.get_jour_semaine_display()} {creneau.heure_debut}–{creneau.heure_fin} ({creneau.lieu}).',
        )

    def perform_destroy(self, instance):
        if not est_admin(self.request.user):
            raise PermissionDenied("Seul un administrateur peut supprimer un créneau.")
        description = f'Créneau supprimé : {instance.get_jour_semaine_display()} {instance.heure_debut}–{instance.heure_fin}.'
        instance.delete()
        enregistrer_historique(self.request.user, 'SUPPRESSION', description)


class RendezVousViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture des rendez-vous. Les admins voient tout, les étudiants voient les leurs."""
    serializer_class = RendezVousSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if est_admin(user):
            return RendezVous.objects.all()
        return RendezVous.objects.filter(beneficiaire=user)