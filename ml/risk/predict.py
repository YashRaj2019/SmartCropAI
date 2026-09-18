import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any

from ml.risk.features import extract_risk_features
from ml.risk.calibration import RiskCalibrator

class RiskPredictor:
    def __init__(self, model_path: str = "models/risk/model.joblib"):
        self.model_path = model_path
        self.model = None
        self.is_production = False
        self.load()

    def load(self) -> bool:
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self.is_production = True
                return True
            except Exception as e:
                print(f"[RiskPredictor] Model load failed: {e}. Falling back to demo risk estimator.")
        self.is_production = False
        return False

    def predict(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        features = extract_risk_features(inputs)

        raw_ml_prob = 0.75
        if self.is_production and self.model is not None:
            df_feat = pd.DataFrame([features])
            try:
                probs = self.model.predict_proba(df_feat)[0]
                raw_ml_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
            except Exception:
                raw_ml_prob = 0.75

        risk_score, risk_level, components, explanation = RiskCalibrator.calibrate(features, raw_ml_prob)

        model_type = "production" if self.is_production else "demo"
        model_name = "XGBoostClassifier" if self.is_production else "Demo Risk Classifier"
        model_version = "1.0.0" if self.is_production else "0.9.0-demo"

        return {
            "model_type": model_type,
            "model_name": model_name,
            "model_version": model_version,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "components": components,
            "explanation": explanation
        }
