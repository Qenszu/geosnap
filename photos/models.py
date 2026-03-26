from django.contrib.gis.db import models

# Create your models here.

class Photo(models.Model):
    title = models.CharField(max_length=50)
    pointLocation = models.PointField()
    date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='photos/')