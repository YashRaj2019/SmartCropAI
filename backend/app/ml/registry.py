from typing import Dict, Any
from backend.app.ml.disease_service import DiseaseModelService
from backend.app.ml.yield_service import YieldModelService
from backend.app.ml.risk_service import RiskModelService

class ModelRegistry:
    """
    Central registry managing all active ML services and overall system model state.
    """
    def __init__(self):
        self.disease_service = DiseaseModelService()
        self.yield_service = YieldModelService()
        self.risk_service = RiskModelService()

    def get_model_status(self) -> Dict[str, Any]:
        return {
            "disease_model": self.disease_service.metadata(),
            "yield_model": self.yield_service.metadata(),
            "risk_model": self.risk_service.metadata(),
            "active_mode": "production" if (
                self.disease_service.predictor.is_production and
                self.yield_service.predictor.is_production and
                self.risk_service.predictor.is_production
            ) else "demo"
        }

model_registry = ModelRegistry()
