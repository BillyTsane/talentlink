from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import AthleteProfile
from .serializers import AthleteProfileSerializer, RolesSerializer, UserMeSerializer

User = get_user_model()


class MeView(generics.RetrieveAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = AthleteProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = AthleteProfile.objects.get_or_create(user=self.request.user)
        return profile


class DiscoverAthletesView(generics.ListAPIView):
    serializer_class = AthleteProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = AthleteProfile.objects.select_related("user").all()
        sport = self.request.query_params.get("sport")
        country = self.request.query_params.get("country")
        position = self.request.query_params.get("position")

        if sport:
            queryset = queryset.filter(sport__icontains=sport)
        if country:
            queryset = queryset.filter(user__country__icontains=country)
        if position:
            queryset = queryset.filter(position__icontains=position)

        return queryset


class RolesView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RolesSerializer

    def get(self, request, *args, **kwargs):
        return Response(
            {
                "roles": [
                    {"value": "player", "label": "Player"},
                    {"value": "club", "label": "Club"},
                    {"value": "agent", "label": "Agent"},
                ]
            }
        )
