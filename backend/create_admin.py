# backend/create_admin.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from utilisateurs.models import Utilisateur

def create_admin():
    email = 'admin@ujkz.bf'
    username = 'admin'
    password = 'Admin1234!'
    
    if not Utilisateur.objects.filter(email=email).exists():
        Utilisateur.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            nom='Admin',
            prenom='Super',
            role='admin'
        )
        print("✅ Superutilisateur créé avec succès !")
        print(f"   Email : {email}")
        print(f"   Mot de passe : {password}")
    else:
        print("⚠️ Un superutilisateur existe déjà.")

if __name__ == '__main__':
    create_admin()