from django.contrib import admin

# Register your models here.

from .models import Categorie, Materiel

# On enregistre les modèles pour qu'ils soient visibles dans le back-office
admin.site.register(Categorie)
admin.site.register(Materiel)