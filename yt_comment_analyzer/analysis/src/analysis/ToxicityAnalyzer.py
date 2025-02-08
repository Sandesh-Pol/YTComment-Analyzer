import requests
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch.nn.functional as F
from config import settings
from googleapiclient import discovery
import json


class PerspectiveToxicityAnalyzer:
    def __init__(self):
        self.api_key = settings.PERSPECTIVE_API_KEY
        self.url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze"
        self.attributes = {"TOXICITY": {"scoreThreshold": 0}}
    
    def analyze(self, comments):
        toxic_scores = []
        headers = {"Content-Type": "application/json"}
        for comment in comments:
            data = {
            "comment": {"text": comment},
            "languages": ["en"],
            "requestedAttributes": self.attributes
            }
            response = requests.post(f"{self.url}?key={self.api_key}", json=data, headers=headers)
            print(response)
            if response.status_code == 200:
                try:
                    score = response.json()["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
                    toxic_scores.append((comment, score))
                except KeyError:
                    print(f"Error parsing response for comment: {comment}")
            else:
                print(f"Request failed for comment: {comment} with status code {response.status_code}")
        return toxic_scores



class BertToxicityAnalyzer:
    def __init__(self):
        self.model_name = "cardiffnlp/twitter-roberta-base-offensive"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
    
    def analyze(self, comments):
        toxic_scores = []
        for comment in comments:
            inputs = self.tokenizer(comment, return_tensors="pt", truncation=True, padding=True, max_length=512)
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = F.softmax(outputs.logits, dim=-1)
                toxicity_score = probs[0][1].item()  # Probability of offensive/toxic content
                toxic_scores.append((comment, toxicity_score))
        return toxic_scores

class MahaTweetBERTToxicityAnalyzer:
    def __init__(self):
        self.model_name = "l3cube-pune/marathi-tweets-bert"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
    
    def analyze(self, comments):
        toxic_scores = []
        for comment in comments:
            inputs = self.tokenizer(comment, return_tensors="pt", truncation=True, padding=True, max_length=512)
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = F.softmax(outputs.logits, dim=-1)
                toxicity_score = probs[0][1].item()  # Assuming label 1 corresponds to toxic content
                toxic_scores.append((comment, toxicity_score))
        return toxic_scores