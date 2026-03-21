from scanner_service import extract_features

class AIEngine:
    def get_explanation(self, type: str, target: str, result: str):
        if type == "url":
            features = extract_features(target)
            # features indices: 0:len, 1:dots, 2:is_ip, 3:special, 4:https, 5:domain_len
            reasons = []
            if result == "safe":
                protocol = "secure HTTPS usage" if features[4] == 1 else "standard patterns (though it uses non-secure HTTP)"
                return f"The URL appears to be legitimate based on {protocol}."
            
            if features[4] == 0:
                reasons.append("The website does not use a secure HTTPS connection.")
            if features[1] > 3:
                reasons.append(f"It contains an unusually high number of subdomains ({features[1]}).")
            if features[2] == 1:
                reasons.append("The URL uses an IP address instead of a domain name, which is a common phishing tactic.")
            if "login" in target.lower() or "bank" in target.lower():
                reasons.append("The URL contains keywords often used to mimic login or banking portals.")
            
            if not reasons:
                reasons.append("The structural patterns of this URL match known phishing profiles in our ML model.")
                
            return "Suspicious elements found: " + " ".join(reasons)
        
        else: # email
            suspicious_words = ["urgent", "bank", "password", "reset", "login", "account", "locked", "suspended", "verify"]
            found = [w for w in suspicious_words if w in target.lower()]
            
            if result == "safe":
                return "The email content does not show typical phishing characteristics or urgent threatening language."
            
            explanation = f"This email is flagged because it contains high-risk keywords: {', '.join(found)}. "
            if "urgent" in found or "locked" in found:
                explanation += "The language used creates a false sense of urgency, typically used to trick users into acting quickly."
            
            return explanation

ai_engine = AIEngine()
