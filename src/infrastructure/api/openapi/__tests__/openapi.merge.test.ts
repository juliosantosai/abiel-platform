const { openApiSpec } = require('../openApiSpec');

describe('OpenAPI integration', () => {
  test('admin paths merged into openApiSpec', () => {
    expect(openApiSpec.paths['/api/admin/logs']).toBeDefined();
    expect(openApiSpec.paths['/api/admin/metrics']).toBeDefined();
    expect(openApiSpec.components.securitySchemes.adminToken).toBeDefined();
  });
});
