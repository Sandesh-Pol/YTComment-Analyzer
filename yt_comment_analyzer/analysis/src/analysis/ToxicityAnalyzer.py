import requests
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch.nn.functional as F
from config import settings
import matplotlib.pyplot as plt

class PerspectiveToxicityAnalyzer:
    def __init__(self):
        self.api_key = settings.PERSPECTIVE_API_KEY
        self.url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze"
        self.attributes = {"TOXICITY": {"scoreThreshold": 0}}
    
    def analyze(self, comments):
        toxic_comments = []
        headers = {"Content-Type": "application/json"}
        for comment in comments:
            data = {
                "comment": {"text": comment},
                "languages": ["en"],
                "requestedAttributes": self.attributes
            }
            response = requests.post(f"{self.url}?key={self.api_key}", json=data, headers=headers)
            if response.status_code == 200:
                try:
                    score = response.json()["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
                    if score > 0.3:  # Filtering only toxic comments
                        toxic_comments.append((comment, score))
                except KeyError:
                    print(f"Error parsing response for comment: {comment}")
        return toxic_comments

class BertToxicityAnalyzer:
    def __init__(self):
        self.model_name = "cardiffnlp/twitter-roberta-base-offensive"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
    
    def analyze(self, comments):
        toxic_comments = []
        for comment in comments:
            inputs = self.tokenizer(comment, return_tensors="pt", truncation=True, padding=True, max_length=512)
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = F.softmax(outputs.logits, dim=-1)
                toxicity_score = probs[0][1].item()
                if toxicity_score > 0.3:  # Filtering only toxic comments
                    toxic_comments.append((comment, toxicity_score))
        return toxic_comments

# Function to classify toxicity levels
def classify_toxicity(comments):
    levels = {"Low": 0, "Medium": 0, "High": 0}
    for _, score in comments:
        if score < 0.5:
            levels["Low"] += 1
        elif score < 0.75:
            levels["Medium"] += 1
        else:
            levels["High"] += 1
    return levels




