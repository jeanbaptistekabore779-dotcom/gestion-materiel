from rest_framework import viewsets, permissions
from .models import Materiel
from .serializers import MaterielSerializer

class MaterielViewSet(viewsets.ModelViewSet):
    queryset = Materiel.objects.all()
    serializer_class = MaterielSerializer
    permission_classes = [permissions.IsAuthenticated]