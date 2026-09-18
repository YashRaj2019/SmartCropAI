import os
import sys
import unittest
from PIL import Image

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.ml.disease_service import DiseaseModelService
from backend.app.ml.yield_service import YieldModelService
from backend.app.ml.risk_service import RiskModelService
from backend.app.services.recommendation_service import RecommendationEngine
from backend.app.services.simulation_service import SimulationEngine

class TestMLServices(unittest.TestCase):

    def test_disease_service(self):
        service = DiseaseModelService()
        img = Image.new("RGB", (224, 224), color="green")
        res = service.predict({"image": img, "crop_type": "Potato"})
        
        self.assertIn("disease", res)
        self.assertIn("confidence", res)
        self.assertIn("alternatives", res)
        self.assertIn("image_quality", res)
        self.assertTrue(0.0 <= res["confidence"] <= 1.0)

    def test_yield_service(self):
        service = YieldModelService()
        inputs = {
            "crop_type": "Potato",
            "temperature": 24.0,
            "rainfall": 120.0,
            "soil_ph": 6.5,
            "nitrogen": 140.0,
            "humidity": 65.0
        }
        res = service.predict(inputs)
        self.assertIn("predicted_yield", res)
        self.assertGreater(res["predicted_yield"], 0)
        self.assertIn("lower_bound", res)
        self.assertIn("upper_bound", res)
        self.assertIn("feature_importance", res)

    def test_risk_service(self):
        service = RiskModelService()
        inputs = {
            "disease_prob": 0.85,
            "humidity": 80.0,
            "temperature": 28.0,
            "soil_ph": 6.5,
            "soil_moisture": 40.0
        }
        res = service.predict(inputs)
        self.assertIn("risk_score", res)
        self.assertTrue(0 <= res["risk_score"] <= 100)
        self.assertIn(res["risk_level"], ["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        self.assertIn("components", res)

    def test_recommendation_engine(self):
        disease_res = {"disease": "Potato Late Blight", "confidence": 0.91}
        yield_res = {"predicted_yield": 3.82}
        risk_res = {"risk_score": 78, "risk_level": "HIGH"}
        inputs = {"crop_type": "Potato", "humidity": 82.0, "soil_ph": 5.5, "soil_moisture": 30.0, "nitrogen": 80.0}

        recs = RecommendationEngine.generate(disease_res, yield_res, risk_res, inputs)
        self.assertGreater(len(recs), 0)
        self.assertTrue(any(r["priority"] == "HIGH" for r in recs))
        self.assertTrue(any("safety_note" in r for r in recs))

    def test_simulation_engine(self):
        base_inputs = {"crop_type": "Potato", "temperature": 24.0, "predicted_yield": 3.8, "risk_score": 75}
        perturbed = {"temperature": 22.0, "soil_moisture": 60.0}
        
        sim_res = SimulationEngine.run_simulation(base_inputs, perturbed)
        self.assertIn("predicted_yield", sim_res)
        self.assertIn("risk_score", sim_res)
        self.assertIn("yield_delta", sim_res)

if __name__ == "__main__":
    unittest.main()
