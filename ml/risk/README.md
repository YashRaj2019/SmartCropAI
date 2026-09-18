# Crop Risk Prediction Pipeline

## Overview
Uses **XGBoost Classifier** paired with a multi-factor risk calibration layer (`calibration.py`) to compute a 0-100 risk score, risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), component breakdown (`disease_risk`, `weather_risk`, `soil_risk`, `environmental_stress`), and contextual explanations.

## Training Instructions
```bash
python ml/risk/train.py --config ml/risk/config.yaml
python ml/risk/evaluate.py
```
Outputs model artifact binary to `models/risk/model.joblib` and metadata to `models/risk/metadata.json`.
