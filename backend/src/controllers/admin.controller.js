const adminService = require('../services/admin.service');
const ApiResponse = require('../utils/ApiResponse');

class AdminController {
  async getUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';
      const result = await adminService.getAllUsers(page, limit, search);
      ApiResponse.paginated(res, result.users, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const analytics = await adminService.getSystemAnalytics();
      ApiResponse.success(res, analytics);
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req, res, next) {
    try {
      const result = await adminService.toggleUserStatus(req.params.id, req.user.id);
      ApiResponse.success(res, result, 'User status updated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
