from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CategorieMaintenance, Maintenance

User = get_user_model()


class CategorieMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategorieMaintenance
        fields = '__all__'


class TechnicienMiniSerializer(serializers.ModelSerializer):
    """Représentation légère du technicien pour l'affichage dans les fiches maintenance."""
    class Meta:
        model = User
        fields = ['id', 'username', 'nom', 'prenom']


class MaintenanceSerializer(serializers.ModelSerializer):
    # permet d'avoir les détails textuels de la catégorie et du matériel dans les réponses GET
    categorie_maintenance_details = CategorieMaintenanceSerializer(source='categorie_maintenance', read_only=True)
    technicien_details = TechnicienMiniSerializer(source='technicien', read_only=True)

    class Meta:
        model = Maintenance
        fields = [
            'id', 'dateDebut', 'dateFin', 'description',
            'statut', 'materiel', 'categorie_maintenance', 'categorie_maintenance_details',
            'technicien', 'technicien_details',
        ]