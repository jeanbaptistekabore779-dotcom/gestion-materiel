from rest_framework import serializers
from .models import Emprunt
from utilisateurs.serializers import UtilisateurSerializer

class EmpruntSerializer(serializers.ModelSerializer):
    # Permet d'embarquer les détails complets de l'utilisateur qui emprunte lors d'un GET
    utilisateur_details = UtilisateurSerializer(source='utilisateur', read_only=True)
    
    class Meta:
        model = Emprunt
        fields = [
            'id', 
            'utilisateur', 
            'utilisateur_details', 
            'materiel',  
            'date_sortie', 
            'date_retour_prevue', 
            'date_retour_effective', 
            'statut', 
            'observations'
        ]
        read_only_fields = ['date_sortie', 'date_retour_effective', 'statut']