from django.db.models.signals import post_save
from django.dispatch import receiver
from emprunts.models import Emprunt
from .models import Notification

@receiver(post_save, sender=Emprunt)
def creer_notification_emprunt(sender, instance, created, **kwargs):
    if created:
        #  Le titre est intégré directement dans le corps du message pour respecter ton modèle
        Notification.objects.create(
            destinataire=instance.utilisateur,  # Assure-toi que le champ s'appelle bien 'utilisateur' dans Emprunt
            emprunt=instance,
            message=f"Nouvel emprunt enregistré : Votre demande pour le matériel '{instance.materiel.designation}' a bien été prise en compte.",
            typeNotification='EMPRUNT'
        )