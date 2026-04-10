from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import AthleteProfile


User = get_user_model()


class UsersApiTests(APITestCase):
    def setUp(self):
        self.password = "strong-password-123"
        self.user = User.objects.create_user(
            username="demo_player",
            email="demo@example.com",
            password=self.password,
            role="player",
            country="Cameroon",
            city="Douala",
        )
        AthleteProfile.objects.create(
            user=self.user,
            sport="Football",
            position="Attaquant",
            age=21,
            bio="Finisher",
        )

    def authenticate(self):
        response = self.client.post(
            "/api/auth/login",
            {"username": self.user.username, "password": self.password},
            format="json",
        )
        token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_roles_endpoint_returns_available_roles(self):
        response = self.client.get("/api/users/roles")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["roles"]), 3)

    def test_me_endpoint_returns_authenticated_user(self):
        self.authenticate()

        response = self.client.get("/api/users/me")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], self.user.username)

    def test_profile_endpoint_returns_profile(self):
        self.authenticate()

        response = self.client.get("/api/users/profile")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["sport"], "Football")

    def test_profile_endpoint_can_update_profile(self):
        self.authenticate()

        response = self.client.patch(
            "/api/users/profile",
            {"position": "Ailier", "age": 22},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["position"], "Ailier")
        self.assertEqual(response.data["age"], 22)

    def test_discover_endpoint_filters_by_sport(self):
        other_user = User.objects.create_user(
            username="other_player",
            email="other@example.com",
            password=self.password,
            role="player",
        )
        AthleteProfile.objects.create(user=other_user, sport="Basketball", position="Guard")

        response = self.client.get("/api/users/discover?sport=Football")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["sport"], "Football")

    def test_discover_endpoint_filters_by_country_and_position(self):
        response = self.client.get("/api/users/discover?country=Cameroon&position=Atta")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["position"], "Attaquant")
