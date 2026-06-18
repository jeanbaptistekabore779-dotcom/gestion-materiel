from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'emprunt', 'message', 'lue', 'typeNotification', 'dateNotification']
        read_only_fields = ['id', 'dateNotification']