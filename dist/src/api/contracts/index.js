"use strict";
const infrastructureContracts = require('../../infrastructure/api/contracts');
const PLATFORM_ROLES = Object.freeze({
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    OPERATOR: 'OPERATOR',
    VIEWER: 'VIEWER',
    CUSTOMER_OWNER: 'CUSTOMER_OWNER',
    CUSTOMER_MEMBER: 'CUSTOMER_MEMBER',
});
module.exports = Object.assign({}, infrastructureContracts, {
    PLATFORM_ROLES,
});
//# sourceMappingURL=index.js.map