import logging
import time
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from app.models.job_predictor import JobPredictor

logger = logging.getLogger(__name__)
router = APIRouter()
baseline_predictor = JobPredictor()


class PredictionRequest(BaseModel):
    skills: List[str]
    experience: Optional[List[dict]] = []
    education: Optional[List[dict]] = []
    raw_text: Optional[str] = ""
    model_type: Optional[str] = "ml"


@router.post("/job-roles")
async def predict_job_roles(request: PredictionRequest, req: Request):
    """Predict best-fit job roles based on skills and resume data."""
    try:
        start_time = time.time()
        model_type = request.model_type or "ml"

        if model_type == "baseline":
            predictions = baseline_predictor.predict(request.skills)
            model_used = "baseline"

        elif model_type == "deep_learning":
            dl_service = getattr(req.app.state, "dl_service", None)
            if dl_service:
                result = dl_service.predict(request.skills, request.raw_text or "")
                predictions = result.get("predictions", [])
                model_used = "deep_learning"
            else:
                predictions = baseline_predictor.predict(request.skills)
                model_used = "baseline_fallback"

        else:  # ml (default)
            ml_service = getattr(req.app.state, "ml_service", None)
            if ml_service:
                predictions = ml_service.predict(request.skills, request.raw_text or "")
                model_used = "ml_ensemble"
            else:
                predictions = baseline_predictor.predict(request.skills)
                model_used = "baseline_fallback"

        processing_time = round((time.time() - start_time) * 1000, 2)

        return {
            "predictions": predictions[:5],
            "model_used": model_used,
            "total_skills_analyzed": len(request.skills),
            "processing_time_ms": processing_time,
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
