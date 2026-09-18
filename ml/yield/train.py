import os
import json
import argparse
import yaml
import numpy as np
import pandas as pd
import joblib
from datetime import datetime
from xgboost import XGBRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from .preprocessing import build_preprocessing_pipeline
from .features import NUMERICAL_FEATURES, CATEGORICAL_FEATURES

def train_yield_model(config_path: str = "ml/yield/config.yaml"):
    print("=== Starting Crop Yield Regressor Training ===")
    
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
        
    output_path = config["paths"]["model_output"]
    metrics_path = config["paths"]["metrics_output"]
    metadata_path = output_path.replace("model.joblib", "metadata.json")
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    np.random.seed(42)
    n_samples = 500
    
    crops = ["Potato", "Tomato", "Corn", "Wheat", "Rice"]
    varieties = ["Kufri Jyoti", "Roma", "Hybrid-X", "HD-2967", "Basmati"]
    stages = ["Vegetative", "Flowering", "Fruiting", "Maturation"]
    soils = ["Loam", "Clay", "Sandy", "Silt"]
    irrigations = ["Drip", "Sprinkler", "Flood", "Rainfed"]
    seasons = ["Kharif", "Rabi", "Zaid", "Monsoon"]
    locations = ["North Region", "Central Valley", "South Plains", "East Coast"]

    data = {
        "crop_type": np.random.choice(crops, n_samples),
        "crop_variety": np.random.choice(varieties, n_samples),
        "growth_stage": np.random.choice(stages, n_samples),
        "soil_type": np.random.choice(soils, n_samples),
        "irrigation_type": np.random.choice(irrigations, n_samples),
        "location": np.random.choice(locations, n_samples),
        "season": np.random.choice(seasons, n_samples),
        "temperature": np.random.uniform(15, 38, n_samples),
        "humidity": np.random.uniform(30, 95, n_samples),
        "rainfall": np.random.uniform(40, 250, n_samples),
        "soil_ph": np.random.uniform(5.5, 8.0, n_samples),
        "nitrogen": np.random.uniform(50, 200, n_samples),
        "phosphorus": np.random.uniform(20, 100, n_samples),
        "potassium": np.random.uniform(20, 100, n_samples),
        "soil_moisture": np.random.uniform(20, 80, n_samples),
        "wind_speed": np.random.uniform(5, 25, n_samples),
        "historical_yield": np.random.uniform(2.0, 5.5, n_samples)
    }

    df = pd.DataFrame(data)
    
    base_target = np.where(df["crop_type"] == "Corn", 5.0,
                  np.where(df["crop_type"] == "Tomato", 4.2,
                  np.where(df["crop_type"] == "Potato", 3.8, 3.2)))
                  
    yield_target = (
        base_target
        + (df["rainfall"] / 150.0) * 0.5
        + (df["nitrogen"] / 150.0) * 0.4
        - np.abs(df["temperature"] - 24.0) * 0.05
        - np.abs(df["soil_ph"] - 6.5) * 0.2
        + np.random.normal(0, 0.15, n_samples)
    )
    df["yield"] = np.clip(yield_target, 0.8, 8.5)

    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df["yield"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preprocessor = build_preprocessing_pipeline()
    model = XGBRegressor(
        n_estimators=config["model"].get("n_estimators", 100),
        max_depth=config["model"].get("max_depth", 6),
        learning_rate=config["model"].get("learning_rate", 0.05),
        random_state=42
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', model)
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    mae = float(round(mean_absolute_error(y_test, y_pred), 3))
    rmse = float(round(root_mean_squared_error(y_test, y_pred), 3))
    r2 = float(round(r2_score(y_test, y_pred), 3))

    print(f"Evaluation: MAE={mae}, RMSE={rmse}, R2={r2}")

    joblib.dump(pipeline, output_path)
    print(f"Saved trained yield model pipeline to {output_path}")

    metrics = {
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
        "sample_count": n_samples
    }
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    metadata = {
        "model_name": config["model"]["name"],
        "model_version": config["model"]["version"],
        "model_type": "yield_regressor",
        "dataset_version": "agri-yield-v1",
        "trained_at": datetime.now().isoformat(),
        "metrics": metrics,
        "status": "production"
    }
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    return metadata

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="ml/yield/config.yaml")
    args = parser.parse_args()
    train_yield_model(args.config)
