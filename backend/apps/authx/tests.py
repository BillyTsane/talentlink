from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


User = get_user_model()


class AuthApiTests(APITestCase):
    def test_user_can_register(self):
        response = self.client.post(
            "/api/auth/register",
            {
                "username": "registered_user",
                "email": "registered@example.com",
                "password": "very-strong-password-123",
                "role": "player",
                "country": "Cameroon",
                "city": "Douala",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username="registered_user").exists())
