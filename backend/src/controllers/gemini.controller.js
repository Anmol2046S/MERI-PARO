const { GoogleGenAI } = require('@google/genai');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const generateInsights = async (req, res, next) => {
  try {
    const { promptType, contextData } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      throw ApiError.internal('GEMINI_API_KEY is not configured in the environment.');
    }

    if (!promptType || !contextData) {
      throw ApiError.badRequest('Missing promptType or contextData');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let systemInstruction = '';
    let prompt = '';

    switch (promptType) {
      case 'resume_rewrite':
        systemInstruction = 'You are an expert career coach and resume writer. Rewrite the provided resume bullet points to be highly professional, action-oriented, and quantified.';
        prompt = `Please rewrite the following resume content to sound professional and impactful:\n\n${contextData}`;
        break;
      case 'interview_prep':
        systemInstruction = "You are a technical interviewer for top tech companies. Generate 5 highly relevant technical and behavioral interview questions based on the candidate's skills.";
        prompt = `Generate interview questions for a candidate with these skills/profile:\n\n${contextData}`;
        break;
      case 'career_roadmap':
        systemInstruction = 'You are a career strategist. Generate a structured, step-by-step 4-week learning roadmap for the given user profile to reach the next level in their career.';
        prompt = `Create a 4-week learning roadmap based on this profile:\n\n${contextData}`;
        break;
      default:
        throw ApiError.badRequest('Invalid promptType');
    }

    logger.info(`Generating Gemini insights for type: ${promptType}`);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    res.json({
        success: true,
        data: response.text
    });

  } catch (error) {
    logger.error('Gemini generation error:', error);
    next(error);
  }
};

module.exports = {
  generateInsights
};
