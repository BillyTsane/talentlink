from rest_framework import permissions, viewsets

from .models import Video
from .serializers import VideoSerializer


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.select_related("owner").all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Video.objects.select_related("owner").all()
        sport = self.request.query_params.get("sport")
        category = self.request.query_params.get("category")
        owner_id = self.request.query_params.get("owner")

        if sport:
            queryset = queryset.filter(sport__iexact=sport)
        if category:
            queryset = queryset.filter(category=category)
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
