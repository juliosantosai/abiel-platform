const express = require('express');
const CustomerPortalController = require('../controllers/customer/CustomerPortalController');
const { authenticateRequest } = require('../middleware/auth/authMiddleware');
const { resolveTenant } = require('../middleware/tenant/tenantMiddleware');
const { PLATFORM_ROLES, requireRoles } = require('../middleware/permissions/permissionMiddleware');

function crearRutasCustomer(options = {}) {
    const router = express.Router();
    const controller = new CustomerPortalController(options);

    router.use(authenticateRequest);
    router.use(resolveTenant);
    router.use(requireRoles([PLATFORM_ROLES.CUSTOMER_OWNER, PLATFORM_ROLES.CUSTOMER_MEMBER]));

    router.get('/profile', controller.profile.bind(controller));
    router.get('/usage', controller.usage.bind(controller));
    router.get('/agents', controller.agents.bind(controller));
    router.get('/conversations', controller.conversations.bind(controller));
    router.get('/knowledge', controller.knowledge.bind(controller));

    return router;
}

module.exports = { crearRutasCustomer };