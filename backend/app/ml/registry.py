from typing import Dict, Any


class ModelRegistry:
    """
    Central registry managing all active ML services and overall system model state.
    Instantiated lazily on first request — NOT at import time — to avoid OOM on
    memory-constrained hosts (Render free tier 512 MB) where torch/xgboost loading
    during the import phase would crash before uvicorn can bind the port.
    """
    def __init__(self):
        from backend.app.ml.disease_service import DiseaseModelService
        from backend.app.ml.yield_service import YieldModelService
        from backend.app.ml.risk_service import RiskModelService

        self.disease_service = DiseaseModelService()
        self.yield_service = YieldModelService()
        self.risk_service = RiskModelService()

    def get_model_status(self) -> Dict[str, Any]:
        return {
            "disease_model": self.disease_service.metadata(),
            "yield_model": self.yield_service.metadata(),
            "risk_model": self.risk_service.metadata(),
            "active_mode": "production" if (
                self.disease_service.predictor.is_production and
                self.yield_service.predictor.is_production and
                self.risk_service.predictor.is_production
            ) else "demo"
        }


# Lazy singleton — loaded on first API call, never at import time
_registry: ModelRegistry = None

def get_registry() -> ModelRegistry:
    global _registry
    if _registry is None:
        _registry = ModelRegistry()
    return _registry


# Backward-compat alias used by existing endpoint imports
# (endpoints that do `from backend.app.ml.registry import model_registry`
#  will get a proxy object; migrate to get_registry() over time)
class _LazyRegistryProxy:
    """Transparent proxy that defers ModelRegistry construction to first attribute access."""
    def __getattr__(self, name):
        return getattr(get_registry(), name)

model_registry = _LazyRegistryProxy()
