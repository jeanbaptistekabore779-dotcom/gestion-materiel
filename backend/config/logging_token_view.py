from rest_framework_simplejwt.views import TokenObtainPairView
from historiques.utils import enregistrer_historique
from utilisateurs.serializers import CustomTokenObtainPairSerializer


class LoggingTokenObtainPairView(TokenObtainPairView):
    """Identique à TokenObtainPairView, mais journalise chaque connexion réussie."""
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = request.data.get('username', 'Inconnu')
            enregistrer_historique(
                username,
                'CONNEXION',
                f'Connexion réussie pour "{username}".',
            )
        return response