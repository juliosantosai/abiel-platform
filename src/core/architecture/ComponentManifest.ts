const os = require('os');

const VALID_TYPES = ['CORE', 'ENGINE', 'MODULE', 'PLUGIN', 'SHARED'];

function normalizeType(type) {
  const normalized = String(type || 'SHARED').toUpperCase();
  if (normalized === 'SERVICE') {
    return 'SHARED';
  }
  if (!VALID_TYPES.includes(normalized)) {
    throw new Error(`Invalid component type: ${type}`);
  }
  return normalized;
}

function normalizeStatus(status) {
  return String(status || 'UNKNOWN').toUpperCase();
}

class ComponentManifest {
  constructor(input = {}) {
    const data = input || {};
    const id = String(data.id || data.name || `component-${Math.random().toString(36).slice(2, 8)}`).toLowerCase();

    this.id = id;
    this.name = data.name || id;
    this.type = normalizeType(data.type || 'SHARED');
    this.version = String(data.version || process.env.npm_package_version || 'unknown');
    this.description = typeof data.description === 'string' ? data.description : '';
    this.capabilities = Array.isArray(data.capabilities) ? data.capabilities : [];
    this.dependencies = Array.isArray(data.dependencies) ? data.dependencies : [];
    this.status = normalizeStatus(data.status || 'UNKNOWN');
    this.metadata = data.metadata && typeof data.metadata === 'object' ? data.metadata : {};
    this.healthFn = typeof data.healthFn === 'function' ? data.healthFn : null;
    this.metricsFn = typeof data.metricsFn === 'function' ? data.metricsFn : null;
    this.raw = data.raw || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || this.createdAt;
  }

  async health() {
    if (typeof this.healthFn === 'function') {
      try {
        const result = await this.healthFn();
        if (result && typeof result === 'object') {
          return {
            status: normalizeStatus(result.status || this.status || 'UNKNOWN'),
            latency: result.latency ?? null,
            memory: result.memory ?? null,
            errors: result.errors ?? 0,
            checks: result.checks || result.details || {},
          };
        }
      } catch (error) {
        return { status: 'FAILED', latency: null, memory: null, errors: 1, checks: { error: String(error) } };
      }
    }

    return {
      status: this.status === 'STARTED' ? 'ACTIVE' : this.status,
      latency: null,
      memory: null,
      errors: 0,
      checks: {},
    };
  }

  async metrics() {
    if (typeof this.metricsFn === 'function') {
      try {
        const result = await this.metricsFn();
        if (result && typeof result === 'object') {
          return {
            cpu: result.cpu ?? null,
            memory: result.memory ?? null,
            memoryUsageMB: result.memoryUsageMB ?? (typeof result.memory === 'number' ? result.memory : null),
            cpuCount: result.cpuCount ?? os.cpus().length,
            eventsProcessed: result.eventsProcessed ?? result.events ?? null,
            requests: result.requests ?? null,
            errors: result.errors ?? null,
            uptimeSeconds: result.uptimeSeconds ?? result.uptime ?? null,
            ...result,
          };
        }
      } catch (error) {
        return { errors: 1, error: String(error) };
      }
    }

    const memoryUsage = process.memoryUsage().heapUsed;
    return {
      cpu: null,
      memory: memoryUsage,
      memoryUsageMB: Number((memoryUsage / 1024 / 1024).toFixed(2)),
      cpuCount: os.cpus().length,
      eventsProcessed: null,
      requests: null,
      errors: 0,
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      version: this.version,
      description: this.description,
      capabilities: this.capabilities,
      dependencies: this.dependencies,
      status: this.status,
      metadata: this.metadata,
    };
  }
}

module.exports = ComponentManifest;
