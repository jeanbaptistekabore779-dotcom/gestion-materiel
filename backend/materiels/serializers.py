from rest_framework import serializers
from .models import Categorie, Materiel

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class MaterielSerializer(serializers.ModelSerializer):
    # Rappel : ce champ reste virtuel, il n'existe pas en BDD, juste dans le JSON pour Flutter
    categorie_details = CategorieSerializer(source='categorie', read_only=True)

    class Meta:
        model = Materiel
        fields = [
            'id', 'categorie', 'categorie_details', 'libelle', 'emplacement_physique', 
            'detenteur_actuel', 'etat', 'quantite', 'quantite_disponible', 
            'date_acquisition', 'description', 'photo'
        ]