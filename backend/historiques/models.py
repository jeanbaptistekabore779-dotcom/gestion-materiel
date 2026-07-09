# historiques/models.py

from django.db import models


class Historique(models.Model):

    ACTION_CHOICES = [
        ('CREATION', 'Création'),
        ('MODIFICATION', 'Modification'),
        ('SUPPRESSION', 'Suppression'),
        ('EMPRUNT', 'Emprunt'),
        ('RETOUR', 'Retour'),
        ('MAINTENANCE', 'Maintenance'),
        ('RENDEZVOUS', 'Rendez-vous'),
        ('VALIDATION', 'Validation'),
        ('REJET', 'Rejet'),
    ]

    utilisateur = models.CharField(max_length=150)
    role_utilisateur = models.CharField(max_length=20, blank=True, default='')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    description = models.TextField()
    date_action = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_action']

    def __str__(self):
        return f"{self.utilisateur} - {self.action}"