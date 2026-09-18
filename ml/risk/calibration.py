from typing import Dict, Any, Tuple

class RiskCalibrator:
    """
    Calibrates machine learning classifier probabilities into standard 0-100 agricultural risk index.
    """
    @staticmethod
    def calibrate(features: Dict[str, Any], raw_ml_prob: float = 0.75) -> Tuple[int, str, Dict[str, int], str]:
        disease_prob = features.get("disease_prob", 0.85)
        disease_risk = int(round(disease_prob * 90 if features.get("disease_risk_raw", 1) > 0 else disease_prob * 20))
        disease_risk = max(10, min(98, disease_risk))

        hum = features.get("humidity", 65.0)
        temp = features.get("temperature", 24.5)
        rain = features.get("rainfall", 120.0)
        
        # Weather risk component
        weather_risk = int(round(
            (max(0, hum - 70) * 1.2) + 
            (max(0, temp - 30) * 2.0) + 
            (max(0, 100 - rain) * 0.25)
        ))
        weather_risk = max(15, min(95, weather_risk + 30))

        # Soil risk component
        ph = features.get("soil_ph", 6.5)
        moisture = features.get("soil_moisture", 45.0)
        n = features.get("nitrogen", 140.0)
        
        ph_penalty = abs(ph - 6.5) * 18
        moisture_penalty = abs(moisture - 55) * 0.8
        soil_risk = int(round(25 + ph_penalty + moisture_penalty))
        soil_risk = max(10, min(90, soil_risk))

        # Environmental stress
        env_stress = int(round(0.4 * weather_risk + 0.4 * soil_risk + 0.2 * (100 - moisture)))
        env_stress = max(10, min(95, env_stress))

        # Overall risk composite
        overall_risk = int(round(
            0.40 * disease_risk + 
            0.25 * weather_risk + 
            0.20 * soil_risk + 
            0.15 * env_stress
        ))
        overall_risk = max(5, min(99, overall_risk))

        # Threshold categorization
        if overall_risk >= 75:
            level = "CRITICAL"
        elif overall_risk >= 50:
            level = "HIGH"
        elif overall_risk >= 25:
            level = "MEDIUM"
        else:
            level = "LOW"

        # Generate contextual explanation string
        explanations = []
        if hum > 75 and disease_risk > 50:
            explanations.append("High ambient humidity combined with detected leaf fungal patterns increases crop pathogen spread risk.")
        if ph < 5.8 or ph > 7.5:
            explanations.append(f"Suboptimal soil pH ({ph}) restricts nutrient uptake.")
        if moisture < 30:
            explanations.append("Low soil moisture level creates moisture stress.")
        if not explanations:
            explanations.append("Environmental parameters are within acceptable agricultural thresholds.")

        explanation_str = " ".join(explanations)

        components = {
            "disease_risk": disease_risk,
            "weather_risk": weather_risk,
            "soil_risk": soil_risk,
            "environmental_stress": env_stress
        }

        return overall_risk, level, components, explanation_str
