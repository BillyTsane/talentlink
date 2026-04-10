from django.conf import settings
from django.db import models


class Video(models.Model):
    CATEGORY_CHOICES = (
        ("match", "Match"),
        ("training", "Training"),
        ("skills", "Skills"),
    )
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="videos"
    )
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True, default="")
    sport = models.CharField(max_length=64, blank=True, default="")
    category = models.CharField(max_length=16, choices=CATEGORY_CHOICES, default="match")
    video_type = models.CharField(max_length=64, blank=True, default="full-match")
    video_url = models.URLField(blank=True, default="")
    thumbnail_url = models.URLField(blank=True, default="")
    likes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="published")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Video<{self.title}>"
