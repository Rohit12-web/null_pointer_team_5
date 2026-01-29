import os
import jwt
import uuid
import requests
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from django.conf import settings
from django.utils import timezone
from django.db.models import F, Window
from django.db.models.functions import RowNumber
from dotenv import load_dotenv
from .models import GreenAction, User, Badge, UserBadge, UserActivity, RefreshToken
from .serializers import (
    GreenActionSerializer, UserSerializer, RegisterSerializer, LoginSerializer,
    TokenSerializer, RefreshTokenSerializer, ChangePasswordSerializer,
    UserProfileUpdateSerializer, UserActivitySerializer, UserActivityCreateSerializer,
    LeaderboardSerializer, BadgeSerializer, UserStatsSerializer
)

# Load environment variables
load_dotenv()

# JWT Settings
JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour
REFRESH_TOKEN_EXPIRE_DAYS = 7


def generate_tokens(user):
    """Generate access and refresh tokens for a user"""
    # Access token
    access_payload = {
        'user_id': str(user.id),
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    # Refresh token
    refresh_token_str = str(uuid.uuid4())
    RefreshToken.objects.create(
        user=user,
        token=refresh_token_str,
        expires_at=timezone.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    return access_token, refresh_token_str


def verify_token(token):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


class JWTAuthentication:
    """Custom JWT Authentication"""
    @staticmethod
    def get_user_from_request(request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header[7:]
        payload = verify_token(token)
        if not payload or payload.get('type') != 'access':
            return None
        
        try:
            user = User.objects.get(id=payload['user_id'])
            return user
        except User.DoesNotExist:
            return None


class GreenActionViewSet(viewsets.ModelViewSet):
    queryset = GreenAction.objects.all()
    serializer_class = GreenActionSerializer


# ============ Authentication Views ============

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens
            access_token, refresh_token = generate_tokens(user)
            
            # Award first badge
            try:
                first_steps_badge = Badge.objects.get(slug='first_steps')
                UserBadge.objects.create(user=user, badge=first_steps_badge)
            except Badge.DoesNotExist:
                pass
            
            user_data = UserSerializer(user).data
            
            return Response({
                'success': True,
                'message': 'Account created successfully!',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'Bearer',
                'expires_in': ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate tokens
            access_token, refresh_token = generate_tokens(user)
            
            # Update last login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            user_data = UserSerializer(user).data
            
            return Response({
                'success': True,
                'message': 'Login successful!',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'Bearer',
                'expires_in': ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                'user': user_data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken.objects.get(token=refresh_token)
                token.is_revoked = True
                token.save()
            except RefreshToken.DoesNotExist:
                pass
        
        return Response({
            'success': True,
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)
        if serializer.is_valid():
            refresh_token_str = serializer.validated_data['refresh_token']
            
            try:
                refresh_token = RefreshToken.objects.get(token=refresh_token_str)
                
                if not refresh_token.is_valid():
                    return Response({
                        'success': False,
                        'error': 'Refresh token expired or revoked'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Revoke old refresh token
                refresh_token.is_revoked = True
                refresh_token.save()
                
                # Generate new tokens
                access_token, new_refresh_token = generate_tokens(refresh_token.user)
                
                return Response({
                    'success': True,
                    'access_token': access_token,
                    'refresh_token': new_refresh_token,
                    'token_type': 'Bearer',
                    'expires_in': ACCESS_TOKEN_EXPIRE_MINUTES * 60
                }, status=status.HTTP_200_OK)
                
            except RefreshToken.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Invalid refresh token'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        user = JWTAuthentication.get_user_from_request(request)
        if not user:
            return Response({
                'success': False,
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = UserSerializer(user)
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request):
        user = JWTAuthentication.get_user_from_request(request)
        if not user:
            return Response({
                'success': False,
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = JWTAuthentication.get_user_from_request(request)
        if not user:
            return Response({
                'success': False,
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({
                    'success': False,
                    'error': 'Current password is incorrect'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Revoke all refresh tokens
            RefreshToken.objects.filter(user=user).update(is_revoked=True)
            
            return Response({
                'success': True,
                'message': 'Password changed successfully. Please login again.'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# ============ Activity Views ============

class UserActivityView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        user = JWTAuthentication.get_user_from_request(request)
        if not user:
            return Response({
                'success': False,
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        activities = UserActivity.objects.filter(user=user).select_related('action')[:50]
        serializer = UserActivitySerializer(activities, many=True)
        return Response({
            'success': True,
            'activities': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        user = JWTAuthentication.get_user_from_request(request)
        if not user:
            return Response({
                'success': False,
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = UserActivityCreateSerializer(data=request.data, context={'request_user': user})
        if serializer.is_valid():
            activity = serializer.save()
            
            # Refresh user from DB to get updated stats
            user.refresh_from_db()
            
            return Response({
                'success': True,
                'message': 'Activity logged successfully!',
                'activity': UserActivitySerializer(activity).data,
                'user_stats': {
                    'total_points': user.total_points,
                    'total_co2_saved': round(user.total_co2_saved, 2),
                    'activities_count': user.activities_count,
                    'current_streak': user.current_streak,
                    'trees_equivalent': round(user.total_co2_saved / 21.77, 2)
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# ============ User Stats View ============

class UserStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        user = JWTAuthentication.get_user_from_request(request)
        if not user:
            return Response({
                'success': False,
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get activity breakdown by category
        from django.db.models import Sum, Count
        
        activity_breakdown = UserActivity.objects.filter(user=user).values('activity_type').annotate(
            total_co2=Sum('co2_saved'),
            total_water=Sum('water_saved'),
            total_points=Sum('points_earned'),
            count=Count('id')
        )
        
        # Get recent activities
        recent_activities = UserActivity.objects.filter(user=user)[:10]
        
        return Response({
            'success': True,
            'stats': {
                'total_points': user.total_points,
                'total_co2_saved': round(user.total_co2_saved, 2),
                'activities_count': user.activities_count,
                'current_streak': user.current_streak,
                'longest_streak': user.longest_streak,
                'trees_equivalent': round(user.total_co2_saved / 21.77, 2),
            },
            'breakdown': list(activity_breakdown),
            'recent_activities': UserActivitySerializer(recent_activities, many=True).data
        }, status=status.HTTP_200_OK)


# ============ Leaderboard View ============

class LeaderboardView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        sort_by = request.query_params.get('sort', 'total_points')
        limit = int(request.query_params.get('limit', 50))
        
        valid_sorts = ['total_points', 'total_co2_saved', 'activities_count', 'current_streak']
        if sort_by not in valid_sorts:
            sort_by = 'total_points'
        
        users = User.objects.filter(public_profile=True).order_by(f'-{sort_by}')[:limit]
        
        # Add rank
        leaderboard = []
        for rank, user in enumerate(users, 1):
            data = LeaderboardSerializer(user).data
            data['rank'] = rank
            leaderboard.append(data)
        
        return Response({
            'success': True,
            'leaderboard': leaderboard,
            'sort_by': sort_by
        }, status=status.HTTP_200_OK)


# ============ Badge Views ============

class BadgeListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        badges = Badge.objects.all()
        serializer = BadgeSerializer(badges, many=True)
        return Response({
            'success': True,
            'badges': serializer.data
        }, status=status.HTTP_200_OK)


# ============ Stats View ============

class StatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        total_users = User.objects.count()
        total_co2_saved = User.objects.aggregate(total=models.Sum('total_co2_saved'))['total'] or 0
        total_activities = UserActivity.objects.count()
        
        return Response({
            'success': True,
            'stats': {
                'total_users': total_users,
                'total_co2_saved': round(total_co2_saved, 2),
                'total_activities': total_activities,
                'countries': 50  # Placeholder
            }
        }, status=status.HTTP_200_OK)


# ============ AI Chat View ============

@api_view(['POST'])
@permission_classes([AllowAny])
def chat_with_ai(request):
    user_message = (request.data.get('message') or '').strip()
    
    # Get key inside the view to ensure it's loaded
    openai_key = os.getenv("OPENAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    
    if not (openai_key or groq_key or openrouter_key):
        print("ERROR: No provider API key found in .env file")
        return Response({'reply': "I'm having trouble reaching the AI service. Please add an API key in backend/.env."}, status=200)

    try:
        def try_provider(endpoint, key, model):
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": model,
                "temperature": 0.3,
                "max_tokens": 256,
                "messages": [
                    {"role": "system", "content": "You are LeafIt AI, a sustainability expert for a hackathon at Chitkara University."},
                    {"role": "user", "content": user_message},
                ],
            }
            last_error = None
            for delay in [0, 1, 3]:
                if delay:
                    import time
                    time.sleep(delay)
                try:
                    r = requests.post(endpoint, json=payload, headers=headers, timeout=30)
                    if r.status_code == 200:
                        data = r.json()
                        return data["choices"][0]["message"]["content"], None
                    last_error = r.text
                except Exception as inner_e:
                    last_error = str(inner_e)
            return None, last_error

        # Try Groq FIRST (free), then OpenAI, then OpenRouter
        providers = []
        if groq_key:
            providers.append(("https://api.groq.com/openai/v1/chat/completions", groq_key, "llama-3.3-70b-versatile"))
        if openai_key:
            providers.append(("https://api.openai.com/v1/chat/completions", openai_key, "gpt-4o-mini"))
        if openrouter_key:
            providers.append(("https://openrouter.ai/api/v1/chat/completions", openrouter_key, "meta-llama/llama-3.3-70b-instruct"))

        for endpoint, key, model in providers:
            reply, err = try_provider(endpoint, key, model)
            if reply:
                return Response({"reply": reply})
            if err:
                print(f"DEBUG PROVIDER ERROR: {err}")

        # Local helpful fallback if all providers fail
        fallback = (
            "Here are a few practical green actions you can take:\n"
            "• Reduce energy use: switch to LED, unplug idle chargers.\n"
            "• Save water: fix leaks, take shorter showers.\n"
            "• Lower waste: carry a bottle, recycle paper/plastic.\n"
            "• Commute greener: walk, cycle, or carpool when possible.\n"
            "• Eat smart: cut food waste, try more plant-based meals.\n"
            "Ask me for tips tailored to your home, campus, or office."
        )
        return Response({"reply": fallback}, status=200)
    except Exception as e:
        print(f"DEBUG OPENAI ERROR: {str(e)}")
        return Response({"error": str(e)}, status=500)