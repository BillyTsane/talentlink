from django.db import models
from django.conf import settings


class AthleteProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="athlete_profile",
    )
    sport = models.CharField(max_length=64, blank=True, default="")
    position = models.CharField(max_length=64, blank=True, default="")
    age = models.PositiveIntegerField(null=True, blank=True)
    height_cm = models.PositiveIntegerField(null=True, blank=True)
    weight_kg = models.PositiveIntegerField(null=True, blank=True)
    bio = models.TextField(blank=True, default="")

    def __str__(self):
        return f"AthleteProfile<{self.user.username}>"
