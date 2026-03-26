from django.shortcuts import render
from rest_framework import generics
from .models import Photo
from .serializers import PhotoSerializer
# Create your views here.

class PhotoList(generics.ListCreateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer