# historiques/utils.py
from .models import Historique

def enregistrer_historique(user, action, description):
    # Si l'utilisateur est authentifié, on récupère son nom, sinon "Anonyme"
    nom_utilisateur = user.username if user.is_authenticated else "Anonyme"
    Historique.objects.create(
        utilisateur=nom_utilisateur,
        action=action,
        description=description
    )