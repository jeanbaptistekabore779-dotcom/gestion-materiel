from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Emprunt
from .serializers import EmpruntSerializer

class EmpruntViewSet(viewsets.ModelViewSet):
    """
    Contrôleur API pour gérer automatiquement tout le CRUD des emprunts
    (Lister, Créer, Visualiser, Modifier, Supprimer)
    """
    queryset = Emprunt.objects.all()
    serializer_class = EmpruntSerializer
    permission_classes = [IsAuthenticated] # Exige un token JWT valide