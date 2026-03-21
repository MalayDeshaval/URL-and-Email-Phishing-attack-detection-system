import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import re

# Simple feature extraction logic
def extract_features(url):
    features = []
    # 1. URL Length
    features.append(len(url))
    # 2. Number of subdomains
    features.append(url.count('.'))
    # 3. Presence of IP address
    features.append(1 if re.search(r'\d+\.\d+\.\d+\.\d+', url) else 0)
    # 4. Special characters
    features.append(url.count('@') + url.count('-'))
    # 5. HTTPS usage
    features.append(1 if url.startswith('https') else 0)
    # 6. Length of domain
    domain = url.split('//')[-1].split('/')[0]
    features.append(len(domain))
    return features

# Generate synthetic dataset for demonstration
def generate_data():
    safe_urls = [
        "https://www.google.com", "https://www.github.com", "https://www.microsoft.com",
        "https://www.apple.com", "https://www.amazon.com", "https://www.netflix.com",
        "https://www.linkedin.com", "https://www.twitter.com", "https://www.facebook.com",
        "https://www.wired.com", "https://www.techcrunch.com", "https://www.nytimes.com"
    ] * 50
    phishing_urls = [
        "http://login-secure-bank.com", "http://update-your-password.xyz", "http://paypal-verification-desk.net",
        "http://account-locked-security.io", "http://amaz0n-support.click", "http://g00gle-login.ru",
        "http://signin-microsoft-office365.online", "http://apple-id-verify.top", "http://netflix-billing-update.site"
    ] * 50
    
    data = []
    for url in safe_urls:
        data.append(extract_features(url) + [0]) # 0 for safe
    for url in phishing_urls:
        data.append(extract_features(url) + [1]) # 1 for phishing
        
    return pd.DataFrame(data, columns=['len', 'dots', 'is_ip', 'special', 'https', 'domain_len', 'label'])

def train_model():
    print("Generating training data...")
    df = generate_data()
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
    print(classification_report(y_test, y_pred))
    
    # Save model
    model_path = os.path.join('backend', 'models', 'phishing_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
