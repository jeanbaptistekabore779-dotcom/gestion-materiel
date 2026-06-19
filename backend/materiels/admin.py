from django.contrib import admin

# Register your models here.

from .models import Categorie, Materiel

# On enregistre les modèles pour qu'ils soit visible dans la BD
admin.site.register(Categorie)
admin.site.register(Materiel)