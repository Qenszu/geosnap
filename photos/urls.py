from django.urls import path
from . import views

urlpatterns = [
    path('', views.map_view, name='map_view'), 
    path('signup/', views.signup_view, name='signup'),
    path('api/photos/', views.PhotoList, name='photo_list'),
]