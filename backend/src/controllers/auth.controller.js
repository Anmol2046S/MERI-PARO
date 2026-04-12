const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      ApiResponse.created(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user.id);
      ApiResponse.success(res, profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await authService.updateProfile(req.user.id, req.body);
      ApiResponse.success(res, profile, 'Profile updated');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await authService.changePassword(req.user.id, req.body);
      ApiResponse.success(res, result, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
