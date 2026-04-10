from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Video


User = get_user_model()


class VideosApiTests(APITestCase):
    def setUp(self):
        self.password = "strong-password-123"
        self.user = User.objects.create_user(
            username="video_user",
            email="video@example.com",
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

    def test_authenticated_user_can_create_video(self):
        self.authenticate()

        response = self.client.post(
            "/api/videos/",
            {
                "title": "Demo Match",
                "description": "Highlights",
                "sport": "Football",
                "category": "match",
                "video_type": "highlights",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Video.objects.count(), 1)

    def test_video_list_can_be_filtered_by_sport(self):
        Video.objects.create(owner=self.user, title="A", sport="Football")
        Video.objects.create(owner=self.user, title="B", sport="Basketball")

        response = self.client.get("/api/videos/?sport=Football")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["sport"], "Football")

    def test_video_list_can_be_filtered_by_category_and_owner(self):
        other = User.objects.create_user(
            username="other_video_user",
            email="othervideo@example.com",
            password=self.password,
            role="club",
        )
        Video.objects.create(owner=self.user, title="A", sport="Football", category="match")
        Video.objects.create(owner=other, title="B", sport="Football", category="training")

        response = self.client.get(
            f"/api/videos/?category=match&owner={self.user.id}"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["category"], "match")
