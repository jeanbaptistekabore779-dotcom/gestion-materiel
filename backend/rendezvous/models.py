from django.db import models

# Create your models here.

from django.conf import settings
from django.core.exceptions import ValidationError

class RendezVous(models.Model):
   
    # Choix des statuts avec des 
    STATUT_CHOICES = [
        ('VALIDE', 'Valider '),
        ('ANNULE', 'Annulé'),
    ]

    # Types de rendez-vous possibles
    TYPE_CHOICES = [
        ('RETRAIT', 'Retrait de matériel'),
        ('RETOUR', 'Retour de matériel'),
    ]

    # 1. RELATIONS INTELLIGENTES ET FLEXIBLES 
    
    administrateur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='rendezvous_administres',
        help_text="L'administrateur qui a fixé ce créneau"
    )

    date_heure = models.DateTimeField(help_text="Date et heure fixées par l'administration")
    type_rdv = models.CharField(max_length=10, choices=TYPE_CHOICES, default='RETRAIT')
    statut = models.CharField(max_length=15, choices=STATUT_CHOICES, default='VALIDE')
    
    def save(self, *args, **kwargs):
        est_nouveau = self.pk is None
        super().save(*args, **kwargs)
        if est_nouveau:
            self.notifier_beneficiaire()

    def notifier_beneficiaire(self):
        # MODIFICATION : On ne peut plus utiliser self.emprunt !
        beneficiaire = "l'utilisateur"
        role = "Bénéficiaire"

        message = f"Votre demande a été validée, passez le {self.date_heure.strftime('%d/%m/%Y')} à {self.date_heure.strftime('%Hh%M')} pour récupérer."
        print(f"[NOTIF SYSTÈME] Envoyé à ({role}) {beneficiaire} : {message}")