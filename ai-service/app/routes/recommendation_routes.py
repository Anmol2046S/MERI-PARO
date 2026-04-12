import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)
router = APIRouter()
recommendation_service = RecommendationService()


class RecommendationRequest(BaseModel):
    skills: List[Dict] = []
    target_role: Optional[str] = None
    missing_skills: List[str] = []
    career_score: Optional[float] = 0


@router.post("/generate")
async def generate_recommendations(request: RecommendationRequest):
    """Generate personalized career recommendations."""
    try:
        recommendations = recommendation_service.generate(
            skills=request.skills,
            target_role=request.target_role,
            missing_skills=request.missing_skills,
            career_score=request.career_score or 0,
        )
        return {
            "recommendations": recommendations,
            "count": len(recommendations),
        }
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
