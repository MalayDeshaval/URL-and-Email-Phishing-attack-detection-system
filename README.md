# 🛡️ PhishGuard AI: AI-Powered Phishing Detection System

PhishGuard AI is a professional-grade cybersecurity platform designed for security analysts and end-users to detect phishing attacks in URLs and Emails. It leverages Machine Learning (Random Forest) for URL analysis and Rule-based AI for linguistic pattern recognition in emails.

## 🚀 Features

- **🌐 AI URL Scanner**: Analyzes subdomains, length, HTTPS status, and structural patterns using a trained ML model.
- **📧 Email NLP Analyzer**: Detects social engineering, urgent language, and suspicious keywords.
- **🧠 AI Explanation Engine**: Provides human-readable reasons for every detection.
- **📊 Security Dashboard**: Real-time stats, threat distribution charts, and risk levels.
- **📁 Scan History**: Persistent storage of past analyses for audit trails.
- **👤 JWT Authentication**: Secure login and signup system.
- **📄 Report Generation**: (Backend Ready) Generate PDF intelligence reports.

## 🧱 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite.
- **Machine Learning**: Scikit-Learn (Random Forest), Joblib.
- **DevOps**: Docker, Docker Compose.

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker (optional)

### ⚡ Single Command (Quickest)
If you have Node.js and Python installed:
```bash
npm install && npm start
```
Or simply double-click **`start.bat`** (Windows).

### Docker Setup
```bash
docker-compose up --build
```

## 🧪 Security & Best Practices
- Input validation using Pydantic.
- Password hashing with Bcrypt.
- JWT-based session management.
- CORS protection.

## 🧠 ML Model Performance
The system uses a Random Forest classifier trained on a balanced dataset of phishing and safe URLs.
- **Accuracy**: 100% (on synthetic demonstration dataset)
- **Features**: `url_len`, `subdomains`, `has_ip`, `special_chars`, `is_https`, `domain_len`.

---
*Created as a professional cybersecurity showcase project.*
