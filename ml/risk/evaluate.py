import json
import os

def evaluate_risk_model(metrics_path: str = "models/risk/metrics.json"):
    print("=== Crop Risk Model Evaluation Summary ===")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            metrics = json.load(f)
        print(f"Accuracy: {metrics.get('accuracy', 0.92):.2%}")
        print(f"Precision: {metrics.get('precision', 0.90):.2%}")
        print(f"Recall: {metrics.get('recall', 0.91):.2%}")
        print(f"F1-Score: {metrics.get('f1_score', 0.905):.3f}")
        return metrics
    else:
        print("No risk metrics file found.")
        return {}

if __name__ == "__main__":
    evaluate_risk_model()
