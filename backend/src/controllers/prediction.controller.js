const predictionService = require('../services/prediction.service');
const ApiResponse = require('../utils/ApiResponse');

class PredictionController {
  async predictJobRoles(req, res, next) {
    try {
      const { resumeId, modelType } = req.body;
      const result = await predictionService.predictJobRoles(req.user.id, resumeId, modelType);
      ApiResponse.success(res, result, 'Job roles predicted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSkillGap(req, res, next) {
    try {
      const { targetRole, resumeId } = req.body;
      const result = await predictionService.getSkillGap(req.user.id, targetRole, resumeId);
      ApiResponse.success(res, result, 'Skill gap analysis completed');
    } catch (error) {
      next(error);
    }
  }

  async analyzeJobDescription(req, res, next) {
    try {
      const { title, description, company } = req.body;
      const result = await predictionService.analyzeJobDescription(req.user.id, title, description, company);
      ApiResponse.success(res, result, 'Job description analyzed');
    } catch (error) {
      next(error);
    }
  }

  async simulateCareer(req, res, next) {
    try {
      const { addedSkills } = req.body;
      const result = await predictionService.simulateCareer(req.user.id, addedSkills);
      ApiResponse.success(res, result, 'Career simulation completed');
    } catch (error) {
      next(error);
    }
  }

  async getUserPredictions(req, res, next) {
    try {
      const predictions = await predictionService.getUserPredictions(req.user.id);
      ApiResponse.success(res, predictions);
    } catch (error) {
      next(error);
    }
  }

  async getJobRoles(req, res, next) {
    try {
      const roles = await predictionService.getJobRoles();
      ApiResponse.success(res, roles);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PredictionController();
