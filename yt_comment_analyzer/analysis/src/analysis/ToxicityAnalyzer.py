import requests
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch.nn.functional as F
from config import settings
import matplotlib.pyplot as plt

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
                if toxicity_score > 0.5:  # Filtering only toxic comments
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




