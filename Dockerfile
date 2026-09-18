# ==============================================================================
# Stage 1: Build React Vite Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
# Build with relative/standard API path for unified container deployment
ENV VITE_API_URL=/api
RUN npm run build

# ==============================================================================
# Stage 2: Production Python Backend & Unified Runtime
# ==============================================================================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies for OpenCV, PyTorch, and ReportLab PDF font rasterization
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application, ML modules, and model artifacts
COPY backend ./backend
COPY ml ./ml
COPY models ./models

# Copy built frontend assets from Stage 1 into the location expected by main.py
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create necessary persistent storage directories
RUN mkdir -p storage/uploads storage/gradcam

EXPOSE 8000

# Start Uvicorn supporting dynamically assigned cloud ports (Render, Railway, Cloud Run, Heroku)
CMD sh -c "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
