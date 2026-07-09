# rendezvous/services.py
"""
Logique d'attribution automatique des rendez-vous sur les créneaux
hebdomadaires définis par l'administrateur (Disponibilite).
"""
from datetime import datetime, timedelta
from django.utils import timezone

from .models import Disponibilite, RendezVous

# Correspondance jour de la semaine Python (0=Lundi ... 6=Dimanche) -> code Disponibilite
JOURS_PYTHON = {
    0: 'LUNDI',
    1: 'MARDI',
    2: 'MERCREDI',
    3: 'JEUDI',
    4: 'VENDREDI',
    5: 'SAMEDI',
    6: None,  # Dimanche : pas de créneaux
}

NB_JOURS_RECHERCHE = 60  # horizon de recherche du prochain créneau libre


class AucunCreneauDisponible(Exception):
    """Levée quand aucun créneau libre n'a été trouvé dans l'horizon de recherche."""
    pass


def trouver_prochain_creneau():
    """
    Parcourt les prochains jours et retourne le premier (date_heure, disponibilite)
    dont la capacité n'est pas encore atteinte.

    Retourne un tuple (date_heure: datetime aware, disponibilite: Disponibilite).
    Lève AucunCreneauDisponible si rien n'est trouvé.
    """
    creneaux = list(Disponibilite.objects.all().order_by('jour_semaine', 'heure_debut'))
    if not creneaux:
        raise AucunCreneauDisponible(
            "Aucun créneau hebdomadaire n'a été configuré. "
            "Rendez-vous dans Planification des Rendez-vous pour en ajouter."
        )

    aujourdhui = timezone.localdate()
    maintenant = timezone.now()

    for offset in range(NB_JOURS_RECHERCHE):
        jour_candidat = aujourdhui + timedelta(days=offset)
        code_jour = JOURS_PYTHON.get(jour_candidat.weekday())
        if not code_jour:
            continue  # dimanche

        creneaux_du_jour = [c for c in creneaux if c.jour_semaine == code_jour]

        for creneau in creneaux_du_jour:
            date_heure_candidate = timezone.make_aware(
                datetime.combine(jour_candidat, creneau.heure_debut)
            )

            # On ignore les créneaux déjà passés (utile pour le jour même)
            if date_heure_candidate <= maintenant:
                continue

            nb_deja_pris = RendezVous.objects.filter(
                date_heure=date_heure_candidate,
                statut='VALIDE',
            ).count()

            if nb_deja_pris < creneau.capacite:
                return date_heure_candidate, creneau

    raise AucunCreneauDisponible(
        f"Aucun créneau libre dans les {NB_JOURS_RECHERCHE} prochains jours. "
        "Ajoutez des créneaux supplémentaires."
    )


def creer_rendezvous_automatique(emprunt, administrateur, type_rdv='RETRAIT'):
    """
    Trouve le prochain créneau libre et crée le RendezVous correspondant.
    Lève AucunCreneauDisponible si aucun créneau n'est libre.
    """
    date_heure, creneau = trouver_prochain_creneau()

    return RendezVous.objects.create(
        emprunt=emprunt,
        beneficiaire=emprunt.utilisateur,
        administrateur=administrateur,
        disponibilite=creneau,
        date_heure=date_heure,
        lieu=creneau.lieu,
        type_rdv=type_rdv,
        statut='VALIDE',
    )