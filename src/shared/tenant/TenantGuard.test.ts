export {};

describe("shared tenant shims", () => {
  test("can require TenantGuard and TenantError from shared/tenant", () => {
    const TenantGuard = require("./TenantGuard");
    const TenantError = require("./TenantError");

    const guard = new TenantGuard();

    expect(() => guard.ensureTenantContext()).toThrow(TenantError);
  });
});
