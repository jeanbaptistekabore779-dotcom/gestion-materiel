from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
            'matricule',
            'departement',
            'photo_profil',
            'type_piece',
            'numero_piece',
            'role',
            'date_creation',
            'date_modification'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer dédié à l'inscription en français"""
    identifiant  = serializers.CharField(source='username', required=True)
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
            'matricule',
            'departement',
            'photo_profil',
            'type_piece',
            'numero_piece',
            'role'
        ]

    def create(self, validated_data):
        user = Utilisateur.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            nom=validated_data.get('nom', ''),
            prenom=validated_data.get('prenom', ''),
            telephone=validated_data.get('telephone', ''),
            matricule=validated_data.get('matricule', None),
            departement=validated_data.get('departement', ''),
            photo_profil=validated_data.get('photo_profil', None),
            type_piece=validated_data.get('type_piece', 'CNIB'),
            numero_piece=validated_data.get('numero_piece', ''),
            role=validated_data.get('role', 'ETUDIANT')
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Ajoute le rôle et les infos utilisateur dans le token JWT"""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Champs custom injectés dans le payload JWT
        token['role']     = user.role      or 'ETUDIANT'
        token['username'] = user.username  or ''
        token['prenom']   = user.prenom    or ''
        token['nom']      = user.nom       or ''
        token['email']    = user.email     or ''
        return token