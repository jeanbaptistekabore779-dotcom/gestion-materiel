from django.db import models
from django.conf import settings #permet de lier les utilisateur


class Categorie(models.Model):

    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nom

class Materiel(models.Model):
    

    ETAT_CHOICES = [
        ('DISPONIBLE','Disopnible'),
        ('INDISPONIBLE','Indisponible'),
        ('EMPRUNTE','Emprunté'),
        ('EnMaintenance','En maintenance')
    ]
    categorie = models.ForeignKey(Categorie, on_delete=models.PROTECT, related_name='materiels')
    ## ou se trouve le materiel ()
    emplacement_physique = models.CharField(max_length=150, default="Dépôt Central")
    libelle = models.CharField(max_length=150) 

    #LA LOGIQUE : Qui détient l'appareil actuellement ? 
    # Si l'appareil est au dépôt, ce champ sera vide (null=True).
    # Si le rendez-vous d'emprunt est validé, on enregistre l'étudiant/enseignant ici.
    detenteur_actuel = models.ForeignKey(
        settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,blank=True,
        related_name='materiels_empruntes',
        verbose_name="Détenu par"
    )
    etat = models.CharField(max_length=20, choices=ETAT_CHOICES, default='DISPONIBLE')
    quantite = models.PositiveIntegerField(default=1)
    quantite_disponible = models.PositiveIntegerField(default=1)
    date_acquisition = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='materiels/', blank=True, null=True)

    def __str__(self):
        if self.etat == 'EMPRUNTE' and self.detenteur_actuel:
            return f"{self.libelle} - Emprunté par {self.detenteur_actuel.username}"
        elif self.etat == 'MAINTENANCE':
            return f"{self.libelle} - [EN MAINTENANCE]"
        return f"{self.libelle} - Disponible"


class Materiel(models.Model):
    STATUT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('EMPRUNTE', 'Emprunté'),
        ('EN_PANNE', 'En panne / Maintenance'),
        ('REFORME', 'Mis au rebut / Archivé'),
    ]

    CATEGORIE_CHOICES = [
        ('ORDINATEUR', 'Ordinateur'),
        ('PROJECTEUR', 'Vidéoprojecteur'),
        ('RESEAU', 'Équipement Réseau (Routeur, Switch)'),
        ('ACCESSOIRE', 'Accessoire (Câble, Adaptateur, Souris)'),
    ]

    designation = models.CharField(max_length=150, verbose_name="Nom du matériel")
    code_barre = models.CharField(max_length=100, unique=True, verbose_name="Code barre / Numéro d'inventaire")
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES, default='ORDINATEUR')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='DISPONIBLE')
    caracteristiques = models.TextField(blank=True, null=True, help_text="Spécifications techniques (RAM, Stockage, etc.)")
    
    date_acquisition = models.DateField(null=True, blank=True, verbose_name="Date d'achat / acquisition")
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Matériel"
        verbose_name_plural = "Matériels"
        ordering = ['designation']

    def __str__(self):
        return f"{self.designation} ({self.code_barre})"