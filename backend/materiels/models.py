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
            return f"{self.nom} - Emprunté par {self.detenteur_actuel.username}"
        elif self.etat == 'MAINTENANCE':
            return f"{self.nom} - [EN MAINTENANCE]"
        return f"{self.nom} - Disponible"


# Create your models here.
