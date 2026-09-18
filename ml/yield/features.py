from typing import List, Dict, Any

NUMERICAL_FEATURES: List[str] = [
    "temperature",
    "humidity",
    "rainfall",
    "soil_ph",
    "nitrogen",
    "phosphorus",
    "potassium",
    "soil_moisture",
    "wind_speed",
    "historical_yield"
]

CATEGORICAL_FEATURES: List[str] = [
    "crop_type",
    "crop_variety",
    "growth_stage",
    "soil_type",
    "irrigation_type",
    "location",
    "season"
]

DEFAULT_FEATURE_VALUES: Dict[str, Any] = {
    "crop_type": "Potato",
    "crop_variety": "Kufri Jyoti",
    "growth_stage": "Vegetative",
    "soil_type": "Loam",
    "temperature": 24.5,
    "humidity": 65.0,
    "rainfall": 120.0,
    "soil_ph": 6.5,
    "nitrogen": 140.0,
    "phosphorus": 60.0,
    "potassium": 50.0,
    "soil_moisture": 45.0,
    "wind_speed": 12.0,
    "irrigation_type": "Drip",
    "location": "Central Valley",
    "season": "Monsoon",
    "historical_yield": 3.6
}

def extract_features(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Extracts and validates yield features with fallback defaults."""
    processed = {}
    for feature in NUMERICAL_FEATURES:
        val = inputs.get(feature, DEFAULT_FEATURE_VALUES[feature])
        try:
            processed[feature] = float(val)
        except (ValueError, TypeError):
            processed[feature] = float(DEFAULT_FEATURE_VALUES[feature])
            
    for feature in CATEGORICAL_FEATURES:
        val = inputs.get(feature, DEFAULT_FEATURE_VALUES[feature])
        processed[feature] = str(val) if val else str(DEFAULT_FEATURE_VALUES[feature])
        
    return processed
