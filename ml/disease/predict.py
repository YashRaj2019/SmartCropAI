import os
import json
from PIL import Image
import torch
import torch.nn as nn
from torchvision import transforms

from ml.disease.dataset import ImageQualityAnalyzer
from ml.disease.explain import GradCAMExplainer

class DiseasePredictor:
    def __init__(self, model_path: str = "models/disease/model.pt", labels_path: str = "ml/disease/labels.json"):
        self.model_path = model_path
        self.labels_path = labels_path
        self.labels = self._load_labels()
        self.model = None
        self.transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self.is_production = False
        self.load()

    def _load_labels(self):
        if os.path.exists(self.labels_path):
            try:
                with open(self.labels_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[DiseasePredictor] Error loading labels from {self.labels_path}: {e}")
        return {}

    def load(self) -> bool:
        if os.path.exists(self.model_path):
            try:
                self.model = torch.load(self.model_path, map_location=torch.device('cpu'), weights_only=False)
                self.model.eval()
                self.is_production = True
                print(f"[DiseasePredictor] Successfully loaded production deep learning model from {self.model_path}")
                return True
            except Exception as e:
                print(f"[DiseasePredictor] Model load failed: {e}. Falling back to state dict checkpoint.")
        
        weights_path = "models/disease/mobilenetv2_plant.pth"
        if os.path.exists(weights_path):
            try:
                import torchvision.models as tv_models
                m = tv_models.mobilenet_v2()
                m.classifier[1] = nn.Sequential(nn.Dropout(0.2), nn.Linear(1280, 38))
                m.load_state_dict(torch.load(weights_path, map_location='cpu'))
                m.eval()
                self.model = m
                self.is_production = True
                return True
            except Exception as ex:
                print(f"[DiseasePredictor] Failed to load mobilenetv2_plant.pth: {ex}")
                
        self.is_production = False
        return False

    def predict(self, pil_image: Image.Image, crop_type: str = None) -> dict:
        quality = ImageQualityAnalyzer.evaluate(pil_image)
        crop_clean = (crop_type or "").strip()
        
        if self.model is None or not self.labels:
            return {
                "model_type": "demo",
                "model_name": "MobileNetV2 (PlantVillage 38-Class)",
                "model_version": "1.0.0",
                "disease": "Leaf Analysis Incomplete",
                "detected_crop": crop_clean or "Plant",
                "confidence": 0.50,
                "alternatives": [],
                "symptoms": ["Ensure leaf image is clear"],
                "image_quality": quality
            }

        rgb_image = pil_image.convert("RGB")
        tensor = self.transforms(rgb_image).unsqueeze(0)
        
        with torch.no_grad():
            logits = self.model(tensor)
            probabilities = torch.softmax(logits, dim=1)[0]

        all_top_probs, all_top_indices = torch.topk(probabilities, min(5, len(probabilities)))
        
        top_idx_str = str(all_top_indices[0].item())
        top_confidence = float(all_top_probs[0].item())
        top_info = self.labels.get(top_idx_str, {})
        
        primary_info = top_info
        primary_confidence = top_confidence

        alternatives = []
        seen_names = set()
        
        for p, idx in zip(all_top_probs, all_top_indices):
            k = str(idx.item())
            info = self.labels.get(k, {})
            name = info.get("name", f"Class {k}")
            if name not in seen_names:
                seen_names.add(name)
                alternatives.append({
                    "label": name,
                    "crop": info.get("crop", ""),
                    "status": info.get("status", "Diseased"),
                    "probability": float(round(p.item(), 4))
                })

        alternatives.sort(key=lambda x: x["probability"], reverse=True)

        return {
            "model_type": "production" if self.is_production else "demo",
            "model_name": "MobileNetV2 (PlantVillage 38-Class Deep CNN)",
            "model_version": "1.0.0",
            "disease": primary_info.get("name", "Unknown Foliar Condition"),
            "detected_crop": primary_info.get("crop", crop_clean or "Plant"),
            "status": primary_info.get("status", "Diseased"),
            "description": primary_info.get("description", ""),
            "confidence": float(round(min(0.99, max(0.50, primary_confidence)), 2)),
            "raw_confidence": float(round(primary_confidence, 4)),
            "alternatives": alternatives[:4],
            "symptoms": primary_info.get("symptoms", ["Inspect leaf for foliar lesions"]),
            "image_quality": quality
        }

    def explain(self, pil_image: Image.Image, output_dir: str = "storage/gradcam") -> dict:
        os.makedirs(output_dir, exist_ok=True)
        target_layer = None
        if hasattr(self.model, "features"):
            target_layer = self.model.features[-1]
            
        explainer = GradCAMExplainer(self.model, target_layer=target_layer)
        rgb_image = pil_image.convert("RGB")
        tensor = self.transforms(rgb_image).unsqueeze(0)
        tensor.requires_grad = True
        
        heatmap = explainer.generate_heatmap(tensor)
        overlay = explainer.overlay_heatmap(rgb_image, heatmap)
        
        heatmap_path = os.path.join(output_dir, "latest_gradcam.jpg")
        overlay.save(heatmap_path, quality=92)
        
        return {
            "heatmap_path": heatmap_path,
            "explanation": "Grad-CAM visual heatmap highlighting the exact convolutional activation regions of the leaf that influenced the deep learning diagnosis."
        }
