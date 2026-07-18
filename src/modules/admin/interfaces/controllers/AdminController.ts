class AdminController {
  constructor({ adminService } = {}) {
    this.adminService = adminService;
  }

  async getArchitectureOverview(req, res, next) {
    try {
      const data = await this.adminService.getArchitectureOverview();
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  }

  async getArchitectureModules(req, res, next) {
    try {
      const data = await this.adminService.getArchitectureModules();
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
