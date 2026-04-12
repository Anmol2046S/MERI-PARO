const aiService = require('../services/ai.service');
const ApiResponse = require('../utils/ApiResponse');

class AIController {
  async getRecommendations(req, res, next) {
    try {
      const recommendations = await aiService.getRecommendations(req.user.id);
      ApiResponse.success(res, recommendations, 'Recommendations generated');
    } catch (error) {
      next(error);
    }
  }

  async getUserRecommendations(req, res, next) {
    try {
      const recommendations = await aiService.getUserRecommendations(req.user.id);
      ApiResponse.success(res, recommendations);
    } catch (error) {
      next(error);
    }
  }

  async markComplete(req, res, next) {
    try {
      const result = await aiService.markRecommendationComplete(req.user.id, req.params.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req, res, next) {
    try {
      const dashboard = await aiService.getDashboardData(req.user.id);
      ApiResponse.success(res, dashboard);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
