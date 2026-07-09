from django.db import models
from django.conf import settings


class Categorie(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nom


class Materiel(models.Model):
    # === STATUTS ===
    STATUT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('EMPRUNTE', 'Emprunté'),
        ('EN_PANNE', 'En panne / Maintenance'),
        ('REFORME', 'Mis au rebut / Archivé'),
    ]

    ETAT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('INDISPONIBLE', 'Indisponible'),
        ('EMPRUNTE', 'Emprunté'),
        ('EN_MAINTENANCE', 'En maintenance'),
    ]

    CATEGORIE_CHOICES = [
        ('ORDINATEUR', 'Ordinateur'),
        ('PROJECTEUR', 'Vidéoprojecteur'),
        ('RESEAU', 'Équipement Réseau (Routeur, Switch)'),
        ('ACCESSOIRE', 'Accessoire (Câble, Adaptateur, Souris)'),
        ('AUTRE', 'Autre'),
    ]

    # === CHAMPS ===
    # Identification
    designation = models.CharField(max_length=150, verbose_name="Nom du matériel")
    code_barre = models.CharField(max_length=100, unique=True, verbose_name="Code barre / Numéro d'inventaire")
    libelle = models.CharField(max_length=150, blank=True, null=True)  # Ancien champ, conservé pour compatibilité

    # Catégorisation
    categorie = models.ForeignKey(Categorie, on_delete=models.PROTECT, related_name='materiels', null=True, blank=True)
    categorie_type = models.CharField(max_length=50, choices=CATEGORIE_CHOICES, default='AUTRE')

    # État et disponibilité
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='DISPONIBLE')
    etat = models.CharField(max_length=20, choices=ETAT_CHOICES, default='DISPONIBLE')
    
    # Localisation
    emplacement_physique = models.CharField(max_length=150, default="Dépôt Central")
    
    # Détenteur actuel (si emprunté)
    detenteur_actuel = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='materiels_empruntes',
        verbose_name="Détenu par"
    )

    # Quantité
    quantite = models.PositiveIntegerField(default=1)
    quantite_disponible = models.PositiveIntegerField(default=1)

    # Caractéristiques techniques
    caracteristiques = models.TextField(blank=True, null=True, help_text="Spécifications techniques (RAM, Stockage, etc.)")
    description = models.TextField(blank=True, null=True)

    # Images
    photo = models.ImageField(upload_to='materiels/', blank=True, null=True)

    # Dates
    date_acquisition = models.DateField(null=True, blank=True, verbose_name="Date d'achat / acquisition")
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Matériel"
        verbose_name_plural = "Matériels"
        ordering = ['designation']

    def __str__(self):
        if self.statut == 'EMPRUNTE' and self.detenteur_actuel:
            return f"{self.designation} - Emprunté par {self.detenteur_actuel.username}"
        elif self.statut == 'EN_PANNE':
            return f"{self.designation} - [EN MAINTENANCE]"
        return f"{self.designation} - {self.statut}"

    @property
    def est_disponible(self):
        """Vérifie si le matériel est disponible à l'emprunt"""
        return self.statut == 'DISPONIBLE' and self.quantite_disponible > 0

    @property
    def est_emprunte(self):
        """Vérifie si le matériel est actuellement emprunté"""
        return self.statut == 'EMPRUNTE'

    @property
    def nb_exemplaires_disponibles(self):
        """Nombre d'exemplaires physiques réellement disponibles pour ce matériel"""
        return self.exemplaires.filter(statut='DISPONIBLE').count()


class Exemplaire(models.Model):
    """
    Unité physique individuelle d'un Materiel.
    Ex: le Materiel "Souris Logitech M100" peut avoir 10 Exemplaires,
    chacun avec son propre numéro de série et son propre statut,
    ce qui permet de savoir EXACTEMENT quel exemplaire est emprunté.
    """
    STATUT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('EMPRUNTE', 'Emprunté'),
        ('EN_PANNE', 'En panne / Maintenance'),
        ('REFORME', 'Mis au rebut / Archivé'),
    ]

    materiel = models.ForeignKey(
        Materiel,
        on_delete=models.CASCADE,
        related_name='exemplaires',
        verbose_name="Modèle de matériel"
    )

    # Identification unique de CET exemplaire précis
    numero_serie = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Numéro de série / Code unique",
        help_text="Ex: MAT-2026-00123"
    )

    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='DISPONIBLE')

    emplacement_physique = models.CharField(max_length=150, blank=True, null=True)

    # Détenteur actuel (si emprunté), indépendant des autres exemplaires du même matériel
    detenteur_actuel = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='exemplaires_empruntes',
        verbose_name="Détenu par"
    )

    qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True)

    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Exemplaire"
        verbose_name_plural = "Exemplaires"
        ordering = ['materiel', 'numero_serie']

    def __str__(self):
        return f"{self.materiel.designation} — {self.numero_serie}"

    @property
    def est_disponible(self):
        """Vérifie si CET exemplaire précis est disponible à l'emprunt"""
        return self.statut == 'DISPONIBLE'


class Kit(models.Model):
    """
    Regroupement de plusieurs Exemplaires empruntables comme un seul ensemble.
    Ex: le Kit "Vidéoprojection Salle A" = 1 vidéoprojecteur + 1 câble HDMI + 1 télécommande.
    """
    STATUT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('EMPRUNTE', 'Emprunté'),
        ('INCOMPLET', 'Incomplet (un exemplaire manquant/en panne)'),
    ]

    nom = models.CharField(max_length=150, verbose_name="Nom du kit")
    code_kit = models.CharField(max_length=100, unique=True, verbose_name="Code du kit")
    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='kits/', blank=True, null=True)

    exemplaires = models.ManyToManyField(
        Exemplaire,
        through='KitExemplaire',
        related_name='kits',
        blank=True
    )

    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='DISPONIBLE')

    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Kit de matériel"
        verbose_name_plural = "Kits de matériel"
        ordering = ['nom']

    def __str__(self):
        return f"{self.nom} ({self.code_kit})"

    @property
    def est_disponible(self):
        """Un kit est disponible seulement si TOUS ses exemplaires le sont"""
        return self.exemplaires.exists() and not self.exemplaires.exclude(statut='DISPONIBLE').exists()

    @property
    def nb_exemplaires(self):
        return self.exemplaires.count()


class KitExemplaire(models.Model):
    """
    Table de liaison explicite entre un Kit et ses Exemplaires.
    Permet d'ajouter/retirer un exemplaire précis d'un kit (ex: remplacer
    un câble HDMI cassé par un autre exemplaire) sans casser le kit.
    """
    kit = models.ForeignKey(Kit, on_delete=models.CASCADE)
    exemplaire = models.ForeignKey(Exemplaire, on_delete=models.CASCADE)
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Composition du kit"
        verbose_name_plural = "Compositions du kit"
        unique_together = ('kit', 'exemplaire')

    def __str__(self):
        return f"{self.exemplaire.numero_serie} dans {self.kit.nom}"