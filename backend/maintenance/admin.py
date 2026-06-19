from django.contrib import admin

# Register your models here.

from .models import Maintenance, CategorieMaintenance

# On enregistre les modèles pour qu'ils soit visible dans la BD
admin.site.register(Maintenance)
admin.site.register(CategorieMaintenance)