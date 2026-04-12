const resumeService = require('../services/resume.service');
const ApiResponse = require('../utils/ApiResponse');

class ResumeController {
  async upload(req, res, next) {
    try {
      const result = await resumeService.uploadResume(req.user.id, req.file);
      ApiResponse.created(res, result, 'Resume uploaded successfully. Parsing in progress.');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const resumes = await resumeService.getResumes(req.user.id);
      ApiResponse.success(res, resumes);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const resume = await resumeService.getResumeById(req.user.id, req.params.id);
      ApiResponse.success(res, resume);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await resumeService.deleteResume(req.user.id, req.params.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async setPrimary(req, res, next) {
    try {
      const result = await resumeService.setPrimary(req.user.id, req.params.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResumeController();
