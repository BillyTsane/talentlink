from django.urls import path

from .views import DiscoverAthletesView, MeView, MyProfileView, RolesView

urlpatterns = [
    path("me", MeView.as_view(), name="me"),
    path("profile", MyProfileView.as_view(), name="my-profile"),
    path("discover", DiscoverAthletesView.as_view(), name="discover-athletes"),
    path("roles", RolesView.as_view(), name="roles"),
]
