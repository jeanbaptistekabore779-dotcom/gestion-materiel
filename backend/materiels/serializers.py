from rest_framework import serializers
from .models import Materiel

class MaterielSerializer(serializers.ModelSerializer):
    # Permet d'afficher le texte lisible des choix (ex: 'Disponible' au lieu de 'DISPONIBLE') dans l'API
    statut_affichage = serializers.CharField(source='get_statut_display', read_only=True)
    categorie_affichage = serializers.CharField(source='get_categorie_display', read_only=True)

    class Meta:
        model = Materiel
        fields = [
            'id',
            'designation',
            'code_barre',
            'categorie',
            'categorie_affichage',
            'statut',
            'statut_affichage',
            'caracteristiques',
            'date_acquisition',
            'date_creation'
        ]
        # La date de création est gérée automatiquement par Django, elle doit être en lecture seule
        read_only_fields = ['date_creation']