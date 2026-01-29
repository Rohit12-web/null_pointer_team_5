from rest_framework import serializers
from .models import GreenAction

class GreenActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenAction
        fields = '__all__'