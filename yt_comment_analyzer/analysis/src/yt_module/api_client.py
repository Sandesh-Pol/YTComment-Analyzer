from googleapiclient.discovery import build
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class YouTubeClient:
    def __init__(self):
        self.service = build(
            'youtube',  # API service name
            'v3',      # API version
            developerKey=os.getenv('YOUTUBE_API_KEY')  # Load API key from .env
        )
    
    def get_comment_threads(self, video_id, limit=100, page_token=None):
        return self.service.commentThreads().list(
            part="snippet",
            maxResults=limit,
            videoId=video_id,
            textFormat="plainText",
            pageToken=page_token
        ).execute()

class CommentFetcher:
    def __init__(self, client):
        self.client = client
        self.comments = []
    
    def fetch_comments(self, video_id, limit=100):
        remaining = limit
        page_token = None
        
        while remaining > 0:
            batch_size = min(remaining, 100)
            results = self.client.get_comment_threads(
                video_id, 
                batch_size, 
                page_token
            )
            
            self._process_batch(results)
            remaining -= batch_size
            page_token = results.get("nextPageToken")
            
            if not page_token:
                break
        
        return self.comments
    
    def _process_batch(self, results):
        for item in results.get("items", []):
            comment = item["snippet"]["topLevelComment"]
            text = comment["snippet"]["textDisplay"]
            self.comments.append(text)