from django.contrib.gis.db import models
from django.contrib.auth.models import User

# Create your models here.

class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=50)
    pointLocation = models.PointField()
    date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='photos/')