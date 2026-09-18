import os
import json
from PIL import Image
import torch
import torch.nn as F
import numpy as np

from ml.disease.dataset import ImageQualityAnalyzer
from ml.disease.transforms import get_val_transforms
from ml.disease.explain import GradCAMExplainer

class DiseasePredictor:
    def __init__(self, model_path: str = "models/disease/model.pt", labels_path: str = "ml/disease/labels.json"):
        self.model_path = model_path
        self.labels_path = labels_path
        self.labels = self._load_labels()
        self.model = None
        self.transforms = get_val_transforms(224)
        self.is_production = False
        self.load()

    def _load_labels(self):
        if os.path.exists(self.labels_path):
            with open(self.labels_path, 'r') as f:
                return json.load(f)
        return {
            "0": {"name": "Potato Late Blight", "crop": "Potato", "status": "Diseased", "symptoms": ["Dark lesions", "White mold"]},
            "1": {"name": "Potato Early Blight", "crop": "Potato", "status": "Diseased", "symptoms": ["Target spots", "Yellowing"]},
            "2": {"name": "Potato Healthy", "crop": "Potato", "status": "Healthy", "symptoms": ["Vibrant green"]}
        }

    def load(self) -> bool:
        if os.path.exists(self.model_path):
            try:
                # Set weights_only=False for complete PyTorch model architecture deserialization
                self.model = torch.load(self.model_path, map_location=torch.device('cpu'), weights_only=False)
                self.model.eval()
                self.is_production = True
                return True
            except Exception as e:
                print(f"[DiseasePredictor] Model load failed: {e}. Falling back to demo estimator.")
        self.is_production = False
        return False

    def predict(self, pil_image: Image.Image, crop_type: str = "Potato") -> dict:
        quality = ImageQualityAnalyzer.evaluate(pil_image)
        
        if self.is_production and self.model is not None:
            tensor = self.transforms(pil_image).unsqueeze(0)
            with torch.no_grad():
                outputs = self.model(tensor)
                probs = torch.softmax(outputs, dim=1)[0].numpy()
            
            top_idx = int(np.argmax(probs))
            disease_info = self.labels.get(str(top_idx), self.labels.get("0"))
            
            alternatives = []
            for idx, prob in enumerate(probs):
                lbl = self.labels.get(str(idx), {}).get("name", f"Class {idx}")
                alternatives.append({"label": lbl, "probability": float(round(prob, 4))})
            alternatives.sort(key=lambda x: x["probability"], reverse=True)
            
            confidence = float(round(probs[top_idx], 2))
            
            return {
                "model_type": "production",
                "model_name": "EfficientNet-B0 / MobileNetV2",
                "model_version": "1.0.0",
                "disease": disease_info.get("name", "Late Blight"),
                "confidence": confidence,
                "alternatives": alternatives[:3],
                "symptoms": disease_info.get("symptoms", ["Leaf discoloration", "Lesions"]),
                "image_quality": quality
            }
        else:
            crop_lower = crop_type.lower() if crop_type else "potato"
            if "tomato" in crop_lower:
                disease = "Tomato Early Blight"
                symptoms = ["Target-like concentric rings", "Lower leaf yellowing", "Stem lesions"]
                alts = [
                    {"label": "Tomato Early Blight", "probability": 0.88},
                    {"label": "Tomato Late Blight", "probability": 0.08},
                    {"label": "Tomato Healthy", "probability": 0.04}
                ]
            elif "corn" in crop_lower or "maize" in crop_lower:
                disease = "Corn Common Rust"
                symptoms = ["Cinnamon brown pustules", "Vein necrosis", "Spore spots"]
                alts = [
                    {"label": "Corn Common Rust", "probability": 0.92},
                    {"label": "Corn Healthy", "probability": 0.08}
                ]
            elif "wheat" in crop_lower:
                disease = "Wheat Stripe Rust"
                symptoms = ["Yellow-orange vein stripes", "Powdery spore masses"]
                alts = [
                    {"label": "Wheat Stripe Rust", "probability": 0.85},
                    {"label": "Wheat Healthy", "probability": 0.15}
                ]
            else:
                disease = "Potato Late Blight"
                symptoms = ["Leaf discoloration", "Irregular lesions", "Dark spots"]
                alts = [
                    {"label": "Potato Late Blight", "probability": 0.91},
                    {"label": "Potato Early Blight", "probability": 0.06},
                    {"label": "Potato Healthy", "probability": 0.03}
                ]

            return {
                "model_type": "demo",
                "model_name": "Demo Estimator (Rule-Based)",
                "model_version": "0.9.0-demo",
                "disease": disease,
                "confidence": 0.91,
                "alternatives": alts,
                "symptoms": symptoms,
                "image_quality": quality
            }

    def explain(self, pil_image: Image.Image, output_dir: str = "storage/gradcam") -> dict:
        os.makedirs(output_dir, exist_ok=True)
        explainer = GradCAMExplainer(self.model)
        tensor = self.transforms(pil_image).unsqueeze(0)
        heatmap = explainer.generate_heatmap(tensor)
        overlay = explainer.overlay_heatmap(pil_image, heatmap)
        
        heatmap_path = os.path.join(output_dir, "latest_gradcam.jpg")
        overlay.save(heatmap_path)
        
        return {
            "heatmap_path": heatmap_path,
            "explanation": "The highlighted bright yellow and red regions indicate the exact leaf areas that influenced the disease classification."
        }
