from django.urls import path
from . import views
from .views import signup_view

urlpatterns = [
    path('api/photos/', views.PhotoList.as_view(), name='photo_list'),
    path('map/', views.map_view, name='map_view'),
    path('signup/', signup_view, name="signup"),
    path('api/photos/<int:pk>/', views.PhotoDetail.as_view(), name='photo-detail'),
]