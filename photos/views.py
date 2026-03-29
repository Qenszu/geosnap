from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Photo
from .serializers import PhotoSerializer
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.http import HttpResponse

# Create your views here.

class PhotoList(generics.ListCreateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PhotoDetail(generics.RetrieveDestroyAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_destroy(self, instance):
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("You don't have permission to do that!!!")
        
        instance.delete()

        
def map_view(request):
    return render(request, 'photos/map.html')

def signup_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login') # Po rejestracji wyślij go do logowania
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})

