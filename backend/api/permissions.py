from rest_framework.permissions import BasePermission

from .models import User


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.ADMIN)


class IsMemberRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.MEMBER)


class IsAdminOrAssignedMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == User.ADMIN:
            return True
        return obj.assigned_member_id == request.user.id
