from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    # 🌟 Petit bonus : permet d'avoir le libellé propre en lecture seule pour ton Front-end
    type_display = serializers.CharField(source='get_typeNotification_display', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'emprunt', 'message', 'lue', 'typeNotification', 'type_display', 'dateNotification']
        read_only_fields = ['id', 'dateNotification']