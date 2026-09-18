import sys
import os
import importlib

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def train_all():
    print("==================================================")
    print("SmartCrop AI - Generating Base Production Models")
    print("==================================================")
    
    disease_train = importlib.import_module("ml.disease.train")
    disease_meta = disease_train.train_disease_model()
    print("--------------------------------------------------")
    
    yield_train = importlib.import_module("ml.yield.train")
    yield_meta = yield_train.train_yield_model()
    print("--------------------------------------------------")
    
    risk_train = importlib.import_module("ml.risk.train")
    risk_meta = risk_train.train_risk_model()
    print("==================================================")
    print("All production model artifacts generated successfully!")

if __name__ == "__main__":
    train_all()
