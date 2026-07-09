# emprunts/views.py
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import Emprunt
from .serializers import EmpruntSerializer
from rendezvous.services import creer_rendezvous_automatique, AucunCreneauDisponible
from notifications.models import Notification
from historiques.utils import enregistrer_historique

User = get_user_model()


class EmpruntViewSet(viewsets.ModelViewSet):
    serializer_class = EmpruntSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'role', '') in ['ADMIN', 'TECHNICIEN']:
            return Emprunt.objects.all().order_by('-date_sortie')
        return Emprunt.objects.filter(utilisateur=user).order_by('-date_sortie')

    def perform_create(self, serializer):
        emprunt = serializer.save(utilisateur=self.request.user)
        enregistrer_historique(
            self.request.user,
            'EMPRUNT',
            f'Nouvelle demande d\'emprunt pour "{emprunt.materiel.designation if emprunt.materiel else "un matériel"}".',
        )

    @action(detail=True, methods=['post'], url_path='valider')
    def valider(self, request, pk=None):
        if not request.user.is_staff and getattr(request.user, 'role', '') not in ['ADMIN', 'TECHNICIEN']:
            return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)

        emprunt = self.get_object()

        if emprunt.statut != 'EN_ATTENTE':
            return Response(
                {'error': f'Cette demande est déjà "{emprunt.get_statut_display()}".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        type_rdv = request.data.get('type_rdv', 'RETRAIT')

        try:
            rdv = creer_rendezvous_automatique(
                emprunt=emprunt,
                administrateur=request.user,
                type_rdv=type_rdv,
            )
        except AucunCreneauDisponible as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        emprunt.statut = 'APPROUVE'
        emprunt.save()

        log_action_desc = (
            f'Emprunt de "{emprunt.materiel.designation if emprunt.materiel else "matériel"}" '
            f'validé pour {emprunt.utilisateur.username if emprunt.utilisateur else "un utilisateur"}, '
            f'RDV le {rdv.date_heure.strftime("%d/%m/%Y à %Hh%M")}.'
        )
        enregistrer_historique(request.user, 'VALIDATION', log_action_desc)

        return Response({
            'success': True,
            'statut': 'APPROUVE',
            'rdv': rdv.date_heure.strftime('%d/%m/%Y à %Hh%M'),
            'lieu': rdv.lieu,
            'materiel': emprunt.materiel.designation if emprunt.materiel else 'Inconnu',
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='refuser')
    def refuser(self, request, pk=None):
        if not request.user.is_staff and getattr(request.user, 'role', '') not in ['ADMIN', 'TECHNICIEN']:
            return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)

        emprunt = self.get_object()

        if emprunt.statut != 'EN_ATTENTE':
            return Response(
                {'error': f'Cette demande est déjà "{emprunt.get_statut_display()}".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        motif = request.data.get('motif', '')

        emprunt.statut = 'REFUSE'
        emprunt.save()

        Notification.objects.create(
            destinataire=emprunt.utilisateur,
            emprunt=emprunt,
            typeNotification='EMPRUNT',
            message=(
                f'Votre demande pour "{emprunt.materiel.designation if emprunt.materiel else "ce matériel"}" '
                f'a été refusée.'
                + (f' Motif : {motif}' if motif else '')
            ),
            lue=False,
        )

        motif_desc = (
            f'Emprunt de "{emprunt.materiel.designation if emprunt.materiel else "matériel"}" refusé'
            + (f', motif : {motif}' if motif else '.')
        )
        enregistrer_historique(request.user, 'REJET', motif_desc)

        return Response({'success': True, 'statut': 'REFUSE'})

    @action(detail=True, methods=['post'], url_path='confirmer-retrait')
    def confirmer_retrait(self, request, pk=None):
        """
        Confirme que le matériel a été physiquement remis à l'emprunteur.
        C'est ce moment précis qui décrémente le stock disponible.
        """
        if getattr(request.user, 'role', '') not in ['ADMIN', 'TECHNICIEN']:
            return Response({'error': 'Seul un administrateur peut confirmer un retrait.'}, status=status.HTTP_403_FORBIDDEN)

        emprunt = self.get_object()

        if emprunt.statut != 'APPROUVE':
            return Response(
                {'error': f'Impossible de confirmer le retrait d\'un emprunt "{emprunt.get_statut_display()}".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        materiel = emprunt.materiel
        if not materiel:
            return Response({'error': 'Aucun matériel associé à cet emprunt.'}, status=status.HTTP_400_BAD_REQUEST)

        if materiel.quantite_disponible <= 0:
            return Response(
                {'error': f'"{materiel.designation}" n\'a plus aucun exemplaire disponible en stock.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        materiel.quantite_disponible -= 1
        materiel.detenteur_actuel = emprunt.utilisateur
        if materiel.quantite_disponible == 0:
            materiel.statut = 'EMPRUNTE'
            materiel.etat = 'EMPRUNTE'
        materiel.save()

        emprunt.statut = 'EN_COURS'
        emprunt.save()

        Notification.objects.create(
            destinataire=emprunt.utilisateur,
            emprunt=emprunt,
            typeNotification='EMPRUNT',
            message=f'Le retrait de "{materiel.designation}" a été confirmé. Bonne utilisation !',
            lue=False,
        )

        enregistrer_historique(
            request.user,
            'MODIFICATION',
            f'Retrait confirmé pour "{materiel.designation}", remis à {emprunt.utilisateur.username}. '
            f'Stock restant : {materiel.quantite_disponible}/{materiel.quantite}.',
        )

        return Response({
            'success': True,
            'statut': 'EN_COURS',
            'quantite_disponible': materiel.quantite_disponible,
            'materiel_statut': materiel.statut,
        })

    @action(detail=True, methods=['post'], url_path='declarer-retour')
    def declarer_retour(self, request, pk=None):
        """
        L'UTILISATEUR déclare qu'il rend le matériel. Ne modifie JAMAIS le stock,
        c'est uniquement une notification à l'administrateur/technicien.
        """
        emprunt = self.get_object()

        if emprunt.utilisateur_id != request.user.id:
            return Response(
                {'error': 'Vous ne pouvez déclarer le retour que de vos propres emprunts.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if emprunt.statut not in ['EN_COURS', 'EN_RETARD']:
            return Response(
                {'error': f'Impossible de déclarer le retour d\'un emprunt "{emprunt.get_statut_display()}".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        emprunt.statut = 'RETOUR_DECLARE'
        emprunt.date_retour_declare = timezone.now()
        emprunt.save()

        for admin in User.objects.filter(role__in=['ADMIN', 'TECHNICIEN']):
            Notification.objects.create(
                destinataire=admin,
                emprunt=emprunt,
                typeNotification='EMPRUNT',
                message=(
                    f'{emprunt.utilisateur.username} a déclaré le retour de '
                    f'"{emprunt.materiel.designation if emprunt.materiel else "matériel"}". '
                    f'Vérification et confirmation requises.'
                ),
                lue=False,
            )

        enregistrer_historique(
            request.user,
            'RETOUR',
            f'Retour déclaré par {emprunt.utilisateur.username} pour '
            f'"{emprunt.materiel.designation if emprunt.materiel else "matériel"}", en attente de confirmation.',
        )

        return Response({'success': True, 'statut': 'RETOUR_DECLARE'})

    @action(detail=True, methods=['post'], url_path='confirmer-retour')
    def confirmer_retour(self, request, pk=None):
        """
        Seul un ADMIN/TECHNICIEN peut confirmer la réception physique
        et mettre à jour le stock, selon l'état constaté du matériel.
        """
        if getattr(request.user, 'role', '') not in ['ADMIN', 'TECHNICIEN']:
            return Response({'error': 'Seul un administrateur ou technicien peut confirmer un retour.'}, status=status.HTTP_403_FORBIDDEN)

        emprunt = self.get_object()

        if emprunt.statut != 'RETOUR_DECLARE':
            return Response(
                {'error': f'Le retour doit d\'abord être déclaré par l\'utilisateur (statut actuel : "{emprunt.get_statut_display()}").'},
                status=status.HTTP_400_BAD_REQUEST
            )

        etat_retour = request.data.get('etat_retour')
        if etat_retour not in Emprunt.EtatRetour.values:
            return Response({'error': 'État du matériel invalide ou manquant.'}, status=status.HTTP_400_BAD_REQUEST)

        materiel = emprunt.materiel
        if not materiel:
            return Response({'error': 'Aucun matériel associé à cet emprunt.'}, status=status.HTTP_400_BAD_REQUEST)

        nouveau_statut_emprunt = 'RETOURNE'

        if etat_retour in [Emprunt.EtatRetour.BON_ETAT, Emprunt.EtatRetour.INCOMPLET]:
            materiel.quantite_disponible = min(materiel.quantite_disponible + 1, materiel.quantite)
            if materiel.quantite_disponible > 0:
                materiel.statut = 'DISPONIBLE'
                materiel.etat = 'DISPONIBLE'

        elif etat_retour == Emprunt.EtatRetour.ENDOMMAGE:
            materiel.quantite_disponible = min(materiel.quantite_disponible + 1, materiel.quantite)
            materiel.statut = 'EN_PANNE'
            materiel.etat = 'EN_MAINTENANCE'
            nouveau_statut_emprunt = 'PERDU'  # utilise ton statut existant "Perdu / Dégradé"

        elif etat_retour == Emprunt.EtatRetour.HORS_SERVICE:
            materiel.statut = 'HORS_SERVICE'
            materiel.etat = 'HORS_SERVICE'
            # quantite_disponible NE change pas ici : l'exemplaire sort définitivement du parc utilisable.
            nouveau_statut_emprunt = 'PERDU'

        if materiel.detenteur_actuel_id == emprunt.utilisateur_id:
            materiel.detenteur_actuel = None

        materiel.save()

        emprunt.statut = nouveau_statut_emprunt
        emprunt.date_retour_effective = timezone.now()
        emprunt.etat_retour = etat_retour
        emprunt.observations = request.data.get('observations', emprunt.observations)
        emprunt.save()

        Notification.objects.create(
            destinataire=emprunt.utilisateur,
            emprunt=emprunt,
            typeNotification='EMPRUNT',
            message=f'Le retour de "{materiel.designation}" a été confirmé par l\'administrateur.',
            lue=False,
        )

        enregistrer_historique(
            request.user,
            'RETOUR',
            f'Retour de "{materiel.designation}" confirmé, état : {emprunt.get_etat_retour_display()}. '
            f'Stock disponible : {materiel.quantite_disponible}/{materiel.quantite}.',
        )

        return Response({
            'success': True,
            'statut': emprunt.statut,
            'materiel_statut': materiel.statut,
            'quantite_disponible': materiel.quantite_disponible,
        })