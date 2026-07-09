from django.core.management.base import BaseCommand
from django.db import transaction
from materiels.models import Materiel, Exemplaire


class Command(BaseCommand):
    help = (
        "Génère automatiquement un Exemplaire par unité pour chaque Materiel "
        "existant, en se basant sur son champ 'quantite'. "
        "N'ajoute que les exemplaires manquants (sûr à relancer plusieurs fois)."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help="Affiche ce qui serait créé, sans rien enregistrer en base.",
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        total_crees = 0
        total_materiels_traites = 0

        materiels = Materiel.objects.all()

        with transaction.atomic():
            for materiel in materiels:
                nb_existants = materiel.exemplaires.count()
                nb_manquants = materiel.quantite - nb_existants

                if nb_manquants <= 0:
                    continue

                total_materiels_traites += 1
                self.stdout.write(
                    f"→ {materiel.designation} (code {materiel.code_barre}): "
                    f"{nb_existants} exemplaire(s) existant(s), "
                    f"{nb_manquants} à créer"
                )

                for i in range(nb_manquants):
                    numero = nb_existants + i + 1
                    numero_serie = f"{materiel.code_barre}-{numero:03d}"

                    if dry_run:
                        self.stdout.write(f"    [dry-run] créerait: {numero_serie}")
                        continue

                    Exemplaire.objects.create(
                        materiel=materiel,
                        numero_serie=numero_serie,
                        statut=materiel.statut if materiel.statut != 'DISPONIBLE' else 'DISPONIBLE',
                        emplacement_physique=materiel.emplacement_physique,
                        detenteur_actuel=materiel.detenteur_actuel,
                    )
                    total_crees += 1

            if dry_run:
                transaction.set_rollback(True)

        if dry_run:
            self.stdout.write(self.style.WARNING(
                f"\n[DRY-RUN] Aucune modification enregistrée. "
                f"{total_materiels_traites} matériel(s) auraient été traités."
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                f"\n✅ Terminé : {total_crees} exemplaire(s) créé(s) "
                f"pour {total_materiels_traites} matériel(s)."
            ))