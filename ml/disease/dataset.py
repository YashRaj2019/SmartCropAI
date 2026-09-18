import os
import cv2
import numpy as np
from PIL import Image
# torch/Dataset imported lazily — only needed for training scripts, not for inference

class ImageQualityAnalyzer:
    """
    Evaluates leaf image quality parameters: blurriness, brightness, and resolution.
    """
    @staticmethod
    def evaluate(pil_img: Image.Image) -> dict:
        np_img = np.array(pil_img.convert('RGB'))
        gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
        
        # 1. Blurriness assessment via Laplacian variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = min(1.0, laplacian_var / 300.0)
        
        # 2. Brightness / Contrast check
        mean_brightness = np.mean(gray)
        brightness_score = 1.0 - abs(mean_brightness - 128) / 128.0
        
        # 3. Resolution check
        h, w = gray.shape
        resolution_score = min(1.0, (h * w) / (500 * 500))
        
        overall_score = float(round(0.5 * blur_score + 0.3 * brightness_score + 0.2 * resolution_score, 2))
        
        status = "acceptable"
        if laplacian_var < 50:
            status = "blurry"
        elif mean_brightness < 30:
            status = "too_dark"
        elif mean_brightness > 225:
            status = "overexposed"
        elif h < 100 or w < 100:
            status = "low_resolution"
            
        return {
            "score": overall_score,
            "status": status,
            "laplacian_variance": float(round(laplacian_var, 2)),
            "brightness": float(round(mean_brightness, 2)),
            "resolution": f"{w}x{h}"
        }

class CropDiseaseDataset(Dataset):
    """
    Dataset loader for crop disease leaf images.
    """
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        image = Image.open(img_path).convert('RGB')
        label = self.labels[idx]

        if self.transform:
            image = self.transform(image)

        return image, torch.tensor(label, dtype=torch.long)
