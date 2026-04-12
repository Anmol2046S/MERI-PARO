import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.nlp_service import NLPService

logger = logging.getLogger(__name__)
router = APIRouter()
nlp_service = NLPService()


class ExtractSkillsRequest(BaseModel):
    text: str


@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse an uploaded resume file and extract structured data."""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        content = await file.read()

        # Extract text from PDF
        text = ""
        try:
            import pdfplumber
            import io

            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as pdf_err:
            logger.warning(f"pdfplumber failed, trying PyPDF2: {pdf_err}")
            try:
                from PyPDF2 import PdfReader
                import io

                reader = PdfReader(io.BytesIO(content))
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            except Exception as pypdf_err:
                logger.error(f"All PDF parsers failed: {pypdf_err}")
                raise HTTPException(status_code=422, detail="Could not extract text from PDF")

        if not text.strip():
            raise HTTPException(status_code=422, detail="No text content found in the resume")

        result = nlp_service.parse_resume_text(text)
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resume parsing error: {e}")
        raise HTTPException(status_code=500, detail=f"Resume parsing failed: {str(e)}")


@router.post("/extract-skills")
async def extract_skills(request: ExtractSkillsRequest):
    """Extract skills from raw text (e.g., job descriptions)."""
    try:
        skills = nlp_service.extract_skills_from_text(request.text)
        return {"skills": skills, "count": len(skills)}
    except Exception as e:
        logger.error(f"Skill extraction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
