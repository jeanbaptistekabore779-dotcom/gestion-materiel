from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Utilisateur
from .serializers import UtilisateurSerializer, RegisterSerializer
from .permissions import IsAdmin
from historiques.utils import enregistrer_historique


class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all().order_by('-date_creation')
    serializer_class = UtilisateurSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action == 'me':
            return [IsAuthenticated()]
        if self.action == 'inscription':
            return [AllowAny()]
        # list, retrieve, create, update, partial_update, destroy, suspendre, signaler → admin uniquement
        return [IsAdmin()]

    def get_serializer_class(self):
        # 'create' (admin) et 'inscription' (public) doivent gérer le mot de passe
        if self.action in ['create', 'inscription']:
            return RegisterSerializer
        return UtilisateurSerializer

    def perform_create(self, serializer):
        utilisateur = serializer.save()
        enregistrer_historique(
            self.request.user,
            'CREATION',
            f'Compte créé pour {utilisateur.prenom} {utilisateur.nom} ({utilisateur.username}) — rôle {utilisateur.get_role_display()}.',
        )

    def perform_update(self, serializer):
        utilisateur = serializer.save()
        enregistrer_historique(
            self.request.user,
            'MODIFICATION',
            f'Compte modifié : {utilisateur.prenom} {utilisateur.nom} ({utilisateur.username}).',
        )

    def perform_destroy(self, instance):
        description = f'Compte supprimé : {instance.prenom} {instance.nom} ({instance.username}).'
        instance.delete()
        enregistrer_historique(self.request.user, 'SUPPRESSION', description)

    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = UtilisateurSerializer(user, context={'request': request})
            return Response(serializer.data)
        if request.method == 'PATCH':
            serializer = UtilisateurSerializer(
                user, data=request.data, partial=True, context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='inscription')
    def inscription(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = UtilisateurSerializer(user).data
            enregistrer_historique(
                user,
                'CREATION',
                f'Inscription publique de {user.prenom} {user.nom} ({user.username}).',
            )
            return Response({
                "message": "Utilisateur créé avec succès !",
                "utilisateur": user_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='suspendre')
    def suspendre(self, request, pk=None):
        """Bascule un compte entre ACTIF et SUSPENDU."""
        utilisateur = self.get_object()

        if utilisateur.statut == 'SUSPENDU':
            utilisateur.statut = 'ACTIF'
            utilisateur.is_active = True
            action_log = 'MODIFICATION'
            message = f'Compte réactivé : {utilisateur.prenom} {utilisateur.nom}.'
        else:
            utilisateur.statut = 'SUSPENDU'
            utilisateur.is_active = False  # empêche aussi la connexion
            action_log = 'SUSPENSION'
            message = f'Compte suspendu : {utilisateur.prenom} {utilisateur.nom}.'

        utilisateur.save()
        enregistrer_historique(request.user, action_log, message)

        return Response({'success': True, 'statut': utilisateur.statut})

    @action(detail=True, methods=['post'], url_path='signaler')
    def signaler(self, request, pk=None):
        """Signale un compte aux autorités (ex: matériel non rendu)."""
        utilisateur = self.get_object()
        motif = request.data.get('motif', '').strip()

        if not motif:
            return Response({'error': 'Le motif du signalement est obligatoire.'}, status=status.HTTP_400_BAD_REQUEST)

        utilisateur.statut = 'SIGNALE'
        utilisateur.save()

        enregistrer_historique(
            request.user,
            'SIGNALEMENT',
            f'Compte signalé : {utilisateur.prenom} {utilisateur.nom} — Motif : {motif}',
        )

        return Response({'success': True, 'statut': 'SIGNALE'})