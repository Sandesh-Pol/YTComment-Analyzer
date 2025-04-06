from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import YouTubeCommentAnalysis, GeminiReportAnalysis

urlpatterns = [
    path('api/sentiment/', YouTubeCommentAnalysis.as_view(), name='youtube_comment_analysis'),
    path('api/aireport/', GeminiReportAnalysis.as_view(), name='report'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
