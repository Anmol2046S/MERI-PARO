import re
from typing import List, Dict
from app.utils.feature_extractor import FeatureExtractor
from app.utils.text_cleaner import TextCleaner


class SkillExtractor:
    """NLP-based skill extraction from resume text."""

    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        self.text_cleaner = TextCleaner()

    def extract_from_text(self, text: str) -> Dict:
        if not text or len(text.strip()) < 10:
            return {
                "skills": [],
                "education": [],
                "experience": [],
                "contact": {},
                "ats_score": 0,
                "raw_text": text or "",
                "parsed_data": {},
            }

        cleaned = self.text_cleaner.clean_text(text)
        sections = self.text_cleaner.extract_sections(text)

        skills = self.feature_extractor.extract_skills(text)
        education = self.feature_extractor.extract_education(text)
        experience = self.feature_extractor.extract_experience(text)
        contact = self.feature_extractor.extract_contact(text)
        ats_score = self.feature_extractor.calculate_ats_score(text, skills)

        return {
            "skills": skills,
            "education": education,
            "experience": experience,
            "contact": contact,
            "ats_score": ats_score,
            "raw_text": cleaned,
            "parsed_data": {
                "sections": {k: v[:500] for k, v in sections.items() if v},
                "word_count": len(text.split()),
                "skill_count": len(skills),
            },
        }

    def extract_skills_only(self, text: str) -> List[str]:
        return self.feature_extractor.extract_skills(text)
