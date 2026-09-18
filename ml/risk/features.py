from typing import Dict, Any

def extract_risk_features(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extracts and normalizes features relevant to multi-factor crop risk analysis.
    """
    disease_prob = float(inputs.get("disease_confidence", inputs.get("confidence", 0.91)))
    disease_status = inputs.get("disease_status", "Diseased")
    
    # Disease risk factor
    disease_risk_raw = 0.0 if "healthy" in disease_status.lower() else disease_prob * 85.0
    
    # Environmental factors
    temp = float(inputs.get("temperature", 24.5))
    hum = float(inputs.get("humidity", 65.0))
    rain = float(inputs.get("rainfall", 120.0))
    wind = float(inputs.get("wind_speed", 12.0))
    
    # Soil factors
    ph = float(inputs.get("soil_ph", 6.5))
    moisture = float(inputs.get("soil_moisture", 45.0))
    n = float(inputs.get("nitrogen", 140.0))
    p = float(inputs.get("phosphorus", 60.0))
    k = float(inputs.get("potassium", 50.0))

    return {
        "disease_prob": disease_prob,
        "disease_risk_raw": disease_risk_raw,
        "temperature": temp,
        "humidity": hum,
        "rainfall": rain,
        "wind_speed": wind,
        "soil_ph": ph,
        "soil_moisture": moisture,
        "nitrogen": n,
        "phosphorus": p,
        "potassium": k
    }
