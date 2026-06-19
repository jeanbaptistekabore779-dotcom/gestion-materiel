
from rest_framework import viewsets, permissions
from .models import Materiel
from .serializers import MaterielSerializer

class MaterielViewSet(viewsets.ModelViewSet):
    queryset = Materiel.objects.all()
    serializer_class = MaterielSerializer
    permission_classes = [permissions.IsAuthenticated]

from rest_framework import viewsets
from .models import Categorie, Materiel
from .serializers import CategorieSerializer, MaterielSerializer
from historiques.utils import enregistrer_historique

##pour le crud de chaque classe nous avons utilisé Viewset qui gere
#  automatiquement l'ensemble des crud effectué sur une classe cest a dire

  #  Il utilise les requêtes HTTP (GET, POST, PUT, DELETE) envoyées par le frontend
   # ou Postman pour manipuler les équipements en base de données.


# CONTROLEUR POUR LES CATEGORIES 

class CategorieViewSet(viewsets.ModelViewSet):
    
    # 1. Source des données : On indique à Django d'aller chercher toutes les lignes de la table Categorie
    queryset = Categorie.objects.all()
    
    # 2. Traducteur : On lui donne le moule à utiliser pour transformer ces données SQL en JSON (et inversement)
    serializer_class = CategorieSerializer



# CONTROLEUR POUR LES MATERIELS 
class MaterielViewSet(viewsets.ModelViewSet):
   
    # 1. Source des données : On indique à Django d'aller chercher tous les matériels enregistrés
    queryset = Materiel.objects.all()
    
    # traducteur des donnee sql en json
    serializer_class = MaterielSerializer

    def perform_create(self, serializer):
        # On sauvegarde le matériel
        instance = serializer.save()
        # On enregistre l'historique
        enregistrer_historique(
            self.request.user, 
            'CREATION', 
            f"Matériel '{instance.libelle}' créé."
        )

    def perform_update(self, serializer):
        # On sauvegarde les modifications
        instance = serializer.save()
        # On enregistre l'historique
        enregistrer_historique(
            self.request.user, 
            'MODIFICATION', 
            f"Matériel '{instance.libelle}' modifié."
        )

    def perform_destroy(self, instance):
        # On garde une trace avant de supprimer
        libelle = instance.libelle
        instance.delete()
        enregistrer_historique(
            self.request.user, 
            'SUPPRESSION', 
            f"Matériel '{libelle}' supprimé."
        )

