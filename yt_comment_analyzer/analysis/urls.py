from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import youtube_comment_analysis

urlpatterns = [
    path('api/youtube_comment_analysis/', youtube_comment_analysis, name='youtube_comment_analysis'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
