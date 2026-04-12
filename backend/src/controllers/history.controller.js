const historyService = require('../services/history.service');
const ApiResponse = require('../utils/ApiResponse');

class HistoryController {
  async getHistory(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await historyService.getUserHistory(req.user.id, page, limit);
      ApiResponse.paginated(res, result.items, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getTimeline(req, res, next) {
    try {
      const timeline = await historyService.getTimeline(req.user.id);
      ApiResponse.success(res, timeline);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HistoryController();
