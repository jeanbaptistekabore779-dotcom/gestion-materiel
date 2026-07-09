from django.contrib.auth.models import AbstractUser
from django.db import models


# La classe Utilisateur hérite de AbstractUser pour bénéficier des fonctionnalités
# d'authentification de Django tout en ajoutant des champs personnalisés spécifiques à notre application.
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

    STATUT_CHOICES = [
        ('ACTIF', 'Actif'),
        ('SUSPENDU', 'Suspendu'),
        ('SIGNALE', 'Signalé'),
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

    statut = models.CharField(
        max_length=10,
        choices=STATUT_CHOICES,
        default='ACTIF',
        help_text="Utilisé pour la suspension ou le signalement d'un compte."
    )

    # Nouveaux champs pour enrichir le profil de l'utilisateur
    matricule = models.CharField(max_length=30, unique=True, null=True, blank=True)
    departement = models.CharField(max_length=100, blank=True, default='')
    photo_profil = models.ImageField(upload_to='profils/', null=True, blank=True)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"