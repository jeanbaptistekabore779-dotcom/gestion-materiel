from django.db.models.signals import post_save
from django.dispatch import receiver
from emprunts.models import Emprunt
from .models import Notification

@receiver(post_save, sender=Emprunt)
def creer_notification_emprunt(sender, instance, created, **kwargs):
    if created:
        # 1. Notification pour l'utilisateur qui effectue l'emprunt (l'Étudiant ou l'Enseignant)
        Notification.objects.create(
            destinataire=instance.utilisateur,  # Adapte selon le nom du champ User dans ton modèle Emprunt
            emprunt=instance,
            titre="Nouvel emprunt enregistré",
            message=f"Votre demande d'emprunt pour le matériel '{instance.materiel.designation}' a bien été prise en compte.",
            typeNotification='EMPRUNT'
        )