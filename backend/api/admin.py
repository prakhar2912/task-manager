from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Project, Task, TaskComment, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Employee Details",
            {
                "fields": (
                    "full_name",
                    "employee_id",
                    "department",
                    "phone",
                    "role",
                )
            },
        ),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Employee Details",
            {
                "fields": (
                    "full_name",
                    "employee_id",
                    "email",
                    "department",
                    "phone",
                    "role",
                )
            },
        ),
    )
    list_display = ("username", "full_name", "employee_id", "email", "role", "is_staff")
    search_fields = ("username", "full_name", "employee_id", "email")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "created_by", "created_at")
    search_fields = ("name", "description", "created_by__username")
    filter_horizontal = ("members",)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "assigned_member", "status", "priority", "due_date", "created_by")
    list_filter = ("status", "priority", "due_date")
    search_fields = ("title", "description", "project_name", "assigned_member__username")


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ("task", "author", "created_at")
    search_fields = ("task__title", "author__username", "content")
