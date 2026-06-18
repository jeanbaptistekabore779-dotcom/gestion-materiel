from django.shortcuts import render
from django.db import models
from rest_framework import viewsets, permissions
from .models import RendezVous
from .serializers import RendezVousSerializer

class RendezVousViewSet(viewsets.ModelViewSet):
    
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousSerializer
    # Sécurité : Seul un utilisateur connecté peut interagir avec cette API
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Si c'est un membre de l'administration (staff), il voit tous les rendez-vous
        if user.is_staff:
            return RendezVous.objects.all()
        
        # Si c'est un bénéficiaire (étudiant ou enseignant), il ne voit que SES rendez-vous
        # On filtre en fonction des deux colonnes de la table Emprunt
        return RendezVous.objects.filter(
            models.Q(emprunt__etudiant=user) | models.Q(emprunt__enseignant=user)
        ).distinct()

    def perform_create(self, serializer):
        # Quand l'administration crée un rendez-vous, le système enregistre automatiquement 
        # quel administrateur connecté a fixé ce créneau.
        if self.request.user.is_staff:
            serializer.save(administrateur=self.request.user)
        else:
            serializer.save()
# Create your views here.
