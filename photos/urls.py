from django.urls import path
from . import views

urlpatterns = [
    path('', views.map_view, name='map_view'), 
    path('signup/', views.signup_view, name='signup'),
    path('api/photos/', views.PhotoList.as_view(), name='photo_list'),
    path('setup-admin', views.create_admin, name='create_admin')
]