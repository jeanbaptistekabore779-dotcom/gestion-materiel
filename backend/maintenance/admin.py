from django.contrib import admin

# Register your models here.

from .models import Maintenance

# On enregistre les modèles pour qu'ils soit visible dans la BD
admin.site.register(Maintenance)
