import logging
from typing import List, Dict

logger = logging.getLogger(__name__)


class RecommendationService:
    """AI-powered career recommendation engine."""

    def __init__(self):
        self._course_db = self._build_course_db()
        self._cert_db = self._build_cert_db()

    def generate(self, skills: List[Dict], target_role: str,
                 missing_skills: List[str], career_score: float) -> List[Dict]:
        """Generate personalized recommendations."""
        recommendations = []

        # Course recommendations for missing skills
        for skill in missing_skills[:5]:
            course = self._find_course(skill)
            if course:
                recommendations.append({
                    "type": "course",
                    "title": course["title"],
                    "description": f"Learn {skill} to strengthen your profile for {target_role or 'your target role'}.",
                    "provider": course["provider"],
                    "url": course.get("url", ""),
                    "priority": "high",
                    "estimated_duration": course.get("duration", "20-40 hours"),
                    "relevance_score": 85,
                    "source": "ai",
                })

        # Certification recommendations
        if target_role:
            certs = self._find_certifications(target_role)
            for cert in certs[:2]:
                recommendations.append({
                    "type": "certification",
                    "title": cert["title"],
                    "description": cert["description"],
                    "provider": cert["provider"],
                    "priority": "high",
                    "estimated_duration": cert.get("duration", "3-6 months"),
                    "relevance_score": 90,
                    "source": "ai",
                })

        # Project recommendation
        skill_names = [s.get("name", "") for s in skills[:3]]
        if skill_names:
            recommendations.append({
                "type": "project",
                "title": f"Portfolio Project: {target_role or 'Full Stack'} Application",
                "description": f"Build a project using {', '.join(skill_names)} to demonstrate practical expertise.",
                "priority": "medium",
                "estimated_duration": "2-4 weeks",
                "relevance_score": 80,
                "source": "ai",
            })

        # Career move recommendation
        if career_score < 50:
            recommendations.append({
                "type": "career_move",
                "title": "Build Your Foundation",
                "description": "Focus on strengthening core technical skills. Your career score suggests room for significant growth.",
                "priority": "high",
                "relevance_score": 85,
                "source": "ai",
            })
        elif career_score < 75:
            recommendations.append({
                "type": "career_move",
                "title": "Specialize & Differentiate",
                "description": "You have a solid foundation. Focus on specialization and getting hands-on project experience.",
                "priority": "medium",
                "relevance_score": 75,
                "source": "ai",
            })
        else:
            recommendations.append({
                "type": "career_move",
                "title": "Level Up to Leadership",
                "description": "Strong skill profile! Consider mentoring, leading projects, and contributing to open source.",
                "priority": "medium",
                "relevance_score": 70,
                "source": "ai",
            })

        return recommendations

    def _find_course(self, skill: str) -> Dict:
        skill_lower = skill.lower()
        return self._course_db.get(skill_lower, {
            "title": f"Learn {skill} - Complete Course",
            "provider": "Online Learning",
            "duration": "20-40 hours",
        })

    def _find_certifications(self, role: str) -> List[Dict]:
        return self._cert_db.get(role, [])

    def _build_course_db(self) -> Dict:
        return {
            "react": {"title": "Complete React Developer Course 2024", "provider": "Udemy", "duration": "40 hours", "url": "https://udemy.com"},
            "python": {"title": "Python for Data Science & ML Bootcamp", "provider": "Coursera", "duration": "60 hours", "url": "https://coursera.org"},
            "node.js": {"title": "Node.js - The Complete Guide", "provider": "Udemy", "duration": "35 hours", "url": "https://udemy.com"},
            "docker": {"title": "Docker & Kubernetes: The Practical Guide", "provider": "Udemy", "duration": "30 hours", "url": "https://udemy.com"},
            "aws": {"title": "AWS Solutions Architect Associate", "provider": "AWS Training", "duration": "80 hours", "url": "https://aws.amazon.com/training"},
            "machine learning": {"title": "Machine Learning Specialization", "provider": "Coursera (Stanford)", "duration": "120 hours", "url": "https://coursera.org"},
            "tensorflow": {"title": "TensorFlow Developer Professional Certificate", "provider": "Google", "duration": "100 hours", "url": "https://tensorflow.org"},
            "kubernetes": {"title": "Certified Kubernetes Administrator", "provider": "Linux Foundation", "duration": "60 hours", "url": "https://kubernetes.io"},
            "typescript": {"title": "TypeScript: The Complete Developer's Guide", "provider": "Udemy", "duration": "25 hours", "url": "https://udemy.com"},
            "sql": {"title": "The Complete SQL Bootcamp", "provider": "Udemy", "duration": "20 hours", "url": "https://udemy.com"},
            "git": {"title": "Git Complete: The Definitive Guide", "provider": "Udemy", "duration": "15 hours", "url": "https://udemy.com"},
            "figma": {"title": "UI/UX Design with Figma", "provider": "Coursera", "duration": "30 hours", "url": "https://coursera.org"},
            "deep learning": {"title": "Deep Learning Specialization", "provider": "deeplearning.ai", "duration": "120 hours", "url": "https://coursera.org"},
            "nlp": {"title": "NLP with Transformers", "provider": "Hugging Face", "duration": "40 hours", "url": "https://huggingface.co/course"},
            "java": {"title": "Java Programming Masterclass", "provider": "Udemy", "duration": "80 hours", "url": "https://udemy.com"},
            "go": {"title": "Learn Go Programming", "provider": "Udemy", "duration": "25 hours", "url": "https://udemy.com"},
        }

    def _build_cert_db(self) -> Dict:
        return {
            "DevOps Engineer": [
                {"title": "AWS Certified DevOps Engineer - Professional", "provider": "AWS", "description": "Industry-standard DevOps certification.", "duration": "3-6 months"},
                {"title": "Certified Kubernetes Administrator (CKA)", "provider": "Linux Foundation", "description": "Validates Kubernetes administration skills.", "duration": "2-3 months"},
            ],
            "Cloud Architect": [
                {"title": "AWS Solutions Architect - Professional", "provider": "AWS", "description": "Advanced cloud architecture certification.", "duration": "3-6 months"},
            ],
            "Data Scientist": [
                {"title": "Google Data Analytics Professional Certificate", "provider": "Google", "description": "Comprehensive data analytics certification.", "duration": "3-6 months"},
            ],
            "ML Engineer": [
                {"title": "TensorFlow Developer Certificate", "provider": "Google", "description": "Validates TensorFlow proficiency.", "duration": "2-3 months"},
                {"title": "AWS Machine Learning - Specialty", "provider": "AWS", "description": "ML on AWS certification.", "duration": "3-4 months"},
            ],
            "AI Engineer": [
                {"title": "Deep Learning Specialization", "provider": "deeplearning.ai", "description": "Comprehensive DL certification.", "duration": "4-6 months"},
            ],
            "Full Stack Developer": [
                {"title": "Meta Full-Stack Developer Professional Certificate", "provider": "Meta", "description": "Full-stack development certification.", "duration": "4-6 months"},
            ],
            "Frontend Developer": [
                {"title": "Meta Front-End Developer Professional Certificate", "provider": "Meta", "description": "Frontend development certification.", "duration": "3-4 months"},
            ],
        }
