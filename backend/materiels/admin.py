from django.contrib import admin

# Register your models here.

from .models import Categorie, Materiel, Exemplaire, Kit, KitExemplaire

# On enregistre les modèles pour qu'ils soit visible dans la BD
admin.site.register(Categorie)
admin.site.register(Materiel)


@admin.register(Exemplaire)
class ExemplaireAdmin(admin.ModelAdmin):
    list_display = ('numero_serie', 'materiel', 'statut', 'detenteur_actuel', 'emplacement_physique')
    list_filter = ('statut', 'materiel')
    search_fields = ('numero_serie', 'materiel__designation', 'materiel__code_barre')


class KitExemplaireInline(admin.TabularInline):
    """Permet d'ajouter/retirer des exemplaires directement depuis la fiche Kit"""
    model = KitExemplaire
    extra = 1


@admin.register(Kit)
class KitAdmin(admin.ModelAdmin):
    list_display = ('nom', 'code_kit', 'statut', 'nb_exemplaires')
    search_fields = ('nom', 'code_kit')
    inlines = [KitExemplaireInline]