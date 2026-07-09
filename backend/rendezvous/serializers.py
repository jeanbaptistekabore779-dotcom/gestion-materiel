# rendezvous/serializers.py
from rest_framework import serializers
from .models import Disponibilite, RendezVous


class DisponibiliteSerializer(serializers.ModelSerializer):
    jour_semaine_display = serializers.CharField(source='get_jour_semaine_display', read_only=True)

    class Meta:
        model = Disponibilite
        fields = [
            'id', 'jour_semaine', 'jour_semaine_display',
            'heure_debut', 'heure_fin', 'lieu', 'capacite',
        ]


class RendezVousSerializer(serializers.ModelSerializer):
    utilisateur_details = serializers.SerializerMethodField()
    materiel_nom = serializers.SerializerMethodField()

    class Meta:
        model = RendezVous
        fields = [
            'id', 'emprunt', 'beneficiaire', 'administrateur',
            'disponibilite', 'date_heure', 'lieu', 'type_rdv', 'statut',
            'utilisateur_details', 'materiel_nom',
        ]

    def get_utilisateur_details(self, obj):
        if not obj.beneficiaire:
            return None
        return {
            'id': obj.beneficiaire.id,
            'username': obj.beneficiaire.username,
            'nom': getattr(obj.beneficiaire, 'nom', ''),
            'prenom': getattr(obj.beneficiaire, 'prenom', ''),
            'email': obj.beneficiaire.email,
        }

    def get_materiel_nom(self, obj):
        if obj.emprunt and obj.emprunt.materiel:
            return obj.emprunt.materiel.designation
        return None