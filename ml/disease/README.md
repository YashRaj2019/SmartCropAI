# Crop Disease Classification Pipeline

## Overview
Uses transfer learning with **MobileNetV2 / EfficientNet-B0** in PyTorch to classify leaf images into healthy vs diseased categories (Late Blight, Early Blight, Yellow Leaf Curl, Rust, Scab, etc.).

## Components
- `dataset.py`: PyTorch custom dataset & `ImageQualityAnalyzer` (blurriness, contrast, resolution score).
- `transforms.py`: Training data augmentations & validation normalization.
- `explain.py`: Grad-CAM heatmap visualization extractor.
- `predict.py`: Standard inference service with temperature calibration & demo fallback.
- `train.py`: Training script with checkpointing and metadata generation.
- `evaluate.py`: Evaluation metrics summary.

## Training Instructions
```bash
python ml/disease/train.py --config ml/disease/config.yaml
python ml/disease/evaluate.py
```
Outputs model binary to `models/disease/model.pt` and metadata to `models/disease/metadata.json`.
