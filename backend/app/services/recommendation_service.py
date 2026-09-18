from typing import Dict, Any, List

class RecommendationEngine:
    """
    Hybrid recommendation engine converting ML predictions and agronomic parameters 
    into actionable, prioritized farming guidance.
    """
    @staticmethod
    def generate(disease_res: Dict[str, Any], yield_res: Dict[str, Any], risk_res: Dict[str, Any], inputs: Dict[str, Any]) -> List[Dict[str, Any]]:
        recommendations = []

        disease_name = disease_res.get("disease", "Healthy")
        confidence = disease_res.get("confidence", 0.0)
        risk_score = risk_res.get("risk_score", 50)
        risk_level = risk_res.get("risk_level", "MEDIUM")
        
        crop = disease_res.get("detected_crop") or inputs.get("crop_type", "Crop")
        hum = float(inputs.get("humidity", 65.0))
        ph = float(inputs.get("soil_ph", 6.5))
        moisture = float(inputs.get("soil_moisture", 45.0))
        nitrogen = float(inputs.get("nitrogen", 140.0))

        # 1. Pathogen & Disease Recommendations
        if "healthy" not in disease_name.lower():
            recommendations.append({
                "priority": "HIGH",
                "category": "Pathogen Prevention & Monitoring",
                "action": f"Inspect nearby {crop} foliage for early symptoms of {disease_name}.",
                "timeframe": "Within 24 to 48 hours",
                "reason": f"The disease classifier detected a high-probability ({int(confidence*100)}%) {disease_name} pattern.",
                "safety_note": "Consult a certified local agronomic specialist before applying fungicides or chemical treatments.",
                "knowledge_ref": "FAO Crop Protection Standards - Section 4.2"
            })
            
            if hum > 75:
                recommendations.append({
                    "priority": "HIGH",
                    "category": "Canopy Moisture Management",
                    "action": "Adjust irrigation schedules to early morning to allow leaf surfaces to dry rapidly.",
                    "timeframe": "Immediate",
                    "reason": f"High humidity ({hum}%) promotes fungal spore germination.",
                    "safety_note": "Avoid overhead sprinkler irrigation when foliage fungal lesions are present.",
                    "knowledge_ref": "IPM Humidity & Leaf Wetness Guidelines"
                })
        else:
            recommendations.append({
                "priority": "LOW",
                "category": "Routine Field Monitoring",
                "action": "Maintain weekly routine crop health inspections.",
                "timeframe": "Weekly",
                "reason": "Crop foliage appears healthy with no visible pathogen symptoms.",
                "safety_note": "Continue standard preventive cultural practices.",
                "knowledge_ref": "General Good Agricultural Practices (GAP)"
            })

        # 2. Soil & Nutrient Recommendations
        if ph < 6.0:
            recommendations.append({
                "priority": "MEDIUM",
                "category": "Soil Conditioning",
                "action": "Apply agricultural lime (calcium carbonate) to gradually elevate soil pH toward 6.5 - 7.0.",
                "timeframe": "Next land preparation cycle",
                "reason": f"Current soil pH is {ph}, which restricts phosphorus and micronutrient uptake.",
                "safety_note": "Conduct a comprehensive laboratory soil test before applying soil amendments.",
                "knowledge_ref": "Soil Science Society Nutrient Availability Guide"
            })
        elif ph > 7.5:
            recommendations.append({
                "priority": "MEDIUM",
                "category": "Soil Conditioning",
                "action": "Incorporate organic compost or elemental sulfur to lower soil alkalinity.",
                "timeframe": "Next pre-sowing phase",
                "reason": f"Soil pH of {ph} reduces iron and zinc bio-availability.",
                "safety_note": "Apply organic amendments uniformly across crop beds.",
                "knowledge_ref": "Alkaline Soil Remediation Protocols"
            })

        if moisture < 35:
            recommendations.append({
                "priority": "HIGH" if risk_score > 60 else "MEDIUM",
                "category": "Irrigation Management",
                "action": f"Increase irrigation depth or drip duration for {crop}.",
                "timeframe": "Within 24 hours",
                "reason": f"Soil moisture level is low ({moisture}%), causing stomatal closure and yield stress.",
                "safety_note": "Ensure even water distribution to prevent localized root drought.",
                "knowledge_ref": "Smart Irrigation Scheduling Matrix"
            })

        if nitrogen < 90:
            recommendations.append({
                "priority": "MEDIUM",
                "category": "Fertigation & Nutrition",
                "action": "Apply split-dose bio-fertilizer or organic nitrogen supplement during active growth stage.",
                "timeframe": "Within 7 days",
                "reason": f"Soil nitrogen content ({nitrogen} mg/kg) is below recommended crop baseline.",
                "safety_note": "Avoid over-application of nitrogen near water runoff streams.",
                "knowledge_ref": "Balanced Nitrogen Management Framework"
            })

        # 3. Overall Risk Mitigations
        if risk_level in ["HIGH", "CRITICAL"]:
            recommendations.append({
                "priority": "HIGH",
                "category": "Comprehensive Risk Reduction",
                "action": "Isolate severely affected plant rows and establish micro-climate weather monitoring.",
                "timeframe": "Immediate (24 hours)",
                "reason": f"Overall composite crop risk score is critical ({risk_score}/100).",
                "safety_note": "Document crop conditions and share reports with extension officers.",
                "knowledge_ref": "AgriRisk Mitigation Protocol v2.1"
            })

        return recommendations
