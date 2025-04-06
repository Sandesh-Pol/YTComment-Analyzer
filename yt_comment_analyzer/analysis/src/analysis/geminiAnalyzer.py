import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load API key from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Google Generative AI
genai.configure(api_key=GEMINI_API_KEY)


class YouTubeCommentAnalyzerWithAI:
    def __init__(self, comments):
        """
        Initializes the analyzer with a list of comments.
        """
        self.comments = comments
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def get_summary(self):
        """
        Generates a pointwise summary of the given comments in 10 lines.
        """
        prompt = f"""
        You are an AI assistant analyzing YouTube comments. Given the following comments:
        {self.comments}
        
        Provide a concise **pointwise summary** in 10 lines.
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def get_public_demand(self):
        """
        Analyzes comments to extract public demands (1 to 5 points).
        """
        prompt = f"""
        Analyze the following YouTube comments:
        {self.comments}
        
        Identify **public demands** based on recurring themes and requests. 
        Provide **1 to 5 key demands** in a numbered list.
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def get_suggestions(self):
        """
        Provides constructive suggestions for the YouTuber based on comments.
        """
        prompt = f"""
        Based on the following YouTube comments:
        {self.comments}
        
        Generate **5 to 10 constructive suggestions** for the YouTuber to improve their content.
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()

