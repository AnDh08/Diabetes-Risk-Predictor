import logging

from fastapi import APIRouter, HTTPException

from backend.schemas.prediction import PredictionRequest, PredictionResponse
from backend.services.model import ModelService

router = APIRouter()
logger = logging.getLogger(__name__)

model_service = ModelService()

def _risk_level_from_probability(probability: float) -> str:
    if probability >= 0.5:
        return "high_risk"

    return "low_risk"

@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest) -> PredictionResponse:
    try:
        prediction, probability = model_service.predict(request)
    except Exception:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail="Prediction service is unavailable",
        )

    risk_level = _risk_level_from_probability(probability)

    return PredictionResponse(
        prediction=prediction,
        probability=probability,
        risk_level=risk_level,
    )