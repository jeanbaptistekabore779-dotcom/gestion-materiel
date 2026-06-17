from django.db import models
from django.conf import settings

class Emprunt(models.Model):
    STATUT_CHOICES = [
        ('EN_COURS', 'En cours'),
        ('RETOURNE', 'Retourné'),
        ('EN_RETARD', 'En retard'),
        ('PERDU', 'Perdu / Dégradé'),
    ]

    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, 
        related_name='emprunts',
        verbose_name="Emprunteur"
    )
    
    # 🌟 RELATION CORRIGÉE ET ACTIVÉE :
    materiel = models.ForeignKey(
        'materiels.Materiel', 
        on_delete=models.PROTECT, 
        related_name='historique_emprunts',
        verbose_name="Matériel emprunté"
    )
    
    date_sortie = models.DateTimeField(auto_now_add=True)
    date_retour_prevue = models.DateTimeField(verbose_name="Date de retour prévue")
    date_retour_effective = models.DateTimeField(null=True, blank=True, verbose_name="Date de retour réelle")
    
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='EN_COURS')
    observations = models.TextField(blank=True, null=True, help_text="Notes sur l'état du matériel")

    class Meta:
        verbose_name = "Emprunt"
        verbose_name_plural = "Emprunts"
        ordering = ['-date_sortie']

    def __str__(self):
        # 🌟 On peut maintenant afficher le matériel dans le libellé !
        return f"{self.materiel.designation} emprunté par {self.utilisateur.nom} {self.utilisateur.prenom}"