"use strict";
const adminAuth = (req, res, next) => {
    // Always allow OPTIONS preflight through without authentication
    if (req.method === 'OPTIONS') {
        // Allow preflight without authentication
        console.log('[ADMIN AUTH]');
        console.log('tokenReceived:');
        console.log(!!req.header('x-admin-token'));
        console.log('validation:');
        console.log('skipped');
        return next();
    }
    const token = req.header('x-admin-token') || '';
    const expected = process.env.ADMIN_SECRET_TOKEN;
    // Diagnostic log for admin auth (do not log token value)
    console.log('[ADMIN AUTH]');
    console.log('tokenReceived:');
    console.log(!!token);
    if (!expected) {
        console.log('validation:');
        console.log('failure');
        return res.status(500).json({ success: false, error: 'ADMIN_SECRET_TOKEN not configured' });
    }
    if (!token || token !== expected) {
        console.log('validation:');
        console.log('failure');
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    console.log('validation:');
    console.log('success');
    next();
};
module.exports = { adminAuth };
//# sourceMappingURL=adminAuth.js.map