from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Sécurité : l'utilisateur ne voit que ses propres notifications
        return Notification.objects.filter(destinataire=self.request.user)

    # Correspond à la méthode marquerLue() du diagramme UML
    @action(detail=True, methods=['post'], url_path='marquer-lue')
    def marquer_lue(self, request, pk=None):
        notification = self.get_object()
        notification.lue = True
        notification.save()
        return Response({'status': 'Notification marquee comme lue.'}, status=status.HTTP_200_OK)