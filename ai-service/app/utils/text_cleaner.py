import re
import string
from typing import List


class TextCleaner:
    """Production-grade text cleaning pipeline for resume and job description text."""

    COMMON_STOP_SECTIONS = [
        "references",
        "hobbies",
        "interests",
        "declaration",
        "personal details",
    ]

    @staticmethod
    def clean_text(text: str) -> str:
        if not text or not isinstance(text, str):
            return ""

        # Remove URLs
        text = re.sub(r"http[s]?://\S+", " ", text)
        text = re.sub(r"www\.\S+", " ", text)

        # Remove email addresses (preserve for extraction separately)
        text = re.sub(r"\S+@\S+\.\S+", " ", text)

        # Remove phone numbers
        text = re.sub(r"[\+]?[\d\s\-\(\)]{10,}", " ", text)

        # Remove special characters but keep important ones
        text = re.sub(r"[^\w\s\.\,\;\:\-\/\+\#]", " ", text)

        # Normalize whitespace
        text = re.sub(r"\s+", " ", text)

        # Remove leading/trailing whitespace
        text = text.strip()

        return text

    @staticmethod
    def extract_sections(text: str) -> dict:
        sections = {
            "contact": "",
            "summary": "",
            "experience": "",
            "education": "",
            "skills": "",
            "projects": "",
            "certifications": "",
            "other": "",
        }

        section_patterns = {
            "summary": r"(?:summary|objective|about|profile)\s*[:\-]?\s*(.*?)(?=\n\s*(?:experience|education|skills|project|certification|work)|$)",
            "experience": r"(?:experience|work\s*history|employment|professional\s*experience)\s*[:\-]?\s*(.*?)(?=\n\s*(?:education|skills|project|certification)|$)",
            "education": r"(?:education|academic|qualification|degree)\s*[:\-]?\s*(.*?)(?=\n\s*(?:skills|project|certification|experience|work)|$)",
            "skills": r"(?:skills|technical\s*skills|competencies|technologies|tools)\s*[:\-]?\s*(.*?)(?=\n\s*(?:experience|education|project|certification|work)|$)",
            "projects": r"(?:projects?|portfolio)\s*[:\-]?\s*(.*?)(?=\n\s*(?:experience|education|skills|certification)|$)",
            "certifications": r"(?:certifications?|licenses?|awards?)\s*[:\-]?\s*(.*?)(?=\n\s*(?:experience|education|skills|project)|$)",
        }

        lower_text = text.lower()

        for section, pattern in section_patterns.items():
            match = re.search(pattern, lower_text, re.DOTALL | re.IGNORECASE)
            if match:
                start = match.start(1)
                end = match.end(1)
                sections[section] = text[start:end].strip()

        if not any(sections[k] for k in ["experience", "education", "skills"]):
            sections["other"] = text

        return sections

    @staticmethod
    def tokenize(text: str) -> List[str]:
        if not text:
            return []
        text = text.lower()
        tokens = re.findall(r"\b[a-zA-Z\+\#\.]{2,}\b", text)
        return tokens

    @staticmethod
    def remove_stopwords(tokens: List[str]) -> List[str]:
        stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
            "for", "of", "with", "by", "from", "is", "was", "are", "were",
            "be", "been", "being", "have", "has", "had", "do", "does",
            "did", "will", "would", "could", "should", "may", "might",
            "shall", "can", "need", "must", "that", "this", "these",
            "those", "it", "its", "we", "our", "they", "them", "their",
            "he", "she", "him", "her", "his", "my", "your", "i", "me",
            "not", "no", "nor", "so", "if", "then", "than", "too",
            "very", "just", "about", "also", "more", "most", "other",
            "some", "such", "only", "same", "into", "over", "after",
            "before", "between", "through", "during", "above", "below",
            "up", "down", "out", "off", "each", "every", "all", "both",
            "few", "many", "much", "any", "etc", "per", "via",
        }
        return [t for t in tokens if t.lower() not in stop_words]
