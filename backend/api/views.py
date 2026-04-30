from datetime import date

from django.db.models import Count, Q
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Project, Task, TaskComment, User
from .permissions import IsAdminOrAssignedMember, IsAdminRole
from .serializers import (
    CustomTokenObtainPairSerializer,
    MemberCreateSerializer,
    ProjectSerializer,
    SignupSerializer,
    TaskCommentSerializer,
    TaskSerializer,
    UserSummarySerializer,
)


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = SignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSummarySerializer(request.user).data)


class MemberListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(role=User.MEMBER).order_by("full_name", "username")
        if self.request.user.role == User.ADMIN:
            return queryset
        return queryset.filter(id=self.request.user.id)

    def get_serializer_class(self):
        if self.request.user.role == User.ADMIN and self.request.method == "POST":
            return MemberCreateSerializer
        return UserSummarySerializer

    def create(self, request, *args, **kwargs):
        if request.user.role != User.ADMIN:
            return Response(
                {"detail": "Only admins can create members."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Project.objects.select_related("created_by").prefetch_related("members").annotate(
            task_count=Count("tasks")
        )
        if self.request.user.role == User.ADMIN:
            return queryset
        return queryset.filter(Q(members=self.request.user) | Q(created_by=self.request.user)).distinct()

    def create(self, request, *args, **kwargs):
        if request.user.role != User.ADMIN:
            return Response(
                {"detail": "Only admins can create projects."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role != User.ADMIN:
            return Response(
                {"detail": "Only admins can update projects."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != User.ADMIN:
            return Response(
                {"detail": "Only admins can delete projects."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsAdminOrAssignedMember]

    def get_queryset(self):
        base_queryset = (
            Task.objects.select_related("assigned_member", "created_by")
            .prefetch_related("comments__author")
        )
        if self.request.user.role == User.ADMIN:
            return base_queryset
        return base_queryset.filter(assigned_member=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role != User.ADMIN:
            return Response(
                {"detail": "Only admins can create tasks."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        self.check_object_permissions(request, task)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()
        self.check_object_permissions(request, task)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != User.ADMIN:
            return Response(
                {"detail": "Only admins can delete tasks."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        task = self.get_object()
        self.check_object_permissions(request, task)

        if request.method == "GET":
            serializer = TaskCommentSerializer(task.comments.select_related("author"), many=True)
            return Response(serializer.data)

        serializer = TaskCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(task=task, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        tasks = Task.objects.select_related("assigned_member")
        summary = tasks.aggregate(
            total_tasks=Count("id"),
            pending_tasks=Count("id", filter=Q(status=Task.PENDING)),
            in_progress_tasks=Count("id", filter=Q(status=Task.IN_PROGRESS)),
            completed_tasks=Count("id", filter=Q(status=Task.COMPLETED)),
            overdue_tasks=Count(
                "id",
                filter=Q(due_date__lt=date.today()) & ~Q(status=Task.COMPLETED),
            ),
        )
        summary["total_projects"] = Project.objects.count()

        member_stats = (
            User.objects.filter(role=User.MEMBER)
            .annotate(
                total_tasks=Count("assigned_tasks"),
                pending_tasks=Count("assigned_tasks", filter=Q(assigned_tasks__status=Task.PENDING)),
                in_progress_tasks=Count(
                    "assigned_tasks",
                    filter=Q(assigned_tasks__status=Task.IN_PROGRESS),
                ),
                completed_tasks=Count(
                    "assigned_tasks",
                    filter=Q(assigned_tasks__status=Task.COMPLETED),
                ),
            )
            .values(
                "id",
                "username",
                "full_name",
                "employee_id",
                "department",
                "total_tasks",
                "pending_tasks",
                "in_progress_tasks",
                "completed_tasks",
            )
            .order_by("full_name", "username")
        )

        recent_tasks = TaskSerializer(tasks.order_by("-created_at")[:10], many=True, context={"request": request})

        return Response(
            {
                "summary": summary,
                "member_task_overview": list(member_stats),
                "project_overview": ProjectSerializer(
                    Project.objects.select_related("created_by").prefetch_related("members").annotate(
                        task_count=Count("tasks")
                    )[:10],
                    many=True,
                    context={"request": request},
                ).data,
                "recent_tasks": recent_tasks.data,
            }
        )
