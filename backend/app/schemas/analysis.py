from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class FarmInputsSchema(BaseModel):
    crop_type: str = Field(default="Potato")
    crop_variety: Optional[str] = Field(default="Kufri Jyoti")
    growth_stage: Optional[str] = Field(default="Vegetative")
    sowing_date: Optional[str] = Field(default="2025-02-15")
    location: Optional[str] = Field(default="Central Valley")
    season: Optional[str] = Field(default="Monsoon")
    
    soil_type: Optional[str] = Field(default="Loam")
    soil_ph: float = Field(default=6.5, ge=3.0, le=11.0)
    nitrogen: float = Field(default=140.0, ge=0.0, le=400.0)
    phosphorus: float = Field(default=60.0, ge=0.0, le=300.0)
    potassium: float = Field(default=50.0, ge=0.0, le=300.0)
    soil_moisture: float = Field(default=45.0, ge=0.0, le=100.0)
    
    temperature: float = Field(default=24.5, ge=-10.0, le=60.0)
    humidity: float = Field(default=65.0, ge=0.0, le=100.0)
    rainfall: float = Field(default=120.0, ge=0.0, le=1000.0)
    wind_speed: float = Field(default=12.0, ge=0.0, le=150.0)
    irrigation_type: Optional[str] = Field(default="Drip")

class DiseasePredictionResponse(BaseModel):
    model_type: str
    model_name: str
    model_version: str
    disease: str
    confidence: float
    alternatives: List[Dict[str, Any]]
    symptoms: List[str]
    image_quality: Dict[str, Any]
    gradcam_url: Optional[str] = None

class YieldPredictionResponse(BaseModel):
    model_type: str
    model_name: str
    model_version: str
    predicted_yield: float
    unit: str = "tons/hectare"
    lower_bound: float
    upper_bound: float
    confidence: float
    feature_importance: List[Dict[str, Any]]

class RiskPredictionResponse(BaseModel):
    model_type: str
    model_name: str
    model_version: str
    risk_score: int
    risk_level: str
    components: Dict[str, int]
    explanation: str

class RecommendationItem(BaseModel):
    priority: str
    category: str
    action: str
    timeframe: str
    reason: str
    safety_note: str
    knowledge_ref: Optional[str] = None

class FullAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    model_mode: str
    farm_inputs: Dict[str, Any]
    disease_analysis: DiseasePredictionResponse
    yield_analysis: YieldPredictionResponse
    risk_analysis: RiskPredictionResponse
    recommendations: List[RecommendationItem]
    crop_health_score: int

class SimulationRequest(BaseModel):
    base_inputs: Dict[str, Any]
    perturbed_inputs: Dict[str, Any]
