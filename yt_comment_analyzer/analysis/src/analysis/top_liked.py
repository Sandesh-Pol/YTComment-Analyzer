import requests
import json

class TopLikedComments:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://www.googleapis.com/youtube/v3/commentThreads"

    def get_top_liked_comments(self, video_id, top_n=10):
        comments_data = self.fetch_comments(video_id, limit=100)
        comments = self._extract_comments_with_likes(comments_data)

        while len(comments) < top_n and "nextPageToken" in comments_data:
            next_page_token = comments_data["nextPageToken"]
            comments_data = self.fetch_comments(video_id, limit=100, page_token=next_page_token)
            comments.extend(self._extract_comments_with_likes(comments_data))

        comments.sort(key=lambda x: x["like_count"], reverse=True)
        return comments[:top_n]

    def fetch_comments(self, video_id, limit=100, page_token=None):
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": limit,
            "key": self.api_key
        }
        if page_token:
            params["pageToken"] = page_token

        response = requests.get(self.base_url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching comments: {response.status_code} {response.text}")
            return {}

    def _extract_comments_with_likes(self, results):
        comments = []
        for item in results.get("items", []):
            try:
                if isinstance(item, dict) and "snippet" in item:
                    comment = item["snippet"]["topLevelComment"]
                    like_count = comment["snippet"].get("likeCount", 0)
                    text = comment["snippet"]["textDisplay"]
                    comments.append({"text": text, "like_count": like_count})
            except Exception as e:
                print(f"Skipping invalid comment data: {item}, Error: {e}")
        return comments
