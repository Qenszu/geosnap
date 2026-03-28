from django.urls import path
from . import views

urlpatterns = [
    path('', views.map_view, name='map_view'), 
    path('signup/', views.signup, name='signup'),
    path('api/photos/', views.photo_list, name='photo_list'),
]