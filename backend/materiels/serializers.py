from rest_framework import serializers
<<<<<<< HEAD
from .models import Materiel

class MaterielSerializer(serializers.ModelSerializer):
    # Permet d'afficher le texte lisible des choix (ex: 'Disponible' au lieu de 'DISPONIBLE') dans l'API
    statut_affichage = serializers.CharField(source='get_statut_display', read_only=True)
    categorie_affichage = serializers.CharField(source='get_categorie_display', read_only=True)
=======
from .models import Categorie, Materiel

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class MaterielSerializer(serializers.ModelSerializer):
    # Rappel : ce champ reste virtuel, il n'existe pas en BDD, juste dans le JSON
    categorie_details = CategorieSerializer(source='categorie', read_only=True)
>>>>>>> origin/Ma-Partie-De-Gestion

    class Meta:
        model = Materiel
        fields = [
<<<<<<< HEAD
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
=======
            'id', 'categorie', 'categorie_details', 'libelle', 'emplacement_physique', 
            'detenteur_actuel', 'etat', 'quantite', 'quantite_disponible', 
            'date_acquisition', 'description', 'photo'
        ]
>>>>>>> origin/Ma-Partie-De-Gestion
