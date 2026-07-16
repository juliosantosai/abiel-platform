export interface PermissionContext {
  permissions?: string[];
}

export interface PermissionCheckResult {
  allowed: boolean;
  missing: string[];
}

export class PermissionChecker {
  check(context: PermissionContext, requiredPermissions: string[] = []): PermissionCheckResult {
    const effectivePermissions = Array.isArray(context.permissions) ? context.permissions : [];
    const missing = requiredPermissions.filter((permission) => !effectivePermissions.includes(permission));
    return {
      allowed: missing.length === 0,
      missing,
    };
  }
}
