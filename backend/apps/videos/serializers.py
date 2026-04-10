from rest_framework import serializers

from .models import Video


class VideoSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Video
        fields = (
            "id",
            "owner",
            "owner_username",
            "title",
            "description",
            "sport",
            "category",
            "video_type",
            "video_url",
            "thumbnail_url",
            "likes_count",
            "views_count",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "owner",
            "owner_username",
            "likes_count",
            "views_count",
            "created_at",
            "updated_at",
        )
