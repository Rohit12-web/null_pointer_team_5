from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import classify_image
from .views import (
    GreenActionViewSet, chat_with_ai,
    RegisterView, LoginView, LogoutView, RefreshTokenView,
    MeView, ChangePasswordView, UserActivityView, UserStatsView,
    LeaderboardView, BadgeListView, StatsView
)

router = DefaultRouter()
router.register(r'actions', GreenActionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', chat_with_ai),
    path('classify-image/', classify_image),
    
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='refresh_token'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # User activities
    path('activities/', UserActivityView.as_view(), name='user_activities'),
    path('user/stats/', UserStatsView.as_view(), name='user_stats'),
    
    # Leaderboard
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    
    # Badges
    path('badges/', BadgeListView.as_view(), name='badges'),
    
    # Stats (global)
    path('stats/', StatsView.as_view(), name='stats'),
]