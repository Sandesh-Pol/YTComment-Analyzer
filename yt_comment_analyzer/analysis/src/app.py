import asyncio
import time
from yt_module .api_client import YouTubeClient, CommentFetcher
from yt_module .parser import YouTubeURLParser
from processing.cleaners import clean_text
from analysis.src.analysis.sentiment import SentimentAnalyzer
from analysis.src.analysis.emojis import EmojiAnalyzer
from analysis.src.analysis.ToxicityAnalyzer import BertToxicityAnalyzer
import nltk

nltk.download('vader_lexicon')

class YouTubeCommentAnalyzer:
    def __init__(self):
        self.client = YouTubeClient()
        self.fetcher = CommentFetcher(self.client)
        self.sentiment = SentimentAnalyzer()
        self.emoji = EmojiAnalyzer()
        self.toxicity_bert = BertToxicityAnalyzer()

    async def analyze(self, video_url, comment_limit=100):
        video_id = YouTubeURLParser().extract_video_id(video_url)
        if not video_id:
            raise ValueError("Invalid YouTube URL")

        # Fetch comments
        start_time = time.time()
        raw_comments = self.fetcher.fetch_comments(video_id, comment_limit)
        fetch_time = time.time() - start_time

        start_time = time.time()
        cleaned_comments = [clean_text(c) for c in raw_comments]
        clean_time = time.time() - start_time

        # Perform sentiment analysis
        start_time = time.time()
        sentiment_vader = self.sentiment.analyze_vader(cleaned_comments)
        sentiment_vader_time = time.time() - start_time

        start_time = time.time()
        sentiment_textblob = self.sentiment.analyze_textblob(cleaned_comments)
        sentiment_textblob_time = time.time() - start_time

        # Perform toxicity analysis
        start_time = time.time()
        toxic_comments = self.toxicity_bert.analyze(cleaned_comments)  # Get toxic comments
        toxicity_bert_time = time.time() - start_time

        top_emojis = self.emoji.top_emojis(raw_comments)

        return {
            'sentiment': {
                'vader': sentiment_vader,
                'textblob': sentiment_textblob
            },
            'toxicity': {
                'bert': toxic_comments,  # Store toxic comments here
            },
            'emojis': top_emojis,
            'total_comments': len(cleaned_comments),
            'time_complexity': {
                'fetch_comments': fetch_time,
                'clean_comments': clean_time,
                'sentiment_vader': sentiment_vader_time,
                'sentiment_textblob': sentiment_textblob_time,
                'toxicity_bert': toxicity_bert_time,
            }
        }

# Function to neatly print results
def print_results(results):
    print("\n📊 ------------- YouTube Comment Analysis ------------- 📊\n")

    # Display total comments analyzed
    print(f"📌 Total Comments Analyzed: {results['total_comments']}\n")

    # Display Sentiment Analysis
    print("🔹 Sentiment Analysis:")
    for method, data in results['sentiment'].items():
        print(f"   ✅ {method.title()} Sentiment:")
        print(f"   - Positive: {data['breakdown'].get('positive', 0)}%")
        print(f"   - Neutral: {data['breakdown'].get('neutral', 0)}%")
        print(f"   - Negative: {data['breakdown'].get('negative', 0)}%")
        print(f"   - Overall Score: {data['overall']:.2f}\n")

    # Display Toxic Comments
    print("⚠️ Toxic Comments Detected:")
    if results['toxicity']['bert']:
        for idx, (comment, score) in enumerate(results['toxicity']['bert'], start=1):
            print(f"   {idx}. [{score:.2f} Toxicity] {comment[:50]}...")
    else:
        print("   🎉 No significantly toxic comments detected!")
    print("\n")

    # Display Most Used Emojis
    print("😀 Most Used Emojis:")
    if results['emojis']:
        for emoji, count in results['emojis']:
            print(f"   {emoji} - {count} times")
    else:
        print("   😕 No emojis detected in comments.")
    print("\n")

    # Display Time Complexity for each step
    print("⏳ Processing Time Analysis:")
    for feature, time_taken in results['time_complexity'].items():
        print(f"   🔹 {feature.replace('_', ' ').title()}: {time_taken:.4f} seconds")
    
    print("\n✅ Analysis Complete!")

async def main():
    analyzer = YouTubeCommentAnalyzer()
    video_url = input("🔗 Enter YouTube video URL: ")
    comment_limit = int(input("📝 Number of comments to analyze (max 5000): "))

    print("\n⏳ Analyzing comments... Please wait...\n")
    results = await analyzer.analyze(video_url, comment_limit)

    print_results(results)

if __name__ == "__main__":
    asyncio.run(main())
