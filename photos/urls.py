from django.urls import path
from . import views

urlpatterns = [
    path('api/photos/', views.PhotoList.as_view(), name='photo_list'),
    path('map/', views.map_view, name='map_view')
]