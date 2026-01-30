from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Badge, UserBadge, GreenAction, UserActivity, RefreshToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'total_points', 'total_co2_saved', 'current_streak', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'name', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'username', 'avatar', 'bio', 'location')}),
        ('Eco Stats', {'fields': ('total_points', 'total_co2_saved', 'activities_count', 'current_streak', 'longest_streak')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Settings', {'fields': ('email_notifications', 'public_profile')}),
        ('Dates', {'fields': ('last_login', 'date_joined', 'last_activity')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'name', 'password1', 'password2'),
        }),
    )


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'points_required', 'icon')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    list_filter = ('badge', 'earned_at')
    search_fields = ('user__email', 'badge__name')


@admin.register(GreenAction)
class GreenActionAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'points_per_unit', 'co2_per_unit', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_name', 'quantity', 'points_earned', 'co2_saved', 'activity_date')
    list_filter = ('activity_type', 'activity_date')
    search_fields = ('user__email', 'activity_name', 'notes')
    date_hierarchy = 'activity_date'


@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at', 'is_revoked')
    list_filter = ('is_revoked', 'created_at')
    search_fields = ('user__email', 'token')
