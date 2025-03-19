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

@csrf_exempt  # Correct way for function-based views
def youtube_comment_analysis(request):
    """Simple Django API view to analyze YouTube comments."""
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        video_url = data.get('video_url')
        comment_limit = int(data.get('comment_limit', 100))
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON or comment_limit must be an integer'}, status=400)

    if not video_url:
        return JsonResponse({'error': 'YouTube video URL is required'}, status=400)

    # Run the async function in a synchronous Django view
    results = asyncio.run(analyze_comments(video_url, comment_limit))

    return JsonResponse(results, status=200)
