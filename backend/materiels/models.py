from django.db import models
from django.conf import settings


class Categorie(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nom


class Materiel(models.Model):
    # === STATUTS ===
    STATUT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('EMPRUNTE', 'Emprunté'),
        ('EN_PANNE', 'En panne / Maintenance'),
        ('REFORME', 'Mis au rebut / Archivé'),
    ]

    ETAT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('INDISPONIBLE', 'Indisponible'),
        ('EMPRUNTE', 'Emprunté'),
        ('EN_MAINTENANCE', 'En maintenance'),
    ]

    CATEGORIE_CHOICES = [
        ('ORDINATEUR', 'Ordinateur'),
        ('PROJECTEUR', 'Vidéoprojecteur'),
        ('RESEAU', 'Équipement Réseau (Routeur, Switch)'),
        ('ACCESSOIRE', 'Accessoire (Câble, Adaptateur, Souris)'),
        ('AUTRE', 'Autre'),
    ]

    # === CHAMPS ===
    # Identification
    designation = models.CharField(max_length=150, verbose_name="Nom du matériel")
    code_barre = models.CharField(max_length=100, unique=True, verbose_name="Code barre / Numéro d'inventaire")
    libelle = models.CharField(max_length=150, blank=True, null=True)  # Ancien champ, conservé pour compatibilité

    # Catégorisation
    categorie = models.ForeignKey(Categorie, on_delete=models.PROTECT, related_name='materiels', null=True, blank=True)
    categorie_type = models.CharField(max_length=50, choices=CATEGORIE_CHOICES, default='AUTRE')

    # État et disponibilité
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='DISPONIBLE')
    etat = models.CharField(max_length=20, choices=ETAT_CHOICES, default='DISPONIBLE')
    
    # Localisation
    emplacement_physique = models.CharField(max_length=150, default="Dépôt Central")
    
    # Détenteur actuel (si emprunté)
    detenteur_actuel = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='materiels_empruntes',
        verbose_name="Détenu par"
    )

    # Quantité
    quantite = models.PositiveIntegerField(default=1)
    quantite_disponible = models.PositiveIntegerField(default=1)

    # Caractéristiques techniques
    caracteristiques = models.TextField(blank=True, null=True, help_text="Spécifications techniques (RAM, Stockage, etc.)")
    description = models.TextField(blank=True, null=True)

    # Images
    photo = models.ImageField(upload_to='materiels/', blank=True, null=True)

    # Dates
    date_acquisition = models.DateField(null=True, blank=True, verbose_name="Date d'achat / acquisition")
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Matériel"
        verbose_name_plural = "Matériels"
        ordering = ['designation']

    def __str__(self):
        if self.statut == 'EMPRUNTE' and self.detenteur_actuel:
            return f"{self.designation} - Emprunté par {self.detenteur_actuel.username}"
        elif self.statut == 'EN_PANNE':
            return f"{self.designation} - [EN MAINTENANCE]"
        return f"{self.designation} - {self.statut}"

    @property
    def est_disponible(self):
        """Vérifie si le matériel est disponible à l'emprunt"""
        return self.statut == 'DISPONIBLE' and self.quantite_disponible > 0

    @property
    def est_emprunte(self):
        """Vérifie si le matériel est actuellement emprunté"""
        return self.statut == 'EMPRUNTE'