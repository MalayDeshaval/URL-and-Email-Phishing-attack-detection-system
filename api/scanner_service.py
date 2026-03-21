import re
import joblib
import pandas as pd
import os
from ml_trainer import extract_features

class ScannerService:
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'phishing_model.pkl')
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            self.model = None

    def scan_url(self, url: str, deep_scan: bool = True):
        if not self.model or not deep_scan:
            # Simple pattern matching if deep scan is off
            is_suspicious = "login" in url.lower() or "bank" in url.lower() or "verify" in url.lower()
            return ("suspicious" if is_suspicious else "safe"), (70.0 if is_suspicious else 60.0)
        
        features = extract_features(url)
        # Convert to DataFrame for prediction
        features_df = pd.DataFrame([features], columns=['len', 'dots', 'is_ip', 'special', 'https', 'domain_len'])
        
        prediction = self.model.predict(features_df)[0]
        prob = self.model.predict_proba(features_df)[0]
        confidence = float(max(prob) * 100)
        
        result = "phishing" if prediction == 1 else "safe"
        
        # Rule-based adjustments
        if "login" in url.lower() or "verify" in url.lower() or "secure" in url.lower():
            if result == "safe":
                result = "suspicious"
                confidence = 75.0

        return result, confidence

    def scan_email(self, text: str, deep_scan: bool = True):
        # Basic NLP/Rule-based detection for email
        suspicious_words = ["urgent", "bank", "password", "reset", "login", "account", "locked", "suspended", "verify", "click here"]
        count: int = 0
        for word in suspicious_words:
            if word in text.lower():
                count += 1
        
        # If deep scan is off, we are less aggressive
        threshold = 3 if deep_scan else 5
        
        if count >= threshold:
            return "phishing", 85.0
        elif count > 1:
            return "suspicious", 60.0
        else:
            return "safe", 95.0

scanner_service = ScannerService()
