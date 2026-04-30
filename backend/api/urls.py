from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminDashboardView,
    CurrentUserView,
    LoginView,
    MemberListCreateView,
    ProjectViewSet,
    TaskViewSet,
    signup_view,
)


router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("auth/signup/", signup_view, name="signup"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
    path("members/", MemberListCreateView.as_view(), name="member-list-create"),
    path("dashboard/admin/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("", include(router.urls)),
]
