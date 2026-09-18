import os
import json
import argparse
import yaml
import numpy as np
import pandas as pd
import joblib
from datetime import datetime
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

def train_risk_model(config_path: str = "ml/risk/config.yaml"):
    print("=== Starting Crop Risk Classifier Training ===")
    
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
        
    output_path = config["paths"]["model_output"]
    metrics_path = config["paths"]["metrics_output"]
    metadata_path = output_path.replace("model.joblib", "metadata.json")
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    np.random.seed(42)
    n_samples = 400
    
    data = {
        "disease_prob": np.random.uniform(0.1, 0.99, n_samples),
        "disease_risk_raw": np.random.uniform(0, 85, n_samples),
        "temperature": np.random.uniform(15, 40, n_samples),
        "humidity": np.random.uniform(30, 98, n_samples),
        "rainfall": np.random.uniform(20, 250, n_samples),
        "wind_speed": np.random.uniform(2, 30, n_samples),
        "soil_ph": np.random.uniform(5.0, 8.5, n_samples),
        "soil_moisture": np.random.uniform(15, 85, n_samples),
        "nitrogen": np.random.uniform(40, 220, n_samples),
        "phosphorus": np.random.uniform(15, 110, n_samples),
        "potassium": np.random.uniform(15, 110, n_samples)
    }

    df = pd.DataFrame(data)
    
    # Binary High Risk Target (1 if high risk, 0 otherwise)
    risk_score = (
        df["disease_prob"] * 40 +
        (df["humidity"] > 75) * 20 +
        (df["temperature"] > 32) * 15 +
        np.abs(df["soil_ph"] - 6.5) * 10
    )
    df["high_risk_target"] = (risk_score >= 50).astype(int)

    X = df.drop(columns=["high_risk_target"])
    y = df["high_risk_target"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBClassifier(
        n_estimators=config["model"].get("n_estimators", 100),
        max_depth=config["model"].get("max_depth", 5),
        learning_rate=config["model"].get("learning_rate", 0.05),
        random_state=42
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = float(round(accuracy_score(y_test, y_pred), 3))
    prec = float(round(precision_score(y_test, y_pred, zero_division=0), 3))
    rec = float(round(recall_score(y_test, y_pred, zero_division=0), 3))
    f1 = float(round(f1_score(y_test, y_pred, zero_division=0), 3))

    print(f"Evaluation: Acc={acc}, Prec={prec}, Rec={rec}, F1={f1}")

    joblib.dump(model, output_path)
    print(f"Saved trained risk model artifact to {output_path}")

    metrics = {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1
    }
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    metadata = {
        "model_name": config["model"]["name"],
        "model_version": config["model"]["version"],
        "model_type": "risk_classifier",
        "dataset_version": "agri-risk-v1",
        "trained_at": datetime.now().isoformat(),
        "metrics": metrics,
        "status": "production"
    }
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    return metadata

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="ml/risk/config.yaml")
    args = parser.parse_args()
    train_risk_model(args.config)
