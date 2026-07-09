from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Categorie, Materiel
from .serializers import CategorieSerializer, MaterielSerializer
from historiques.utils import enregistrer_historique


# ── Catégories ────────────────────────────────────────────────────────────────
class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [permissions.IsAuthenticated]


# ── Matériels ─────────────────────────────────────────────────────────────────
class MaterielViewSet(viewsets.ModelViewSet):
    queryset = Materiel.objects.all()
    serializer_class = MaterielSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Nécessaire pour accepter les uploads de photos (multipart/form-data)
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        instance = serializer.save()
        enregistrer_historique(
            self.request.user,
            
            'CREATION',
            f"Matériel '{instance.designation}' créé."
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        enregistrer_historique(
            self.request.user,
            'MODIFICATION',
            f"Matériel '{instance.designation}' modifié."
        )

    def perform_destroy(self, instance):
        designation = instance.designation
        instance.delete()
        enregistrer_historique(
            self.request.user,
            'SUPPRESSION',
            f"Matériel '{designation}' supprimé."
        )