# rendezvous/models.py
from django.db import models
from django.conf import settings
from notifications.models import Notification


class Disponibilite(models.Model):
    """Créneau hebdomadaire récurrent défini par l'administrateur.
    Les rendez-vous sont attribués automatiquement dessus."""

    JOURS = [
        ('LUNDI', 'Lundi'),
        ('MARDI', 'Mardi'),
        ('MERCREDI', 'Mercredi'),
        ('JEUDI', 'Jeudi'),
        ('VENDREDI', 'Vendredi'),
        ('SAMEDI', 'Samedi'),
    ]

    jour_semaine = models.CharField(max_length=10, choices=JOURS)
    heure_debut  = models.TimeField()
    heure_fin    = models.TimeField()
    lieu         = models.CharField(max_length=200, default='Magasin Central UFR/SEA')
    capacite     = models.PositiveIntegerField(default=1, help_text="Nombre de RDV max sur ce créneau")

    class Meta:
        ordering = ['jour_semaine', 'heure_debut']
        verbose_name = 'Créneau de disponibilité'
        verbose_name_plural = 'Créneaux de disponibilité'

    def __str__(self):
        return f"{self.get_jour_semaine_display()} {self.heure_debut}–{self.heure_fin} ({self.lieu})"


class RendezVous(models.Model):

    STATUT_CHOICES = [
        ('VALIDE', 'Validé'),
        ('ANNULE', 'Annulé'),
    ]

    TYPE_CHOICES = [
        ('RETRAIT', 'Retrait de matériel'),
        ('RETOUR', 'Retour de matériel'),
    ]

    # Lien avec l'emprunt concerné
    emprunt = models.ForeignKey(
        'emprunts.Emprunt',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='rendezvous',
        help_text="La demande d'emprunt liée à ce rendez-vous"
    )

    # L'utilisateur qui doit venir récupérer/retourner
    beneficiaire = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='mes_rendezvous',
        help_text="L'utilisateur convoqué"
    )

    # L'admin qui a validé la demande (le créneau, lui, est choisi automatiquement)
    administrateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='rendezvous_administres',
        help_text="L'administrateur qui a validé la demande"
    )

    # Référence au créneau hebdomadaire utilisé pour l'attribution automatique
    disponibilite = models.ForeignKey(
        Disponibilite,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='rendezvous',
        help_text="Le créneau hebdomadaire sur lequel ce RDV a été attribué"
    )

    date_heure = models.DateTimeField(help_text="Date et heure attribuées automatiquement")
    lieu       = models.CharField(max_length=200, default='Magasin Central UFR/SEA')
    type_rdv   = models.CharField(max_length=10, choices=TYPE_CHOICES, default='RETRAIT')
    statut     = models.CharField(max_length=15, choices=STATUT_CHOICES, default='VALIDE')

    class Meta:
        ordering = ['-date_heure']
        verbose_name = 'Rendez-vous'
        verbose_name_plural = 'Rendez-vous'

    def __str__(self):
        return f"RDV {self.type_rdv} — {self.date_heure.strftime('%d/%m/%Y à %Hh%M')}"

    def save(self, *args, **kwargs):
        est_nouveau = self.pk is None
        super().save(*args, **kwargs)
        if est_nouveau:
            self.notifier_beneficiaire()

    def notifier_beneficiaire(self):
        """Crée une notification en base pour le bénéficiaire."""
        if not self.beneficiaire:
            return

        type_label = dict(self.TYPE_CHOICES).get(self.type_rdv, self.type_rdv)
        materiel = self.emprunt.materiel if self.emprunt else 'votre matériel'

        Notification.objects.create(
            destinataire=self.beneficiaire,
            emprunt=self.emprunt,
            typeNotification='EMPRUNT',
            message=(
                f'Votre demande pour "{materiel}" a été approuvée. '
                f'Rendez-vous le {self.date_heure.strftime("%d/%m/%Y")} '
                f'à {self.date_heure.strftime("%Hh%M")} — {self.lieu} '
                f'pour le {type_label.lower()}.'
            ),
            lue=False,
        )