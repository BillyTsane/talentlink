from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Notification


User = get_user_model()


class NotificationsApiTests(APITestCase):
    def setUp(self):
        self.password = "strong-password-123"
        self.user = User.objects.create_user(
            username="notify_user",
            email="notify@example.com",
            password=self.password,
            role="player",
        )

    def authenticate(self):
        response = self.client.post(
            "/api/auth/login",
            {"username": self.user.username, "password": self.password},
            format="json",
        )
        token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_notifications_are_scoped_to_authenticated_user(self):
        other = User.objects.create_user(username="other", password=self.password, role="agent")
        Notification.objects.create(user=self.user, notification_type="view", title="Viewed")
        Notification.objects.create(user=other, notification_type="like", title="Liked")

        self.authenticate()
        response = self.client.get("/api/notifications/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Viewed")
