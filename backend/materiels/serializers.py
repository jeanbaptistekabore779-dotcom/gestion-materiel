from rest_framework import serializers
from .models import Categorie, Materiel

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class MaterielSerializer(serializers.ModelSerializer):
    # 💡 Champs virtuels pour un affichage lisible dans le JSON (Front-end React/Flutter)
    statut_affichage = serializers.CharField(source='get_statut_display', read_only=True)
    categorie_affichage = serializers.CharField(source='get_categorie_display', read_only=True)
    categorie_details = CategorieSerializer(source='categorie', read_only=True)

    class Meta:
        model = Materiel
        fields = [
            'id', 
            'code_barre',
            'designation', 
            'libelle',           # Ajouté par votre binôme
            'description', 
            'categorie', 
            'categorie_affichage', 
            'categorie_details', 
            'statut', 
            'statut_affichage', 
            'etat',              # Ajouté par votre binôme
            'emplacement_physique', # Ajouté par votre binôme
            'detenteur_actuel',  # Ajouté par votre binôme
            'quantite',          # Ajouté par votre binôme
            'quantite_disponible', # Ajouté par votre binôme
            'caracteristiques', 
            'photo',             # Ajouté par votre binôme
            'date_acquisition', 
            'date_creation'
        ]
        # La date de création est gérée automatiquement par Django
        read_only_fields = ['date_creation']