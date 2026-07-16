class PermissionChecker {
    check(context, requiredPermissions = []) {
        const effectivePermissions = Array.isArray(context.permissions) ? context.permissions : [];
        const missing = requiredPermissions.filter(permission => !effectivePermissions.includes(permission));
        return {
            allowed: missing.length === 0,
            missing
        };
    }
}

module.exports = PermissionChecker;