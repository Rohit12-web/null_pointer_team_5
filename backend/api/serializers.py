from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import GreenAction, User, Badge, UserBadge, UserActivity, RefreshToken
import jwt
import uuid
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone


class GreenActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenAction
        fields = '__all__'


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'slug', 'description', 'icon', 'points_required', 'category']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['badge', 'earned_at']


class UserSerializer(serializers.ModelSerializer):
    badges = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'username', 'avatar', 'bio', 'location',
            'total_points', 'total_co2_saved', 'activities_count', 
            'current_streak', 'longest_streak', 'date_joined', 'last_activity',
            'email_notifications', 'public_profile', 'badges'
        ]
        read_only_fields = ['id', 'date_joined', 'total_points', 'total_co2_saved', 
                          'activities_count', 'current_streak', 'longest_streak']
    
    def get_badges(self, obj):
        user_badges = UserBadge.objects.filter(user=obj).select_related('badge')
        return [ub.badge.slug for ub in user_badges]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'avatar', 'bio', 'location', 'email_notifications', 'public_profile']


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(required=True, max_length=150)
    
    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'].split('@')[0] + str(uuid.uuid4())[:4],
            name=validated_data['name'],
            password=validated_data['password'],
            # Explicitly set default values to 0
            total_points=0,
            total_co2_saved=0.0,
            activities_count=0,
            current_streak=0,
            longest_streak=0,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password', '')
        
        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")
        
        # Try to find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")
        
        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")
        
        if not user.is_active:
            raise serializers.ValidationError("This account has been deactivated.")
        
        attrs['user'] = user
        return attrs


class TokenSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()
    token_type = serializers.CharField(default='Bearer')
    expires_in = serializers.IntegerField()
    user = UserSerializer()


class RefreshTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(required=True)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match."})
        return attrs


class UserActivityCreateSerializer(serializers.Serializer):
    """Serializer for creating activities from frontend"""
    activity_type = serializers.CharField(required=True)
    activity_subtype = serializers.CharField(required=True)
    activity_name = serializers.CharField(required=True)
    quantity = serializers.FloatField(required=True, min_value=0.1)
    unit = serializers.CharField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    activity_date = serializers.DateField(required=False)
    
    def create(self, validated_data):
        from django.utils import timezone
        from datetime import datetime
        
        user = self.context['request_user']
        
        # Handle activity_date - convert date to datetime if provided
        activity_date = validated_data.get('activity_date')
        if activity_date:
            # Convert date to datetime at noon
            activity_datetime = timezone.make_aware(
                datetime.combine(activity_date, datetime.min.time().replace(hour=12))
            )
        else:
            activity_datetime = timezone.now()
        
        activity = UserActivity.objects.create(
            user=user,
            activity_type=validated_data['activity_type'],
            activity_subtype=validated_data['activity_subtype'],
            activity_name=validated_data['activity_name'],
            quantity=validated_data['quantity'],
            unit=validated_data['unit'],
            notes=validated_data.get('notes', ''),
            activity_date=activity_datetime,
        )
        return activity


class UserActivitySerializer(serializers.ModelSerializer):
    activity_date = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'activity_type', 'activity_subtype', 'activity_name',
            'quantity', 'unit', 'notes', 'activity_date',
            'points_earned', 'co2_saved', 'water_saved', 'created_at'
        ]
        read_only_fields = ['points_earned', 'co2_saved', 'water_saved', 'created_at', 'activity_date']


class UserStatsSerializer(serializers.ModelSerializer):
    """Serializer for user statistics"""
    trees_equivalent = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'total_points', 'total_co2_saved', 'activities_count',
            'current_streak', 'longest_streak', 'trees_equivalent'
        ]
    
    def get_trees_equivalent(self, obj):
        # Average tree absorbs ~21.77 kg CO2 per year
        return round(obj.total_co2_saved / 21.77, 2)


class LeaderboardSerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'avatar', 'total_points', 'total_co2_saved', 
                  'activities_count', 'current_streak', 'rank']