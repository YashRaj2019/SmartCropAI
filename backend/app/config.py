import os
from pydantic import BaseModel
from typing import Optional

class Settings(BaseModel):
    PROJECT_NAME: str = "SmartCrop AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # ML settings
    ML_MODE: str = os.getenv("ML_MODE", "production")
    DISEASE_MODEL_PATH: str = os.getenv("DISEASE_MODEL_PATH", "models/disease/model.pt")
    YIELD_MODEL_PATH: str = os.getenv("YIELD_MODEL_PATH", "models/yield/model.joblib")
    RISK_MODEL_PATH: str = os.getenv("RISK_MODEL_PATH", "models/risk/model.joblib")
    ENABLE_EXPLANATIONS: bool = os.getenv("ENABLE_EXPLANATIONS", "true").lower() in ("true", "1", "yes")
    
    # Thresholds
    CONFIDENCE_THRESHOLD: float = 0.60
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "smartcrop_db")
    
    # Storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "storage")
    UPLOADS_DIR: str = os.path.join(STORAGE_DIR, "uploads")
    GRADCAM_DIR: str = os.path.join(STORAGE_DIR, "gradcam")
    
    # External APIs
    WEATHER_API_KEY: Optional[str] = os.getenv("WEATHER_API_KEY", None)

settings = Settings()

# Ensure storage directories exist
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
os.makedirs(settings.GRADCAM_DIR, exist_ok=True)
