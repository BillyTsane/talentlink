from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import AthleteProfile

User = get_user_model()


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "country", "city")


class AthleteProfileSerializer(serializers.ModelSerializer):
    user = UserMeSerializer(read_only=True)

    class Meta:
        model = AthleteProfile
        fields = (
            "id",
            "user",
            "sport",
            "position",
            "age",
            "height_cm",
            "weight_kg",
            "bio",
        )


class RolesSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()
