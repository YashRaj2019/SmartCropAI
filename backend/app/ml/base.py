from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseModelService(ABC):
    """
    Abstract Base Class interface for all machine learning models in SmartCrop AI.
    Provides standard lifecycle and evaluation methods for production and demo services.
    """
    
    @abstractmethod
    def load(self) -> bool:
        """Load model binary, preprocessors, and metadata from disk."""
        pass

    @abstractmethod
    def predict(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Perform model inference and return standardized prediction dictionary."""
        pass

    @abstractmethod
    def explain(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Generate explainable AI outputs (e.g. Grad-CAM visual heatmaps or SHAP feature importances)."""
        pass

    @abstractmethod
    def metadata(self) -> Dict[str, Any]:
        """Return versioning info, metrics, dataset version, and model architecture details."""
        pass
