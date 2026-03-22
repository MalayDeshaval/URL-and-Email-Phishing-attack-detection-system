# 🛡️ AI-Powered URL & Email Phishing Detection System

[![M-D Branding](https://img.shields.io/badge/Branding-M--D-blue.svg)](https://github.com/MalayDeshaval)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org/)
[![ML](https://img.shields.io/badge/Analysis-AI/ML-orange.svg)](https://scikit-learn.org/)

A sophisticated cybersecurity platform designed to detect and analyze phishing attempts in URLs and Email content using advanced Machine Learning and AI-driven explanations.

## ✨ Key Features

-   **🔍 URL Scanning**: Real-time analysis of suspicious links with deep-scan capabilities.
-   **📧 Email Analysis**: Detect phishing patterns in email content using natural language processing.
-   **🤖 AI Explanations**: Provides human-readable reasoning for why a target was flagged as phishing or safe.
-   **📊 Interactive Dashboard**: Dark-themed SOC dashboard with real-time statistics and scan history.
-   **🔐 Secure Auth**: Built-in user authentication (JWT) for private scan history management.
-   **🚀 Multi-Deployment**: Ready for local development, Docker environments, and Vercel serverless deployment.

## 🛠️ Tech Stack

### Frontend
-   **React 19** with **TypeScript**
-   **Vite** for lightning-fast builds
-   **Tailwind CSS 4** for modern, responsive styling
-   **Framer Motion** for smooth micro-animations
-   **Lucide React** for premium iconography
-   **Recharts** for data visualization

### Backend
-   **FastAPI** (Python) for high-performance API endpoints
-   **SQLAlchemy** with **SQLite/PostgreSQL** for data persistence
-   **Scikit-Learn** for Machine Learning model integration
-   **Pydantic** for robust data validation
-   **Serverless Ready**: Optimized for Vercel functions

## 🚀 Getting Started

### Prerequisites
-   Python 3.10+
-   Node.js 18+
-   Docker (optional)

### Local Development

#### 1. Backend Setup
- **Local**:
  ```bash
  cd backend/app
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  python main.py
  ```
- **Live API (Railway)**: [https://url-and-email-phishing-attack-detection-system-production.up.railway.app](https://url-and-email-phishing-attack-detection-system-production.up.railway.app)
*Backend will run on `http://localhost:8001`*

#### 2. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```
*Frontend will run on `http://localhost:5173`*

### 🐳 Docker Deployment
```bash
docker-compose up --build
```

### ☁️ Vercel Deployment
The project is pre-configured for Vercel. Simply connect your GitHub repository to Vercel and it will auto-detect the configuration.

## 📂 Project Structure

```text
├── api/                # Vercel Serverless Functions
├── backend/
│   └── app/            # FastAPI Application Logic
│       ├── ai_engine.py      # AI Decision Logic
│       ├── ml_trainer.py     # ML Model Training
│       ├── scanner_service.py # Core Scanning Logic
│       └── main.py           # API Entry Point
├── src/                # React Frontend Source
├── public/             # Static Assets
├── docker-compose.yml  # Container Orchestration
└── vercel.json         # Vercel Configuration
```

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---
Developed with ❤️ by [Malay Deshaval](https://github.com/MalayDeshaval)
