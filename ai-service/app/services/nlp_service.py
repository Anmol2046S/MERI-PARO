import logging
from typing import Dict
from app.models.skill_extractor import SkillExtractor

logger = logging.getLogger(__name__)


class NLPService:
    """Orchestrates NLP-based resume parsing."""

    def __init__(self):
        self.skill_extractor = SkillExtractor()

    def parse_resume_text(self, text: str) -> Dict:
        """Parse raw resume text and extract structured data."""
        if not text or len(text.strip()) < 10:
            logger.warning("Empty or too short resume text received")
            return {
                "skills": [],
                "education": [],
                "experience": [],
                "contact": {},
                "ats_score": 0,
                "raw_text": "",
                "parsed_data": {},
            }

        logger.info(f"Parsing resume text ({len(text)} characters)")
        result = self.skill_extractor.extract_from_text(text)
        logger.info(f"Extracted {len(result['skills'])} skills, ATS score: {result['ats_score']}")
        return result

    def extract_skills_from_text(self, text: str):
        """Extract only skills from text (for JD analysis)."""
        return self.skill_extractor.extract_skills_only(text)
