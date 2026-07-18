const express = require('express');
const PublicSurfaceController = require('../controllers/public/PublicSurfaceController');
const { requireBodyFields } = require('../middleware/validation/requireBodyFields');

function crearRutasPublic(options = {}) {
    const router = express.Router();
    const controller = new PublicSurfaceController(options);

    router.post('/signup', requireBodyFields(['companyName', 'email']), controller.signup.bind(controller));
    router.get('/plans', controller.plans.bind(controller));
    router.post('/demo', requireBodyFields(['email']), controller.demo.bind(controller));

    return router;
}

module.exports = { crearRutasPublic };