# historiques/utils.py
from .models import Historique


def enregistrer_historique(user, action, description):
    """
    Enregistre une entrée dans le journal d'audit.
    Accepte une instance Utilisateur authentifiée, une simple chaîne, ou None.

    On privilégie le nom complet (prénom + nom) de la personne pour que
    l'administrateur identifie clairement qui a fait quoi dans les logs,
    plutôt que le seul identifiant technique (username). On capture aussi
    son rôle (Étudiant, Enseignant, Admin, Technicien) pour plus de clarté.
    """
    role_utilisateur = ''

    if user is None:
        nom_utilisateur = "Anonyme"
    elif isinstance(user, str):
        nom_utilisateur = user
    elif getattr(user, 'is_authenticated', False):
        prenom = getattr(user, 'prenom', '') or ''
        nom = getattr(user, 'nom', '') or ''
        nom_complet = f"{prenom} {nom}".strip()
        nom_utilisateur = nom_complet if nom_complet else user.username
        role_utilisateur = getattr(user, 'role', '') or ''
    else:
        nom_utilisateur = "Anonyme"

    Historique.objects.create(
        utilisateur=nom_utilisateur,
        role_utilisateur=role_utilisateur,
        action=action,
        description=description
    )