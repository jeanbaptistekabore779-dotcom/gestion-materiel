from rest_framework import serializers
from .models import CategorieMaintenance, Maintenance

class CategorieMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategorieMaintenance
        fields = '__all__' 


class MaintenanceSerializer(serializers.ModelSerializer):
    # permet d'avoir les détails textuels de la catégorie et du matériel dans les réponses GET
    categorie_maintenance_details = CategorieMaintenanceSerializer(source='categorie_maintenance', read_only=True)
    
    class Meta:
        model = Maintenance
        fields = [
            'id', 'dateDebut', 'dateFin', 'description', 
            'statut', 'materiel', 'categorie_maintenance', 'categorie_maintenance_details'
        ]