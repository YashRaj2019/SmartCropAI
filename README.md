# SmartCrop AI 🌾🤖

> **Intelligent Agricultural Decision-Support Platform** powered by Deep Learning, Machine Learning, Explainable AI (XAI), and Counterfactual Agronomic Simulation.

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-eb6323.svg)](https://xgboost.readthedocs.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![CI Pipeline](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg?logo=github-actions&logoColor=white)](https://github.com/)

---

## 📖 Overview

**SmartCrop AI** is an end-to-end precision agriculture platform that empowers farmers, agricultural extension officers, agronomists, and researchers to make data-driven crop management decisions. By combining multi-spectral leaf computer vision, tabular biophysical crop modeling, and explainable AI, SmartCrop AI translates raw field telemetry and imagery into actionable, prioritized guidance.

### ✨ Key Capabilities

* 🔬 **Deep Learning Disease Detection**: High-accuracy leaf pathogen classification using MobileNetV2 / EfficientNet-B0 backbones across multiple crops (Potato, Tomato, Corn, Wheat, Rice).
* 👁️ **Explainable AI (Grad-CAM Heatmaps)**: Visual gradient-weighted class activation heatmaps showing the exact pixel regions triggering disease diagnoses, paired with automated image quality verification (blur, brightness, resolution).
* 📈 **Biophysical Crop Yield Regression**: Multi-feature XGBoost regressor predicting expected metric yield (tons/hectare) alongside empirical confidence intervals ($8\text{--}10\%$) and feature importance directions.
* 🛡️ **Multi-Factor Risk Assessment & Health Index**: Calibrated risk classification decomposing environmental vulnerability into Disease Risk ($40\%$), Weather Risk ($25\%$), Soil Risk ($20\%$), and Environmental Stress ($15\%$).
* 🧪 **Interactive Counterfactual "What-If" Simulator**: Real-time interactive simulation allowing users to perturb soil moisture, fertilization, irrigation, or temperature to observe yield and risk deltas before executing field interventions.
* 📋 **FAO-Compliant Agronomic Guidance**: Prescriptive, prioritized recommendations specifying timelines, agronomic rationales, and safety guidelines.
* 📄 **Automated PDF Agronomic Reports**: Server-side branded PDF report compilation via ReportLab with embedded charts, diagnostics, and field data.
* 📊 **Side-by-Side Multi-Temporal Comparison**: Longitudinal comparative analytics across different crop cycles and field coordinates.
* 🌤️ **Live Meteorologic Integration**: Real-time weather forecasting via OpenWeatherMap API with automatic realistic fallback.

---

## 🏗️ Architecture

```
                                  [ React 19 + Vite Frontend ]
                                  (Tailwind CSS, Lucide, Recharts)
                                                │
                                                │ REST API / JSON / Multipart
                                                ▼
                                    [ FastAPI Backend Server ]
                     ┌──────────────────────────┼──────────────────────────┐
                     ▼                          ▼                          ▼
            [ Disease Engine ]           [ Yield Engine ]           [ Risk Engine ]
           MobileNetV2 / Grad-CAM         XGBoost Pipeline          XGBoost + Calibrator
                     │                          │                          │
                     └──────────────────────────┼──────────────────────────┘
                                                ▼
                                    [ Recommendation Engine ]
                                                │
                                    [ Dual Persistence ]
                               MongoDB (Live)  ──► JSON DB (Fallback)
```

---

## 📁 Project Structure

```
SmartCropAI/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions automated test & build CI
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py       # REST API endpoints & route handlers
│   │   ├── ml/
│   │   │   ├── base.py            # Abstract ML service interface
│   │   │   ├── disease_service.py # Computer vision service wrapper
│   │   │   ├── yield_service.py   # Yield regression service wrapper
│   │   │   ├── risk_service.py    # Risk assessment service wrapper
│   │   │   └── registry.py        # Centralized model registry singleton
│   │   ├── schemas/
│   │   │   └── analysis.py        # Pydantic v2 validation contracts
│   │   ├── services/
│   │   │   ├── history_service.py # Dual-persistence (MongoDB + JSON fallback)
│   │   │   ├── recommendation_service.py # Agronomic rules engine
│   │   │   ├── report_service.py  # Server-side PDF report generator
│   │   │   ├── simulation_service.py # What-If scenario counterfactuals
│   │   │   └── weather_service.py # Weather API integration
│   │   ├── config.py              # Application settings & environment loader
│   │   └── main.py                # FastAPI app instance, CORS & SPA server
│   └── requirements.txt           # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI widgets, gauges, and panels
│   │   ├── pages/                 # Full view pages (Analyze, Results, Compare, etc.)
│   │   ├── services/api.js        # Axios API client
│   │   └── App.jsx                # Router & layout shell
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js             # Vite configuration
│   └── vercel.json                # Vercel SPA rewrite configuration
├── ml/
│   ├── disease/                   # Disease training, transforms, and Grad-CAM
│   ├── yield/                     # Yield training, preprocessing, and features
│   ├── risk/                      # Risk classifier training and calibration
│   └── train_all_demo_models.py   # One-click model generation script
├── models/                        # Serialized PyTorch (.pt) and joblib pipelines
├── storage/                       # Uploaded images, Grad-CAM overlays, PDF reports
├── tests/
│   ├── backend/test_api.py        # FastAPI endpoint test suite
│   └── ml/test_models.py          # Machine learning unit test suite
├── Dockerfile                     # Multi-stage production container build
├── docker-compose.yml             # Full-stack Docker orchestration
├── render.yaml                    # One-click Render deployment blueprint
├── .env.example                   # Environment variable template
└── README.md                      # Project documentation
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
* **Python**: 3.10, 3.11, 3.12, or 3.13
* **Node.js**: 18+ or 20+ (with npm)
* **Git**

### 2. Backend Setup
```bash
# Navigate to repository root
cd SmartCropAI

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the FastAPI backend server
uvicorn backend.app.main:app --reload --port 8000
```
* Backend API will be live at: `http://localhost:8000`
* Interactive API Documentation (Swagger UI): `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd SmartCropAI/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
* Frontend application will be live at: `http://localhost:5173`

---

## 🐳 Docker & Docker Compose Setup

Run the entire application (Backend, React frontend, and MongoDB) in containers with a single command:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

Access the unified platform at: `http://localhost:8000`

---

## 🧪 Running Unit Tests

SmartCrop AI comes with complete automated test coverage:

```bash
# Test API endpoints
python -m unittest tests/backend/test_api.py

# Test Machine Learning services & engines
python -m unittest tests/ml/test_models.py
```

---

## 📤 Pushing to GitHub

To push your local codebase to a new GitHub repository:

1. **Create a new repository** on [GitHub](https://github.com/new) (e.g. `smartcrop-ai`). Do **not** initialize with a README or .gitignore (we already created them).
2. Run the following commands in your project root:

```bash
# Initialize git repository
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: complete production-ready SmartCrop AI platform"

# Set default branch to main
git branch -M main

# Link your GitHub remote (replace with your repository URL)
git remote add origin https://github.com/<your-username>/smartcrop-ai.git

# Push code to GitHub
git push -u origin main
```

---

## 🌐 Free Cloud Deployment Guide

SmartCrop AI is pre-configured for instant zero-cost or low-cost deployment across multiple cloud platforms:

### Option 1: Render (Recommended - Unified Container)
1. Fork or push this repository to your GitHub account.
2. Sign up on [Render.com](https://render.com/).
3. Click **New +** -> **Blueprint** and connect your repository.
4. Render will automatically detect [`render.yaml`](./render.yaml), build the multi-stage Dockerfile, and launch the service with a public `https://<your-app>.onrender.com` URL.

### Option 2: Railway / Fly.io / Cloud Run
* **Railway**: Click **New Project** -> **Deploy from GitHub repo** -> Select this repository. Railway will detect the `Dockerfile` and expose the web service automatically.
* **Google Cloud Run**: Run `gcloud run deploy smartcrop-ai --source . --port 8000 --allow-unauthenticated`.

### Option 3: Hugging Face Spaces (Docker SDK)
1. Create a new Space on [Hugging Face](https://huggingface.co/spaces) and choose **Docker** as the SDK.
2. Add this repository as the remote or push the code.
3. Hugging Face Spaces will build the multi-stage container and expose the application on port `8000`.

### Option 4: Decoupled Deployment (Vercel + Backend Host)
* **Frontend on Vercel**: Import the `frontend` subdirectory on [Vercel](https://vercel.com/), add environment variable `VITE_API_URL=https://<your-backend-url>/api`. Vercel automatically honors `frontend/vercel.json` for routing.
* **Backend on Render / Railway**: Deploy the backend container exposing the API.

---

## 📡 API Reference Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check and model loading status |
| `GET` | `/api/models` | Active model metadata, versions, and validation metrics |
| `POST` | `/api/analyze` | Composite analysis: leaf image + tabular farm telemetry |
| `POST` | `/api/disease/predict` | Standalone crop leaf disease detection & Grad-CAM overlay |
| `POST` | `/api/yield/predict` | Standalone crop yield regression with confidence bounds |
| `POST` | `/api/risk/predict` | Standalone crop risk scoring and component breakdown |
| `POST` | `/api/simulation` | What-If agronomic scenario perturbation |
| `GET` | `/api/weather` | Meteorologic forecast integration |
| `GET` | `/api/history` | Historical crop evaluation logs |
| `GET` | `/api/history/{id}` | Retrieve single analysis record by ID |
| `DELETE`| `/api/history/{id}` | Delete analysis record |
| `GET` | `/api/report/{id}` | Download branded agronomic PDF report |

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
