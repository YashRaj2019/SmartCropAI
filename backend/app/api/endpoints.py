import os
import json
import uuid
import asyncio
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Query, Response
from fastapi.responses import FileResponse, JSONResponse
from PIL import Image

from backend.app.config import settings
from backend.app.schemas.analysis import FarmInputsSchema, SimulationRequest
from backend.app.ml.registry import model_registry
from backend.app.services.recommendation_service import RecommendationEngine
from backend.app.services.simulation_service import SimulationEngine
from backend.app.services.weather_service import WeatherService
from backend.app.services.history_service import history_service
from backend.app.services.report_service import PDFReportGenerator

router = APIRouter()

@router.get("/health")
def health_check():
    """Health check reporting system and model status."""
    status = model_registry.get_model_status()
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "mode": status["active_mode"],
        "models": status
    }

@router.get("/models")
def get_models_metadata():
    """Get metadata for all loaded machine learning models."""
    return model_registry.get_model_status()

@router.post("/analyze")
async def analyze_crop(
    image: Optional[UploadFile] = File(None),
    farm_inputs_json: str = Form(...)
):
    """
    Composite full-stack ML evaluation endpoint.
    Processes leaf image + farm inputs, runs disease classifier, Grad-CAM, yield regressor, risk classifier & recommendation engine.
    """
    try:
        inputs_dict = json.loads(farm_inputs_json)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail={"code": "INVALID_JSON", "message": "The farm inputs JSON payload is malformed."}
        )

    # Validate image or save temporary upload
    temp_image_path = None
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail={"code": "INVALID_IMAGE", "message": "File provided is not a valid image.", "details": "Accepted formats: JPG, PNG, WEBP"}
            )
        
        file_ext = os.path.splitext(image.filename)[1] or ".jpg"
        temp_filename = f"upload_{uuid.uuid4()}{file_ext}"
        temp_image_path = os.path.join(settings.UPLOADS_DIR, temp_filename)
        
        content = await image.read()
        with open(temp_image_path, "wb") as f:
            f.write(content)

    # 1. Run Disease Model
    disease_input = {"image": temp_image_path, "crop_type": inputs_dict.get("crop_type", "Potato")}
    disease_res = await asyncio.to_thread(model_registry.disease_service.predict, disease_input)
    
    # 2. Generate Grad-CAM Explanation
    gradcam_res = await asyncio.to_thread(model_registry.disease_service.explain, disease_input)
    gradcam_filename = os.path.basename(gradcam_res["heatmap_path"])
    disease_res["gradcam_url"] = f"/storage/gradcam/{gradcam_filename}"

    # 3. Prepare tabular input vector
    inputs_dict.update({
        "disease_confidence": disease_res["confidence"],
        "disease_status": "Healthy" if "healthy" in disease_res["disease"].lower() else "Diseased"
    })

    # 4. Run Yield Regressor
    yield_res = await asyncio.to_thread(model_registry.yield_service.predict, inputs_dict)

    # 5. Run Crop Risk Classifier & Calibration
    risk_res = await asyncio.to_thread(model_registry.risk_service.predict, inputs_dict)

    # 6. Generate Actionable Recommendations
    recommendations = RecommendationEngine.generate(disease_res, yield_res, risk_res, inputs_dict)

    # Crop Health score (100 - risk_score)
    crop_health_score = max(5, 100 - risk_res["risk_score"])

    # Composite Analysis Payload
    analysis_record = {
        "model_type": "production" if (disease_res["model_type"] == "production" and yield_res["model_type"] == "production") else "demo",
        "farm_inputs": inputs_dict,
        "disease_analysis": disease_res,
        "yield_analysis": yield_res,
        "risk_analysis": risk_res,
        "recommendations": recommendations,
        "crop_health_score": crop_health_score,
        "image_url": f"/storage/uploads/{os.path.basename(temp_image_path)}" if temp_image_path else None
    }

    # Save Analysis to Database / History
    saved_record = await asyncio.to_thread(history_service.save_analysis, analysis_record)
    return saved_record

@router.post("/disease/predict")
async def predict_disease(
    image: Optional[UploadFile] = File(None),
    crop_type: str = Form("Potato")
):
    """Standalone crop disease prediction endpoint."""
    temp_image_path = None
    if image:
        file_ext = os.path.splitext(image.filename)[1] or ".jpg"
        temp_image_path = os.path.join(settings.UPLOADS_DIR, f"disease_{uuid.uuid4()}{file_ext}")
        content = await image.read()
        with open(temp_image_path, "wb") as f:
            f.write(content)

    disease_res = await asyncio.to_thread(model_registry.disease_service.predict, {"image": temp_image_path, "crop_type": crop_type})
    gradcam_res = await asyncio.to_thread(model_registry.disease_service.explain, {"image": temp_image_path, "crop_type": crop_type})
    disease_res["gradcam_url"] = f"/storage/gradcam/{os.path.basename(gradcam_res['heatmap_path'])}"
    return disease_res

@router.post("/yield/predict")
def predict_yield(inputs: FarmInputsSchema):
    """Standalone crop yield regression endpoint."""
    return model_registry.yield_service.predict(inputs.model_dump())

@router.post("/risk/predict")
def predict_risk(inputs: FarmInputsSchema):
    """Standalone multi-factor crop risk evaluation endpoint."""
    return model_registry.risk_service.predict(inputs.model_dump())

@router.post("/recommendations")
def get_recommendations(payload: dict):
    """Generate recommendations given analysis components."""
    d_res = payload.get("disease_analysis", {})
    y_res = payload.get("yield_analysis", {})
    r_res = payload.get("risk_analysis", {})
    inputs = payload.get("farm_inputs", {})
    return RecommendationEngine.generate(d_res, y_res, r_res, inputs)

@router.post("/simulation")
def run_simulation(payload: SimulationRequest):
    """What-If crop scenario simulator endpoint."""
    return SimulationEngine.run_simulation(payload.base_inputs, payload.perturbed_inputs)

@router.get("/weather")
async def get_weather_forecast(location: str = Query("Central Valley")):
    """Weather forecast integration endpoint."""
    return await WeatherService.get_weather(location)

@router.get("/history")
def get_history():
    """Retrieve historical crop analysis records."""
    return history_service.get_all_history()

@router.get("/history/{analysis_id}")
def get_history_by_id(analysis_id: str):
    """Retrieve single historical analysis by ID."""
    record = history_service.get_analysis_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Analysis record not found."})
    return record

@router.delete("/history/{analysis_id}")
def delete_history_by_id(analysis_id: str):
    """Delete a historical analysis record."""
    success = history_service.delete_analysis(analysis_id)
    if not success:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Record not found to delete."})
    return {"message": "Analysis record deleted successfully."}

@router.get("/report/{analysis_id}")
def download_pdf_report(analysis_id: str):
    """Generate and download PDF crop evaluation report."""
    record = history_service.get_analysis_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Analysis not found for report generation."})
    
    report_filename = f"report_{analysis_id}.pdf"
    report_path = os.path.join(settings.STORAGE_DIR, report_filename)
    
    PDFReportGenerator.generate_pdf(record, report_path)
    return FileResponse(report_path, media_type="application/pdf", filename=f"SmartCrop_AI_Report_{analysis_id[:8]}.pdf")
