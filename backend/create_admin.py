# backend/create_admin.py
import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from utilisateurs.models import Utilisateur

def create_admin():
    email = 'admin@ujkz.bf'
    username = 'admin'
    password = 'Admin1234!'
    
    # Vérifier si l'utilisateur existe déjà
    if Utilisateur.objects.filter(email=email).exists():
        print("⚠️ Un superutilisateur existe déjà.")
        return
    
    # Générer un numero_piece unique
    numero_piece = f'ADMIN-{random.randint(10000, 99999)}'
    while Utilisateur.objects.filter(numero_piece=numero_piece).exists():
        numero_piece = f'ADMIN-{random.randint(10000, 99999)}'
    
    # Créer le superutilisateur
    try:
        Utilisateur.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            nom='Admin',
            prenom='Super',
            telephone='+22600000000',
            type_piece='CNIB',
            numero_piece=numero_piece,  # ✅ Valeur unique
            role='ADMIN',
            matricule='ADMIN-001',
            departement='Informatique'
        )
        print("✅ Superutilisateur créé avec succès !")
        print(f"   Email : {email}")
        print(f"   Mot de passe : {password}")
        print(f"   Numéro pièce : {numero_piece}")
    except Exception as e:
        print(f"❌ Erreur lors de la création : {e}")

if __name__ == '__main__':
    create_admin()