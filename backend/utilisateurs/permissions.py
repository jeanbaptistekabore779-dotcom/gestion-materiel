from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Autorise uniquement les utilisateurs authentifiés dont le rôle est ADMIN.
    """
    message = "Seul un administrateur peut effectuer cette action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'ADMIN'
        )