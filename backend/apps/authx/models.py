from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (("player", "Player"), ("club", "Club"), ("agent", "Agent"))
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default="player")
    country = models.CharField(max_length=64, blank=True, default="")
    city = models.CharField(max_length=64, blank=True, default="")
