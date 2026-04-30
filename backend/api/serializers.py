from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Project, Task, TaskComment, User


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "full_name", "employee_id", "email", "department", "phone", "role"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "full_name",
            "employee_id",
            "email",
            "department",
            "phone",
            "role",
        ]

    def validate_role(self, value):
        if value not in {User.ADMIN, User.MEMBER}:
            raise serializers.ValidationError("Role must be admin or member.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class MemberCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(required=True)
    employee_id = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    department = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "full_name",
            "employee_id",
            "email",
            "department",
            "phone",
        ]

    def create(self, validated_data):
        return User.objects.create_user(role=User.MEMBER, **validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSummarySerializer(read_only=True)
    members = UserSummarySerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        source="members",
        write_only=True,
        required=False,
    )
    task_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "created_by",
            "members",
            "member_ids",
            "task_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "task_count", "created_at", "updated_at"]

    def validate_members(self, members):
        return members

    def validate(self, attrs):
        members = attrs.get("members", [])
        invalid_members = [member.username for member in members if member.role != User.MEMBER]
        if invalid_members:
            raise serializers.ValidationError(
                {"member_ids": f"Only member-role users can be added to projects: {', '.join(invalid_members)}"}
            )
        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSummarySerializer(self.user).data
        return data


class TaskCommentSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)

    class Meta:
        model = TaskComment
        fields = ["id", "task", "author", "content", "created_at"]
        read_only_fields = ["id", "task", "author", "created_at"]


class TaskSerializer(serializers.ModelSerializer):
    assigned_member = UserSummarySerializer(read_only=True)
    created_by = UserSummarySerializer(read_only=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    project = ProjectSerializer(read_only=True)
    assigned_member_id = serializers.PrimaryKeyRelatedField(
        source="assigned_member",
        queryset=User.objects.filter(role=User.MEMBER),
        write_only=True,
    )
    project_id = serializers.PrimaryKeyRelatedField(
        source="project",
        queryset=Project.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "priority",
            "status",
            "assigned_member",
            "assigned_member_id",
            "created_by",
            "project",
            "project_id",
            "project_name",
            "remarks",
            "comments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "comments", "created_at", "updated_at"]

    def validate(self, attrs):
        request = self.context["request"]
        if request.user.role == User.MEMBER:
            allowed_fields = {"status"}
            incoming_fields = set(self.initial_data.keys())
            if not incoming_fields.issubset(allowed_fields):
                raise serializers.ValidationError(
                    "Members can only update the task status from their dashboard."
                )

            next_status = attrs.get("status")
            if next_status not in {Task.IN_PROGRESS, Task.COMPLETED}:
                raise serializers.ValidationError(
                    "Members can only move a task to in_progress or completed."
                )
        return attrs
