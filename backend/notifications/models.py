from django.db import models
from django.contrib.auth import get_user_model
from emprunts.models import Emprunt  # Si ton application d'emprunt est bien nommée ainsi

User = get_user_model()

class Notification(models.Model):
    # Correspond à typeNotification dans l'UML
    TYPE_CHOICES = [
        ('INFO', 'Information'),
        ('ALERTE', 'Alerte / Panne'),
        ('EMPRUNT', 'Emprunt / Retour'),
    ]

    # Le destinataire (lié à l'utilisateur connecté pour savoir qui la reçoit)
    destinataire = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    
    # Optionnel : liaison avec l'emprunt concerné comme le montre le diagramme
    emprunt = models.ForeignKey(Emprunt, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    
    # Attributs du diagramme
    message = models.TextField()
    lue = models.BooleanField(default=False, verbose_name="Lue") # lue: boolean
    typeNotification = models.CharField(max_length=20, choices=TYPE_CHOICES, default='INFO')
    dateNotification = models.DateTimeField(auto_now_add=True) # dateNotification

    class Meta:
        ordering = ['-dateNotification']

    def __str__(self):
        return f"Notification {self.id} - {self.typeNotification} ({'Lu' if self.lue else 'Non lu'})"