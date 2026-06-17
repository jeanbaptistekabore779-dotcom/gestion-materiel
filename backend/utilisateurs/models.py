from django.contrib.auth.models import AbstractUser
from django.db import models

class Utilisateur(AbstractUser):

    ROLE_CHOICES = [
        ('ADMIN', 'Administrateur'),
        ('ENSEIGNANT', 'Enseignant'),
        ('ETUDIANT', 'Étudiant'),
        ('TECHNICIEN', 'Technicien'),
    ]

    TYPE_PIECE_CHOICES = [
        ('CNIB', 'CNIB'),
        ('PASSEPORT', 'Passeport'),
    ]

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)

    type_piece = models.CharField(
        max_length=20,
        choices=TYPE_PIECE_CHOICES
    )

    numero_piece = models.CharField(
        max_length=50,
        unique=True
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='ETUDIANT'
    )

    # 🌟 NOUVEAUX CHAMPS AJOUTÉS ICI
    matricule = models.CharField(max_length=30, unique=True, null=True, blank=True)
    departement = models.CharField(max_length=100, blank=True, default='')
    photo_profil = models.ImageField(upload_to='profils/', null=True, blank=True)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"