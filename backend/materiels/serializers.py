from rest_framework import serializers
from .models import Categorie, Materiel


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'


class MaterielSerializer(serializers.ModelSerializer):
    # ✅ On laisse DRF gérer 'photo' nativement (ImageField hérité du modèle).
    # DRF construit déjà automatiquement l'URL absolue (http://127.0.0.1:8000/media/...)
    # tant que le serializer a accès à la requête dans son contexte — ce qui est le cas
    # par défaut avec ModelViewSet. Le SerializerMethodField précédent rendait le champ
    # en LECTURE SEULE, ce qui empêchait tout upload de photo de fonctionner.

    class Meta:
        model = Materiel
        fields = '__all__'