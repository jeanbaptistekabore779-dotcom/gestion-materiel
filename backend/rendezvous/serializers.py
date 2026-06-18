from rest_framework import serializers
from .models import RendezVous

class RendezVousSerializer(serializers.ModelSerializer):
    class Meta:
        model = RendezVous
       
        fields = ['id', 'date_heure', 'type_rdv', 'statut', 'administrateur']