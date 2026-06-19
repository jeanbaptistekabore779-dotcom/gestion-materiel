from django.db import models
from materiels.models import Materiel  # Importation du modèle Materiel existant


STATUT_CHOICES = [
    ('EN_COURS', 'En cours'),
    ('TERMINE', 'Terminé'),
    ('ANNULE', 'Annulé'),
]

class CategorieMaintenance(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    dureEstimer = models.IntegerField(help_text="Durée estimée en jours")

    def __str__(self):
        return self.nom


class Maintenance(models.Model):
    dateDebut = models.DateField()
    dateFin = models.DateField(blank=True, null=True)  # Optionnel au début
    description = models.TextField()
    statut = models.CharField( max_length=20,choices=STATUT_CHOICES,default='EN_COURS'
    )
    
    # Relationsentre materiel et maintenance
    materiel = models.ForeignKey( Materiel, on_delete=models.CASCADE, related_name='maintenances')

    # Relation entre categorie_maintenance et maintenance
    categorie_maintenance = models.ForeignKey(CategorieMaintenance, on_delete=models.PROTECT,  related_name='maintenances' )

    def __str__(self):
        return f"Maintenance {self.id} - {self.materiel.libelle} ({self.get_statut_display()})"
    
    #Relation entre technicien et maintenance a ajouté
# Create your models here.
