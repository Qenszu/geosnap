from django.shortcuts import render
from rest_framework import generics
from .models import Photo
from .serializers import PhotoSerializer
from django.shortcuts import render
# Create your views here.

class PhotoList(generics.ListCreateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

def map_view(request):
    return render(request, 'photos/map.html')