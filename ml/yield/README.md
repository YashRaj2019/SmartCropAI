# Crop Yield Regression Pipeline

## Overview
Uses **XGBoost Regressor** wrapped in a Scikit-Learn Pipeline (`ColumnTransformer`, `OneHotEncoder`, `StandardScaler`) to predict expected crop yield (tons/hectare) alongside lower and upper prediction intervals and SHAP feature importance.

## Input Features
- `crop_type`, `crop_variety`, `growth_stage`, `soil_type`, `irrigation_type`, `location`, `season`
- `temperature`, `humidity`, `rainfall`, `soil_ph`, `nitrogen`, `phosphorus`, `potassium`, `soil_moisture`, `wind_speed`, `historical_yield`

## Training Instructions
```bash
python ml/yield/train.py --config ml/yield/config.yaml
python ml/yield/evaluate.py
```
Outputs model pipeline binary to `models/yield/model.joblib` and metadata to `models/yield/metadata.json`.
