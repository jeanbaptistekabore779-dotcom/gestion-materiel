# maintenance/models.py
from django.db import models
from django.conf import settings
from materiels.models import Materiel

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
    dateFin = models.DateField(blank=True, null=True)
    description = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='EN_COURS')

    materiel = models.ForeignKey(Materiel, on_delete=models.CASCADE, related_name='maintenances')
    categorie_maintenance = models.ForeignKey(CategorieMaintenance, on_delete=models.PROTECT, related_name='maintenances')

    # ✅ NOUVEAU : relation technicien
    technicien = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='maintenances_assignees',
        limit_choices_to={'role': 'TECHNICIEN'}
    )

    def __str__(self):
        return f"Maintenance {self.id} - {self.materiel.libelle} ({self.get_statut_display()})"