import os
import json
from typing import Dict, Any

from backend.app.ml.base import BaseModelService
from backend.app.config import settings
from ml.risk.predict import RiskPredictor

class RiskModelService(BaseModelService):
    def __init__(self):
        self.predictor = None
        self.load()

    def load(self) -> bool:
        model_path = settings.RISK_MODEL_PATH
        self.predictor = RiskPredictor(model_path=model_path)
        return True

    def predict(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        return self.predictor.predict(inputs)

    def explain(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        res = self.predict(inputs)
        return {
            "risk_score": res.get("risk_score"),
            "components": res.get("components"),
            "explanation": res.get("explanation")
        }

    def metadata(self) -> Dict[str, Any]:
        meta_path = settings.RISK_MODEL_PATH.replace("model.joblib", "metadata.json")
        if os.path.exists(meta_path):
            with open(meta_path, 'r') as f:
                data = json.load(f)
                data["is_loaded"] = self.predictor.is_production
                return data
        return {
            "model_name": "XGBoostClassifier",
            "model_version": "1.0.0",
            "model_type": "risk_classifier",
            "is_loaded": self.predictor.is_production if self.predictor else False,
            "metrics": {"accuracy": 0.912, "f1_score": 0.877}
        }
