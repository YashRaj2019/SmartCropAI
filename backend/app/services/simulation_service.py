from typing import Dict, Any
from backend.app.ml.registry import model_registry

class SimulationEngine:
    """
    Simulates agronomic 'What-If' scenarios by perturbing environmental and soil feature vectors.
    """
    @staticmethod
    def run_simulation(base_inputs: Dict[str, Any], perturbed_inputs: Dict[str, Any]) -> Dict[str, Any]:
        merged_inputs = {**base_inputs, **perturbed_inputs}

        # Run yield regressor with perturbed inputs
        sim_yield_res = model_registry.yield_service.predict(merged_inputs)
        
        # Prepare disease context
        disease_res = {
            "disease": base_inputs.get("disease", "Potato Late Blight"),
            "confidence": float(base_inputs.get("disease_confidence", 0.91)),
            "disease_status": base_inputs.get("disease_status", "Diseased")
        }
        
        # Add context for risk model
        merged_inputs.update({
            "disease_confidence": disease_res["confidence"],
            "disease_status": disease_res["disease_status"]
        })
        
        # Run risk classifier with perturbed inputs
        sim_risk_res = model_registry.risk_service.predict(merged_inputs)
        
        # Calculate Health Score (100 - risk_score)
        risk_score = sim_risk_res.get("risk_score", 50)
        crop_health_score = max(5, 100 - risk_score)

        # Baseline calculations if provided
        base_yield = float(base_inputs.get("predicted_yield", sim_yield_res["predicted_yield"]))
        base_risk = int(base_inputs.get("risk_score", risk_score))
        
        yield_delta = round(sim_yield_res["predicted_yield"] - base_yield, 2)
        risk_delta = risk_score - base_risk

        return {
            "simulation_mode": sim_yield_res.get("model_type", "demo"),
            "inputs": merged_inputs,
            "predicted_yield": sim_yield_res["predicted_yield"],
            "yield_unit": sim_yield_res.get("unit", "tons/hectare"),
            "yield_lower": sim_yield_res.get("lower_bound"),
            "yield_upper": sim_yield_res.get("upper_bound"),
            "yield_delta": yield_delta,
            "risk_score": risk_score,
            "risk_level": sim_risk_res["risk_level"],
            "risk_delta": risk_delta,
            "crop_health_score": crop_health_score,
            "components": sim_risk_res["components"],
            "explanation": sim_risk_res.get("explanation")
        }
