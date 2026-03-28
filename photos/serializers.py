from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Photo
from rest_framework import serializers

class PhotoSerializer(GeoFeatureModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Photo
        geo_field = 'pointLocation'
        fields = ('id', 'title', 'image', 'user', 'date')