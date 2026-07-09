from django.db import models
from django.conf import settings


class Emprunt(models.Model):
    STATUT_CHOICES = [
        ('EN_ATTENTE',     'En attente'),
        ('APPROUVE',       'Approuvé'),
        ('EN_COURS',       'En cours'),
        ('RETOUR_DECLARE', 'Retour déclaré'),
        ('RETOURNE',       'Retourné'),
        ('EN_RETARD',      'En retard'),
        ('PERDU',          'Perdu / Dégradé'),
        ('REFUSE',         'Refusé'),
    ]

    class EtatRetour(models.TextChoices):
        BON_ETAT     = "BON_ETAT", "Bon état"
        ENDOMMAGE    = "ENDOMMAGE", "Endommagé"
        HORS_SERVICE = "HORS_SERVICE", "Hors service"
        INCOMPLET    = "INCOMPLET", "Incomplet"

    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='emprunts',
        verbose_name="Emprunteur"
    )

    materiel = models.ForeignKey(
        'materiels.Materiel',
        on_delete=models.PROTECT,
        related_name='historique_emprunts',
        verbose_name="Matériel emprunté",
        null=True,
        blank=True
    )

    date_sortie           = models.DateTimeField(auto_now_add=True)
    date_retour_prevue    = models.DateTimeField(verbose_name="Date de retour prévue")
    date_retour_declare   = models.DateTimeField(null=True, blank=True, verbose_name="Date de déclaration du retour")
    date_retour_effective = models.DateTimeField(null=True, blank=True, verbose_name="Date de retour réelle")

    statut       = models.CharField(max_length=20, choices=STATUT_CHOICES, default='EN_ATTENTE')
    etat_retour  = models.CharField(
        max_length=20,
        choices=EtatRetour.choices,
        null=True,
        blank=True,
        verbose_name="État du matériel au retour"
    )
    observations = models.TextField(blank=True, null=True, help_text="Notes sur l'état du matériel")

    class Meta:
        verbose_name        = "Emprunt"
        verbose_name_plural = "Emprunts"
        ordering            = ['-date_sortie']

    def __str__(self):
        designation_materiel = self.materiel.designation if self.materiel else "Matériel inconnu"
        return f"{designation_materiel} emprunté par {self.utilisateur.nom} {self.utilisateur.prenom}"