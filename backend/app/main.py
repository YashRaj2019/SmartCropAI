import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from backend.app.config import settings
from backend.app.api.endpoints import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SmartCrop AI - Intelligent Agricultural Decision-Support Platform powered by Machine Learning & Deep Learning"
)

# CORS configuration for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file storage for uploaded leaf images and Grad-CAM visual heatmaps
storage_path = os.path.abspath(settings.STORAGE_DIR)
os.makedirs(storage_path, exist_ok=True)
app.mount("/storage", StaticFiles(directory=storage_path), name="storage")

# Include API Router
app.include_router(api_router, prefix=settings.API_PREFIX)

# Custom Exception Handler for structured API errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "SERVER_ERROR",
                "message": "An internal server error occurred while processing the request.",
                "details": str(exc)
            }
        }
    )

# Static frontend serving (for unified single-container deployment)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="frontend_assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Exclude reserved backend paths
        if full_path.startswith("api") or full_path.startswith("storage") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return JSONResponse(status_code=404, content={"error": {"code": "NOT_FOUND", "message": "Endpoint not found."}})
        
        target_file = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "project": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs_url": "/docs",
            "api_health": "/api/health"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
