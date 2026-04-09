from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import AthleteProfile

User = get_user_model()


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "country", "city")


class AthleteProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AthleteProfile
        fields = ("sport", "position", "height_cm", "weight_kg", "bio")
