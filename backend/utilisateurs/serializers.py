from rest_framework import serializers
from .models import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):
    """Serializer standard pour le CRUD avec les champs en français du modèle"""
    identifiant = serializers.CharField(source='username')
    email = serializers.EmailField()

    class Meta:
        model = Utilisateur
        fields = [
            'id', 
            'identifiant', 
            'email', 
            'nom', 
            'prenom', 
            'telephone', 
            'matricule',       # Nouveau champ
            'departement',     # Nouveau champ
            'photo_profil',    # Nouveau champ
            'type_piece', 
            'numero_piece', 
            'role',
            'date_creation',
            'date_modification'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer dédié à l'inscription en français"""
    identifiant = serializers.CharField(source='username', required=True)
    mot_de_passe = serializers.CharField(source='password', write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Utilisateur
        fields = [
            'identifiant', 
            'mot_de_passe', 
            'email', 
            'nom', 
            'prenom', 
            'telephone', 
            'matricule',       # Nouveau champ
            'departement',     # Nouveau champ
            'photo_profil',    # Nouveau champ
            'type_piece', 
            'numero_piece', 
            'role'
        ]

    def create(self, validated_data):
        # Utilisation de create_user pour intégrer proprement les nouveaux champs
        user = Utilisateur.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            nom=validated_data.get('nom', ''),
            prenom=validated_data.get('prenom', ''),
            telephone=validated_data.get('telephone', ''),
            matricule=validated_data.get('matricule', None),        # Ajouté ici
            departement=validated_data.get('departement', ''),      # Ajouté ici
            photo_profil=validated_data.get('photo_profil', None),  # Ajouté ici
            type_piece=validated_data.get('type_piece', 'CNIB'),
            numero_piece=validated_data.get('numero_piece', ''),
            role=validated_data.get('role', 'ETUDIANT')
        )
        return user