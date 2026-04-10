from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Conversation, Message


User = get_user_model()


class MessagingApiTests(APITestCase):
    def setUp(self):
        self.password = "strong-password-123"
        self.user = User.objects.create_user(
            username="msg_user",
            email="msg@example.com",
            password=self.password,
            role="player",
        )
        self.other = User.objects.create_user(
            username="other_user",
            email="other@example.com",
            password=self.password,
            role="club",
        )

    def authenticate(self):
        response = self.client.post(
            "/api/auth/login",
            {"username": self.user.username, "password": self.password},
            format="json",
        )
        token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_user_sees_only_own_conversations(self):
        own = Conversation.objects.create(title="Own")
        own.participants.add(self.user)
        other = Conversation.objects.create(title="Other")
        other.participants.add(self.other)

        self.authenticate()
        response = self.client.get("/api/messages/conversations/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Own")

    def test_user_can_create_message_in_own_conversation(self):
        conversation = Conversation.objects.create(title="Chat")
        conversation.participants.add(self.user, self.other)

        self.authenticate()
        response = self.client.post(
            "/api/messages/items/",
            {"conversation": conversation.id, "body": "Hello there"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Message.objects.count(), 1)

    def test_messages_can_be_filtered_by_conversation(self):
        conversation = Conversation.objects.create(title="Chat")
        conversation.participants.add(self.user, self.other)
        other_conversation = Conversation.objects.create(title="Other chat")
        other_conversation.participants.add(self.user, self.other)
        Message.objects.create(conversation=conversation, sender=self.user, body="Hello")
        Message.objects.create(conversation=other_conversation, sender=self.user, body="Other")

        self.authenticate()
        response = self.client.get(f"/api/messages/items/?conversation={conversation.id}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["body"], "Hello")
