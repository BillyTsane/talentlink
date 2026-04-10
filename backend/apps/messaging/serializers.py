from rest_framework import serializers

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Message
        fields = ("id", "conversation", "sender", "sender_username", "body", "created_at")
        read_only_fields = ("id", "sender", "sender_username", "created_at")


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participant_ids = serializers.PrimaryKeyRelatedField(
        source="participants", many=True, read_only=True
    )

    class Meta:
        model = Conversation
        fields = ("id", "title", "participant_ids", "messages", "created_at")
        read_only_fields = ("id", "messages", "created_at")
