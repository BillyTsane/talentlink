from rest_framework import permissions, generics
from django.contrib.auth import get_user_model
from .serializers import UserMeSerializer
User = get_user_model()

class MeView(generics.RetrieveAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user
