from django.db import models

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