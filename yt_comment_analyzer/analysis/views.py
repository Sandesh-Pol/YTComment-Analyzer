from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import asyncio
from analysis.src.yt_module.api_client import YouTubeClient, CommentFetcher
from analysis.src.yt_module.parser import YouTubeURLParser
from analysis.src.processing.cleaners import clean_text
from analysis.src.analysis.sentiment import SentimentAnalyzer
from analysis.src.analysis.emojis import EmojiAnalyzer
from analysis.src.analysis.ToxicityAnalyzer import BertToxicityAnalyzer
from analysis.src.analysis.geminiAnalyzer import YouTubeCommentAnalyzerWithAI
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Initialize components once to avoid re-instantiating them in each request
client = YouTubeClient()
fetcher = CommentFetcher(client)
sentiment = SentimentAnalyzer()
emoji_analyzer = EmojiAnalyzer()
toxicity_bert = BertToxicityAnalyzer()

async def analyze_comments(video_url, comment_limit):
    """Fetch and analyze YouTube comments asynchronously."""
    video_id = YouTubeURLParser().extract_video_id(video_url)
    if not video_id:
        return {'error': 'Invalid YouTube URL'}

    # Reset comments list before fetching new comments
    fetcher.comments = []
    raw_comments = fetcher.fetch_comments(video_id, comment_limit)
    cleaned_comments = [clean_text(c) for c in raw_comments]

    sentiment_vader = sentiment.analyze_vader(cleaned_comments)
    sentiment_textblob = sentiment.analyze_textblob(cleaned_comments)
    toxic_comments = toxicity_bert.analyze(cleaned_comments)
    top_emojis = emoji_analyzer.top_emojis(raw_comments)

    return {
        'sentiment': {
            'vader': sentiment_vader,
            'textblob': sentiment_textblob
        },
        'toxicity': {
            'bert': toxic_comments,
        },
        'emojis': top_emojis,
        'total_comments': len(cleaned_comments),
    }

async def analyze_with_gemini(video_url, comment_limit):
    """Fetch and analyze YouTube comments using Gemini AI only."""
    video_id = YouTubeURLParser().extract_video_id(video_url)
    if not video_id:
        return {'error': 'Invalid YouTube URL'}

    # Reset comments list before fetching new comments
    fetcher.comments = []
    raw_comments = fetcher.fetch_comments(video_id, comment_limit)
    cleaned_comments = [clean_text(c) for c in raw_comments]

    gemini_analyzer = YouTubeCommentAnalyzerWithAI(cleaned_comments)
    gemini_summary = gemini_analyzer.get_summary()
    public_demands = gemini_analyzer.get_public_demand()
    suggestions = gemini_analyzer.get_suggestions()

    return {
        'gemini_analysis': {
            'summary': gemini_summary,
            'public_demands': public_demands,
            'suggestions': suggestions
        },
        'total_comments': len(cleaned_comments)
    }

class YouTubeCommentAnalysis(APIView):
    """DRF API view to analyze YouTube comments."""
    
    def post(self, request, *args, **kwargs):
        try:
            video_url = request.data.get('video_url')
            comment_limit = int(request.data.get('comment_limit', 100))
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid comment_limit must be an integer'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not video_url:
            return Response(
                {'error': 'YouTube video URL is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = asyncio.run(analyze_comments(video_url, comment_limit))
        return Response(results, status=status.HTTP_200_OK)

class GeminiReportAnalysis(APIView):
    """DRF API view to analyze YouTube comments using Gemini AI only."""
    
    def post(self, request, *args, **kwargs):
        try:
            video_url = request.data.get('video_url')
            comment_limit = int(request.data.get('comment_limit', 100))
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid comment_limit must be an integer'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not video_url:
            return Response(
                {'error': 'YouTube video URL is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = asyncio.run(analyze_with_gemini(video_url, comment_limit))
        return Response(results, status=status.HTTP_200_OK)
