from django.contrib.gis import admin
from .models import Photo

# Register your models here.
@admin.register(Photo)

class PhotoAdmin(admin.GISModelAdmin):
    list_display = ('title', 'pointLocation', 'date', 'image')