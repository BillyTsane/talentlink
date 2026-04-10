from django.conf import settings
from django.db import models


class Notification(models.Model):
    TYPE_CHOICES = (
        ("view", "View"),
        ("message", "Message"),
        ("like", "Like"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    notification_type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    title = models.CharField(max_length=160)
    body = models.TextField(blank=True, default="")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification<{self.title}>"
