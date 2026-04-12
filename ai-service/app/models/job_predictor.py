import json
import os
import logging
from typing import List, Dict
import numpy as np

logger = logging.getLogger(__name__)


class JobPredictor:
    """Baseline job prediction using keyword matching and rule-based scoring."""

    def __init__(self):
        self._role_requirements = None
        self._load_roles()

    def _load_roles(self):
        roles_path = os.path.join(
            os.path.dirname(__file__), "..", "data", "job_roles.json"
        )
        try:
            with open(roles_path, "r") as f:
                self._role_requirements = json.load(f)
        except FileNotFoundError:
            self._role_requirements = self._default_roles()

    def _default_roles(self) -> dict:
        return {
            "Full Stack Developer": {
                "required": ["JavaScript", "React", "Node.js", "SQL", "Git", "HTML", "CSS", "REST API"],
                "optional": ["TypeScript", "Docker", "AWS", "MongoDB", "GraphQL", "Next.js"],
                "weight": 1.0,
            },
            "Frontend Developer": {
                "required": ["JavaScript", "React", "HTML", "CSS", "Git", "REST API"],
                "optional": ["TypeScript", "Vue.js", "Angular", "TailwindCSS", "Next.js", "Figma"],
                "weight": 1.0,
            },
            "Backend Developer": {
                "required": ["Node.js", "Python", "SQL", "REST API", "Git", "Docker"],
                "optional": ["Java", "Go", "Kubernetes", "AWS", "MongoDB", "Redis", "Microservices"],
                "weight": 1.0,
            },
            "Data Scientist": {
                "required": ["Python", "Machine Learning", "SQL", "Data Analysis", "Scikit-learn"],
                "optional": ["TensorFlow", "PyTorch", "R", "Deep Learning", "NLP", "Tableau", "Apache Spark"],
                "weight": 1.0,
            },
            "ML Engineer": {
                "required": ["Python", "Machine Learning", "TensorFlow", "Docker", "SQL", "Git"],
                "optional": ["PyTorch", "Kubernetes", "AWS", "Deep Learning", "NLP", "Scikit-learn"],
                "weight": 1.0,
            },
            "DevOps Engineer": {
                "required": ["Docker", "Kubernetes", "Linux", "CI/CD", "AWS", "Git", "Terraform"],
                "optional": ["Ansible", "Jenkins", "Python", "Go", "Azure"],
                "weight": 1.0,
            },
            "Cloud Architect": {
                "required": ["AWS", "Docker", "Kubernetes", "Terraform", "Linux", "Microservices"],
                "optional": ["Azure", "Google Cloud", "Python"],
                "weight": 1.0,
            },
            "Mobile Developer": {
                "required": ["JavaScript", "React Native", "Git", "REST API"],
                "optional": ["Swift", "Kotlin", "Flutter", "Firebase", "TypeScript"],
                "weight": 1.0,
            },
            "UI/UX Designer": {
                "required": ["Figma", "HTML", "CSS"],
                "optional": ["Adobe XD", "Sketch", "JavaScript", "React"],
                "weight": 1.0,
            },
            "Data Analyst": {
                "required": ["SQL", "Python", "Data Analysis", "Excel"],
                "optional": ["Tableau", "Power BI", "R", "Machine Learning", "Apache Spark"],
                "weight": 1.0,
            },
            "AI Engineer": {
                "required": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "NLP", "Docker"],
                "optional": ["PyTorch", "Computer Vision", "AWS", "Kubernetes", "FastAPI"],
                "weight": 1.0,
            },
            "QA Engineer": {
                "required": ["Testing", "Git", "CI/CD"],
                "optional": ["Python", "JavaScript", "Docker", "JIRA", "Postman"],
                "weight": 0.8,
            },
        }

    def predict(self, skills: List[str]) -> List[Dict]:
        if not skills:
            return [{"role": "Entry Level Developer", "confidence": 0.1, "matched_skills": []}]

        normalized_skills = set(s.lower() for s in skills)
        results = []

        for role, requirements in self._role_requirements.items():
            required = [s.lower() for s in requirements["required"]]
            optional = [s.lower() for s in requirements.get("optional", [])]
            weight = requirements.get("weight", 1.0)

            required_matches = [s for s in required if s in normalized_skills]
            optional_matches = [s for s in optional if s in normalized_skills]

            if len(required) == 0:
                continue

            required_ratio = len(required_matches) / len(required)
            optional_ratio = len(optional_matches) / len(optional) if optional else 0

            score = (required_ratio * 0.7 + optional_ratio * 0.3) * weight

            if len(required_matches) + len(optional_matches) >= 5:
                score *= 1.1

            orig_required_matches = [s for s in skills if s.lower() in required_matches]
            orig_optional_matches = [s for s in skills if s.lower() in optional_matches]

            results.append({
                "role": role,
                "confidence": round(min(score, 1.0), 4),
                "matched_skills": orig_required_matches + orig_optional_matches,
                "required_match_pct": round(required_ratio * 100, 1),
                "optional_match_pct": round(optional_ratio * 100, 1),
            })

        results.sort(key=lambda x: x["confidence"], reverse=True)
        return results[:5]
