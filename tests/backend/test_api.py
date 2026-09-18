import os
import sys
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.main import app

class TestAPIEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("models", data)

    def test_models_metadata_endpoint(self):
        response = self.client.get("/api/models")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("disease_model", data)
        self.assertIn("yield_model", data)

    def test_weather_endpoint(self):
        response = self.client.get("/api/weather?location=London")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("temperature", data)
        self.assertIn("humidity", data)

    def test_history_endpoints(self):
        response = self.client.get("/api/history")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_yield_predict_api(self):
        payload = {
            "crop_type": "Potato",
            "temperature": 24.5,
            "humidity": 65.0,
            "rainfall": 120.0,
            "soil_ph": 6.5,
            "nitrogen": 140.0,
            "phosphorus": 60.0,
            "potassium": 50.0,
            "soil_moisture": 45.0,
            "wind_speed": 12.0
        }
        response = self.client.post("/api/yield/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predicted_yield", data)
        self.assertIn("lower_bound", data)

    def test_risk_predict_api(self):
        payload = {
            "crop_type": "Potato",
            "temperature": 24.5,
            "humidity": 65.0,
            "rainfall": 120.0,
            "soil_ph": 6.5,
            "nitrogen": 140.0,
            "phosphorus": 60.0,
            "potassium": 50.0,
            "soil_moisture": 45.0,
            "wind_speed": 12.0
        }
        response = self.client.post("/api/risk/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("risk_score", data)
        self.assertIn("risk_level", data)

if __name__ == "__main__":
    unittest.main()
