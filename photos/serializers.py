from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Photo

class PhotoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Photo
        geo_field = 'pointLocation'
        fields = ('id', 'title', 'image', 'date')