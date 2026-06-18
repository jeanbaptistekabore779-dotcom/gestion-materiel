from rest_framework import serializers
from .models import RendezVous

class RendezVousSerializer(serializers.ModelSerializer):
    # Permet d'afficher proprement le texte complet du statut et du type lors de la lecture (GET)
    statut_affichage = serializers.CharField(source='get_statut_display', read_only=True)
    type_rdv_affichage = serializers.CharField(source='get_type_rdv_display', read_only=True)

    class Meta:
        model = RendezVous
        fields = [
            'id',  
            'administrateur', 
            'date_heure', 
            'type_rdv', 
            'type_rdv_affichage', 
            'statut', 
            'statut_affichage'
            
        ]
        # L'administrateur connecté sera automatiquement lié dans la vue
        extra_kwargs = {
            'administrateur': {'required': False, 'allow_null': True}
        }