from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Utilisateur
from .serializers import UtilisateurSerializer, RegisterSerializer

class UtilisateurViewSet(viewsets.ModelViewSet):
    """
    ViewSet fournissant automatiquement les actions CRUD pour le modèle Utilisateur :
    - GET    /api/utilisateurs/          (Liste de tous les utilisateurs)
    - GET    /api/utilisateurs/{id}/     (Détails d'un utilisateur spécifié)
    - PUT    /api/utilisateurs/{id}/     (Mise à jour complète d'un utilisateur)
    - DELETE /api/utilisateurs/{id}/     (Suppression d'un utilisateur)
    """
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    
    # Par défaut, la consultation et la modification du CRUD nécessitent une authentification JWT
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='inscription')
    def inscription(self, request):
        """
        Point d'accès personnalisé pour l'inscription autonome :
        POST /api/utilisateurs/inscription/
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # On retourne la représentation standard de l'utilisateur qui vient d'être créé
            user_data = UtilisateurSerializer(user).data
            return Response({
                "message": "Utilisateur créé avec succès !",
                "utilisateur": user_data
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)