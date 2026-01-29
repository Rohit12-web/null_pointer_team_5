from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    """Extended User model with eco-tracking profile"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150, blank=True)
    avatar = models.URLField(blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Eco stats
    total_points = models.IntegerField(default=0)
    total_co2_saved = models.FloatField(default=0.0)  # in kg
    activities_count = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    
    # Dates
    date_joined = models.DateTimeField(default=timezone.now)
    last_activity = models.DateTimeField(null=True, blank=True)
    
    # Settings
    email_notifications = models.BooleanField(default=True)
    public_profile = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']
    
    class Meta:
        db_table = 'users'
        
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return self.name or self.username
    
    def update_streak(self):
        """Update user's activity streak"""
        from datetime import timedelta
        now = timezone.now()
        if self.last_activity:
            diff = (now.date() - self.last_activity.date()).days
            if diff == 1:
                self.current_streak += 1
                if self.current_streak > self.longest_streak:
                    self.longest_streak = self.current_streak
            elif diff > 1:
                self.current_streak = 1
        else:
            self.current_streak = 1
        self.last_activity = now
        self.save()


class Badge(models.Model):
    """Achievements users can earn"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50)  # emoji or icon name
    points_required = models.IntegerField(default=0)
    category = models.CharField(max_length=50)  # e.g., 'streak', 'activity', 'milestone'
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class UserBadge(models.Model):
    """Badges earned by users"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'badge')
        
    def __str__(self):
        return f"{self.user.email} - {self.badge.name}"


class GreenAction(models.Model):
    """Pre-defined green actions users can log"""
    CATEGORY_CHOICES = [
        ('transport', 'Transportation'),
        ('electricity', 'Energy Saving'),
        ('recycling', 'Recycling & Waste'),
        ('water', 'Water Conservation'),
        ('food', 'Sustainable Food'),
        ('other', 'Other Activities'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    points_per_unit = models.IntegerField(default=10)
    co2_per_unit = models.FloatField(default=0.0)  # kg of CO2 saved per unit
    water_per_unit = models.FloatField(default=0.0)  # liters of water saved per unit
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='other')
    unit = models.CharField(max_length=50, default='times')  # km, hours, items, etc.
    icon = models.CharField(max_length=50, default='🌱')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'title']

    def __str__(self):
        return f"{self.title} ({self.category})"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.title.lower().replace(' ', '_').replace('-', '_')
        super().save(*args, **kwargs)


class UserActivity(models.Model):
    """Track user's green activities"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.ForeignKey(GreenAction, on_delete=models.CASCADE, null=True, blank=True)
    
    # Store activity details directly for flexibility
    activity_type = models.CharField(max_length=100, default='other')  # transport, electricity, etc.
    activity_subtype = models.CharField(max_length=100, default='other')  # cycling, led_lights, etc.
    activity_name = models.CharField(max_length=200, default='Green Activity')
    
    quantity = models.FloatField(default=1)
    unit = models.CharField(max_length=50, default='times')
    notes = models.TextField(blank=True)
    activity_date = models.DateTimeField(auto_now_add=True)
    
    # Calculated impact
    points_earned = models.IntegerField(default=0)
    co2_saved = models.FloatField(default=0.0)  # kg
    water_saved = models.FloatField(default=0.0)  # liters
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'User Activities'
    
    # CO2 impact factors (kg CO2 saved per unit)
    CO2_FACTORS = {
        # Transport
        'public_transport': 0.14,
        'cycling': 0.21,
        'walking': 0.21,
        'carpooling': 0.08,
        'electric_vehicle': 0.10,
        # Electricity
        'led_lights': 0.04,
        'unplug_devices': 0.02,
        'ac_reduction': 0.15,
        'solar_energy': 0.50,
        'natural_light': 0.06,
        # Recycling
        'plastic_recycling': 0.50,
        'paper_recycling': 1.00,
        'composting': 0.30,
        'reusable_bags': 0.10,
        'reduced_packaging': 0.20,
        # Water (minimal CO2 but still counts)
        'shorter_shower': 0.01,
        'fix_leaks': 0.02,
        'rainwater': 0.01,
        'efficient_washing': 0.05,
        'turned_off_tap': 0.005,
        # Food
        'plant_based_meal': 2.50,
        'local_food': 0.50,
        'no_food_waste': 0.70,
        'homegrown': 1.00,
        'seasonal_food': 0.30,
        # Other
        'tree_planting': 22.0,  # Per year absorption
        'eco_drive': 0.50,
        'awareness': 0.10,
        'cleanup': 0.20,
        'donation': 0.50,
    }
    
    # Water impact factors (liters saved per unit)
    WATER_FACTORS = {
        'shorter_shower': 10.0,
        'fix_leaks': 20.0,
        'rainwater': 1.0,
        'efficient_washing': 50.0,
        'turned_off_tap': 12.0,
    }
    
    # Points per activity type
    POINTS_FACTORS = {
        # Transport
        'public_transport': 15,
        'cycling': 20,
        'walking': 20,
        'carpooling': 10,
        'electric_vehicle': 12,
        # Electricity
        'led_lights': 5,
        'unplug_devices': 3,
        'ac_reduction': 15,
        'solar_energy': 50,
        'natural_light': 8,
        # Recycling
        'plastic_recycling': 25,
        'paper_recycling': 30,
        'composting': 20,
        'reusable_bags': 10,
        'reduced_packaging': 15,
        # Water
        'shorter_shower': 10,
        'fix_leaks': 25,
        'rainwater': 15,
        'efficient_washing': 20,
        'turned_off_tap': 5,
        # Food
        'plant_based_meal': 30,
        'local_food': 20,
        'no_food_waste': 25,
        'homegrown': 35,
        'seasonal_food': 15,
        # Other
        'tree_planting': 100,
        'eco_drive': 40,
        'awareness': 30,
        'cleanup': 50,
        'donation': 25,
    }
        
    def calculate_impact(self):
        """Calculate all impact metrics based on activity"""
        subtype = self.activity_subtype
        
        # Calculate CO2 saved
        co2_factor = self.CO2_FACTORS.get(subtype, 0.1)
        self.co2_saved = round(float(self.quantity) * co2_factor, 3)
        
        # Calculate water saved
        water_factor = self.WATER_FACTORS.get(subtype, 0)
        self.water_saved = round(float(self.quantity) * water_factor, 2)
        
        # Calculate points
        points_factor = self.POINTS_FACTORS.get(subtype, 10)
        self.points_earned = int(float(self.quantity) * points_factor)
        
    def save(self, *args, **kwargs):
        # Calculate impact before saving
        self.calculate_impact()
        
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Update user stats only for new activities
        if is_new:
            self.user.total_points += self.points_earned
            self.user.total_co2_saved += self.co2_saved
            self.user.activities_count += 1
            self.user.update_streak()
        
    def __str__(self):
        return f"{self.user.email} - {self.activity_name} ({self.quantity} {self.unit})"


class RefreshToken(models.Model):
    """Store refresh tokens for JWT authentication"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refresh_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_revoked = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Token for {self.user.email}"
    
    def is_valid(self):
        return not self.is_revoked and self.expires_at > timezone.now()