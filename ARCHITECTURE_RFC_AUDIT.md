# 🔍 ARQUITECTURA RFC — AUDITORÍA CRÍTICA DE NIVEL PRINCIPAL ENGINEER

**Auditor**: Senior Architect / Architecture Review Board  
**Date**: 2026-07-16  
**Rating Received**: 10/10 (claimed)  
**Rating After Audit**: 6.8/10 (HONEST)  
**Recommendation**: **NOT READY FOR IMPLEMENTATION** 

> Estado actual: los hallazgos de esta auditoria se consideran historicos.
> El estado ejecutable vigente se valida con architecture fitness checks y ADRs en `docs/`.

---

# RESUMEN EJECUTIVO

Este RFC tiene **ideas EXCELENTES** pero está **sobreespecificado en lo irrelevante** y **subespecificado en lo crítico**. 

**Problemas principales:**
- ❌ Contradicciones arquitectónicas entre componentes
- ❌ Responsabilidades duplicadas (Runtime + Planner + Scheduler)
- ❌ Acoplamiento implícito via "DecisionContext" no especificado
- ❌ Interfaces críticas faltantes
- ❌ Decisiones IRREVERSIBLES incluidas como spec (VectorDB, Cron, etc.)
- ❌ Over-engineering para un MVP (Saga patterns, multi-level memory, semantic tuples)
- ❌ Escalabilidad cuestionable (decisión global de LLM en cada operación)
- ❌ Plugin SDK no es implementable (builders muy simplistas)
- ❌ Seguridad superficial (sandboxing es ilusorio sin VM/containers)
- ❌ Observabilidad diseñada sin presupuesto de overhead

**Veredicto**: Rechazaría esto en un Design Review. Hay que **redesinarlo antes de escribir código**.

---

# 📋 TABLA DE EVALUACIÓN POR COMPONENTE

| Componente | Rating | Status | Motivo |
|-----------|--------|--------|--------|
| Runtime | 5/10 | 🔴 REDESIGN | Flujo contradictorio con Planner/Scheduler |
| Scheduler | 7/10 | 🟡 REFINE | Bueno, pero falta durabilidad de estado |
| Planner | 6/10 | 🔴 REDESIGN | "Optimal planning" no está especificado, no es ejecutable |
| Workflow | 7/10 | 🟡 REFINE | Bueno pero confunde orchestration con state machine |
| Memory | 6/10 | 🔴 REDESIGN | Complejidad sin beneficio claro, falta GC policy |
| Capability Registry | 8/10 | 🟢 READY | Sólido, interfaces claras |
| Plugin SDK | 4/10 | 🔴 REDESIGN | Builders son abstracciones que esconden problemas |
| Security | 5/10 | 🔴 REDESIGN | Sandboxing es pseudocódigo, falta threat model |
| Observability | 7/10 | 🟡 REFINE | Bueno pero sin SLA de overhead |
| AI Provider | 5/10 | 🔴 REDESIGN | Falta fallback strategy, retry logic duplicado |
| Deployment | 6/10 | 🔴 REDESIGN | Kubernetes-specific, falta local/edge story |
| Governance | 7/10 | 🟡 REFINE | Semver es estándar, pero falta binary compatibility |

---

# 🔴 PROBLEMAS CRÍTICOS (DETALLADOS)

## PROBLEMA 1: CONTRADICCIÓN EN FLUJO DE EJECUCIÓN

### El Conflicto

El Runtime define este flujo:

```
REQUEST → CONTEXT → POLICY → PLANNER → EXECUTION → STATE → EVENT → OUTPUT
```

Pero **QUIEN EJECUTA EL PLANNER?**

- El Runtime dice: "Create execution plan"
- El Planner dice: "Planner is an Engine"
- El Scheduler dice: "Add to queue"
- El Workflow dice: "Execute steps"

**Preguntas sin respuesta:**
1. ¿El Planner es llamado por Runtime, o es el Runtime quien planea?
2. ¿Dónde decide qué usar: Planner vs Workflow Engine?
3. Si el Scheduler pospone, ¿quién planea después?
4. ¿Pueden los workflows contener planificación?

**Ejemplo de la confusión:**

```typescript
// ¿Este código qué hace?
const result = await runtime.process(agentId, input);

// Opción A: Runtime planifica automáticamente
// (entonces, ¿cuándo se usa Planner Engine?)

// Opción B: Debe especificarse plannerStrategy en opciones
// (entonces, ¿por qué no es obligatorio?)

// Opción C: Depende del agente config
// (entonces, ¿dónde se define? No aparece en Agent interface)
```

### Por Qué Esto Importa

En producción:
- A veces necesitas skip planning (herramienta única)
- A veces necesitas planning sofisticado
- A veces necesitas re-planning en runtime (si falla paso 1)

**No tener esto claro = code organization disaster**

### Recomendación Concreta

Necesitas TRES pipelines explícitos, no uno:

```typescript
// Pipeline 1: Direct Tool Execution (sin planning)
const directResult = await runtime.executeTool(toolId, parameters);

// Pipeline 2: Planned Execution (con planning)
const plan = await planner.plan(goal, context);
const plannedResult = await runtime.executePlan(plan);

// Pipeline 3: Workflow Execution (orquestación predefinida)
const workflowResult = await runtime.executeWorkflow(workflowId, input);
```

Cada uno tiene su contrato explícito. No hay ambigüedad.

---

## PROBLEMA 2: RESPONSABILIDADES DUPLICADAS

### Donde Aparece

| Responsabilidad | Runtime | Scheduler | Planner | Workflow |
|---|---|---|---|---|
| Decidir qué ejecutar | ✅ | ✅ | ✅ | ✅ |
| Retry logic | ✅ (via policy) | ✅ (RetryPolicy) | ✗ | ✅ (onFailure) |
| State transitions | ✅ | ✗ | ✗ | ✅ |
| Error handling | ✅ | ✅ | ✗ | ✅ |
| Context building | ✅ | ✗ | ✅ | ✗ |
| Validation | ✅ | ✗ | ✗ | ✗ |

### El Problema Específico

**RetryPolicy aparece en TRES lugares:**

1. **Runtime.execute()** - tiene timeout + circuit breaker
2. **SchedulerEngine.scheduleWithRetries()** - tiene RetryPolicy
3. **WorkflowStep.retryPolicy** - tiene RetryPolicy

¿QUIÉN es la fuente de verdad para retries?

```typescript
// Caso ambiguo:
const result = await scheduler.scheduleWithRetries(
    agentId,
    input,
    retryPolicy    // ¿Este se usa?
);

// Pero qué pasa si runtime.execute tiene SU PROPIO retry logic?
// ¿Reintentas dos veces (scheduler + runtime)?
// ¿O se anula uno al otro?
```

### Recomendación Concreta

**Unificar retry logic en una sola capa**: ExecutionEngine.

```typescript
export interface ExecutionEngine {
    execute(
        target: ExecutionTarget,
        parameters: any,
        policy: ExecutionPolicy  // ÚNICA fuente de verdad
    ): Promise<ExecutionResult>;
}

export interface ExecutionPolicy {
    timeout: Duration;
    retryPolicy: RetryPolicy;
    circuitBreaker: CircuitBreakerPolicy;
    fallback?: ExecutionTarget;
}
```

Scheduler, Planner, Workflow todos usan ExecutionEngine.executeWithPolicy() y dejan el retry al ExecutionEngine.

---

## PROBLEMA 3: "DecisionContext" NO ESTÁ ESPECIFICADO

### El Síntoma

Aparece en MÚLTIPLES lugares:

- Runtime: "Build DecisionContext from agent state + memories + knowledge + tenant data"
- Planner: "plan(goal: string, context: DecisionContext, ...)"
- Policy Engine: Evalúa policies sobre DecisionContext
- ExecutionTrace: Contiene context que fue built

**Pero NUNCA se define el interface DecisionContext**

### Por Qué Esto es Crítico

DecisionContext es lo más importante del sistema. Determina:
- Qué información tiene el LLM
- Qué puede hacer el Planner
- Qué políticas se aplican
- Qué se loguea

Sin especificarlo claramente:

```typescript
// ¿Cuál de estas definiciones es correcta?

// Opción A: Minimal
interface DecisionContext {
    agentState: AgentState;
    input: Input;
}

// Opción B: Completo
interface DecisionContext {
    agentState: AgentState;
    input: Input;
    memories: EpisodicMemory[];
    semanticTuples: SemanticTuple[];
    knowledgeGraph: any;
    availableCapabilities: Capability[];
    policies: Policy[];
    previousDecisions: Decision[];
    environmentData: any;
    currentTime: Date;
}

// Opción C: Lazy
interface DecisionContext {
    agentId: string;
    inputId: string;
    // Lazy loaders
    getAgentState(): Promise<AgentState>;
    getMemories(): Promise<EpisodicMemory[]>;
    // etc.
}
```

Cada opción tiene implicaciones de performance y correctness ENORMES.

### Recomendación Concreta

Define DecisionContext como PRIMERA COSA:

```typescript
/**
 * DecisionContext: GOLDEN SOURCE for agent decision-making
 * 
 * Invariants:
 * - Immutable (created once per execution)
 * - Tenant-isolated (no cross-tenant data)
 * - Time-bounded (reflects state at creation, not current)
 * - Budget-tracked (know cost of context building)
 */
export interface DecisionContext {
    // Core identity
    executionId: string;
    agentId: string;
    tenantId: string;
    timestamp: Date;
    
    // Input & outputs
    input: Input;
    previousOutput?: Output;
    
    // State at decision time
    agent: {
        config: AgentConfig;
        state: AgentState;
        workflows: Workflow[];
        delegatedAgents?: string[];
    };
    
    // Learned information
    memories: {
        recent: EpisodicMemory[];           // Last N messages
        semantic: SemanticTuple[];          // Top-K semantic matches
        cache: Map<string, any>;            // Query result cache
    };
    
    // Actionable information
    capabilities: {
        available: Capability[];
        policies: Policy[];
        quotas: ResourceQuota[];
    };
    
    // Metadata for observability
    cost: {
        inputTokens: number;
        contextBuildTimeMs: number;
        estimatedOutputTokens?: number;
    };
    
    // Read-only snapshots
    readonly systemTime: Date;
    readonly builtAt: Date;
}
```

---

## PROBLEMA 4: DECISIONES IRREVERSIBLES INCLUIDAS

### Cuáles Son

Cosas que están especificadas pero deberían ser **implementación interna**, no arquitectura:

| Decisión | En Spec? | Por Qué Problemático | Solución |
|---|---|---|---|
| "Use Cron for scheduling" | Sí | ¿Y si quiero Azure Scheduler? | Usar scheduler interface |
| "VectorDB para semantic" | Sí | ¿Postgres pgvector? ¿Pinecone? | No especificar DB |
| "OpenTelemetry para observability" | Sí | ¿Y APMs propietarios? | Especificar interface, no tool |
| "Semantic embeddings con vectors" | Sí | ¿Embeddings para qué? | Especificar contrato, no impl |
| "Saga pattern para workflows" | Sí | ¿Y si solo quiero transacciones DB? | No prescribir pattern |
| "Redis para cache" | Implícito | ¿Y memoria local? ¿DynamoDB? | Abstractizar |
| "Plugin sandboxing" | Sí | ¿Cómo? ¿Nacl.js? ¿Isolates? | No especificar impl |

### Por Qué Esto Importa

**Cada decisión especificada = costo de migración futura**

Si en 2027 quieren cambiar de OpenTelemetry a Datadog nativo:
- ¿Cuánto código necesita refactor?
- ¿Cuántos tests rompen?
- ¿Pueden coexistir?

### Recomendación Concreta

**Regla de Oro**: Si aparece en la RFC, debe ser **interface o behavior**, nunca **implementation**.

❌ Mal:
```
"Usar Cron expressions para scheduling"
"Integrar OpenTelemetry SDK v1.15+"
"Almacenar embeddings en VectorDB"
```

✅ Bien:
```
"El Scheduler acepta TimeExpression (puede ser Cron, Temporal, etc.)"
"El runtime emite eventos de tracing (OpenTelemetry es una implementación posible)"
"El Memory Engine permite query semántica (implementación de backend es opción)"
```

---

## PROBLEMA 5: PLUGIN SANDBOXING ES PSEUDOCÓDIGO

### Lo Especificado

```typescript
export class PluginSandbox {
    async executeWithSecurity<T>(
        plugin: AbelPlugin,
        fn: () => Promise<T>,
        securityContext: PluginSecurityContext
    ): Promise<T> {
        // 1. Set resource limits
        this.setResourceLimits(securityContext);
        
        // 2. Intercept filesystem access
        this.interceptFileSystem(securityContext);
        
        // 3. Intercept network access
        this.interceptNetwork(securityContext);
        // ...
    }
}
```

### Por Qué NO Funciona

En Node.js:
- **NO HAY API NATIVA** para interceptar filesystem sin proxy object
- **NO HAY API NATIVA** para limitar CPU/memoria sin V8 API (y eso es inestable)
- **NO HAY API NATIVA** para aislar contextos sin Worker Threads (y aún así es débil)

**Realidad:**

```javascript
// Esto no funciona:
require('fs').readFile('sensitive.txt', (err, data) => {
    // Tu interceptor no se dispara
});

// Necesitarías reescribir el plugin para usar tu API:
await sandbox.readFile('sensitive.txt')
// Pero eso requiere que el plugin haga logging,
// validación, etc. manualmente
```

### Threat Model Faltante

¿Qué está protegiendo sandboxing contra?

- ❌ Plugin malintencionado que roba credenciales? NO (el runtime tiene las credenciales)
- ❌ Plugin que consume toda la RAM? PARCIALMENTE (si haces memory tracking)
- ❌ Plugin que hace requests a urls maliciosas? NO (necesitas http client que respete policies)
- ❌ Plugin que accede datos de otro tenant? **POTENCIALMENTE SÍ** (pero requiere verificación en cada operación)

### Recomendación Concreta

**No prometas sandboxing. Promete policy enforcement.**

```typescript
/**
 * PluginExecutionContext
 * 
 * Este es el verdadero modelo de seguridad:
 * - El plugin corre en el mismo proceso
 * - Confiamos que seguirá las reglas
 * - Pero auditamos y hacemos enforcement
 */
export interface PluginExecutionContext {
    // Logging obligatorio
    log(level: string, message: string): void;
    
    // API específica (no filesystem nativo)
    fileStorage?: {
        read(path: string): Promise<Buffer>;
        write(path: string, data: Buffer): Promise<void>;
        // Los paths están restringidos a /plugins/{pluginId}/
    };
    
    // Red a través de proxy
    http?: {
        get(url: string, options?: HttpOptions): Promise<Response>;
        post(url: string, body: any, options?: HttpOptions): Promise<Response>;
        // Validamos URLs contra whitelist de plugin
    };
    
    // Datos a través de API auditada
    memory?: {
        store(entry: EpisodicMemory): Promise<void>;
        query(criteria: QueryCriteria): Promise<EpisodicMemory[]>;
        // Tenant separation validada por memory engine
    };
}
```

---

## PROBLEMA 6: OBSERVABILIDAD OVERHEAD NOT BUDGETED

### Lo Especificado

"EVERY operation emits: TRACE + METRICS + LOGS + EVENTS"

### La Realidad

En un sistema que maneja 100k+ agentes:

```
100,000 agents
× 10 operations/agent/second
= 1,000,000 operations/second

Si cada operación genera:
- 1 root span (opentelemetry)
- 5 child spans (context, policy, ai, execution, state)
- 10 metric data points
- 20 log lines

= 1M × (6 spans + 10 metrics + 20 logs)
= 36 million events/second
```

¿En qué backend?

```
Jaeger:
- Sampling rate mínimo de 0.01 (1%) antes de colapsar
- Cost: ~$50k/month en AWS para mantener traces

Prometheus:
- Max de 10M data points ingested/minute
- = 167k points/second
- Esto está OK, pero requiere aggregation

Logs:
- Si guardas todos: ~100GB/hour en JSON
- Si usas sampling: ¿qué información pierdes?
```

### Recomendación Concreta

**Define SLOs para overhead:**

```typescript
/**
 * Observability Budget
 */
export interface ObservabilityBudget {
    // CPU overhead: max 5% of total runtime CPU
    cpuOverheadMax: 0.05;
    
    // Memory overhead: max 100MB for tracing
    memoryOverheadMax: 100_000_000;
    
    // Network: max 10Mbps for metrics
    networkBandwidthMax: 10_000_000;
    
    // Sampling rates (por defecto)
    sampling: {
        tracesSamplingRate: 0.01;        // 1% de traces
        errorsSamplingRate: 1.0;         // 100% de errores
        slowQuerysSamplingRate: 0.1;    // 10% de queries lentos
    };
    
    // Retention policy
    retention: {
        tracesRetentionDays: 7;
        metricsRetentionDays: 30;
        logsRetentionDays: 90;
    };
}
```

Y: **VALIDA EN TESTS** que no excedas presupuesto.

---

## PROBLEMA 7: PLUGIN SDK BUILDERS SON DEMASIADO SIMPLISTAS

### Lo Especificado

```typescript
const weatherTool = new ToolPluginBuilder()
    .id("weather")
    .name("Weather Tool")
    .description("Get weather information")
    .input({
        location: "string (required)",
        days: "number (optional)"
    })
    .output({
        forecast: "array",
        temperature: "number"
    })
    .execute(async (input) => {
        const response = await fetch(`https://api.weather.com?location=${input.location}`);
        return response.json();
    })
    .build();
```

### Por Qué NO Funciona

**Pregunta 1: ¿Dónde está la validación de input?**
- El plugin acepta location pero ¿valida que sea string válido?
- ¿Qué pasa si input es {} (vacío)?

**Pregunta 2: ¿Cómo se maneja errores?**
```javascript
const response = await fetch(...);  // ¿Qué si timeout?
return response.json();             // ¿Qué si response no es JSON?
```

**Pregunta 3: ¿Dónde se configuran credenciales?**
- El plugin hardcodea `https://api.weather.com`
- ¿Qué si cada tenant necesita su propia API key?
- ¿Qué si el URL cambió?

**Pregunta 4: ¿Cómo se testan?**
```typescript
// No hay forma de mock el fetch
// No hay forma de inyectar dependencies
// No hay forma de simular errores
```

### Recomendación Concreta

El SDK debe forzar mejor practices:

```typescript
export interface ToolPluginConfig {
    // Input schema con validación
    inputSchema: JsonSchema;
    
    // Output schema
    outputSchema: JsonSchema;
    
    // Configuración por tenant
    tenantConfig?: {
        apiKey?: string;
        baseUrl?: string;
        // Custom settings
    };
    
    // Error handling
    onError?: (error: Error, context: ToolContext) => ToolErrorResponse;
    
    // Retry policy
    retryPolicy?: RetryPolicy;
}

export class ToolPluginBuilder implements PluginBuilder {
    withInput(schema: JsonSchema): this {
        this.config.inputSchema = schema;
        return this;
    }
    
    withOutput(schema: JsonSchema): this {
        this.config.outputSchema = schema;
        return this;
    }
    
    withExecution(fn: ToolExecutor): this {
        // Fn recibe dependencies inyectadas
        this.executor = fn;
        return this;
    }
    
    withErrorHandling(handler: ErrorHandler): this {
        this.config.onError = handler;
        return this;
    }
    
    build(): ToolPlugin {
        // Validar que todo está especificado
        if (!this.config.inputSchema) throw new Error("Input schema required");
        if (!this.config.outputSchema) throw new Error("Output schema required");
        
        return new ToolPlugin(this.config, this.executor);
    }
}

// Uso:
const weatherTool = new ToolPluginBuilder()
    .id("weather")
    .withInput(z.object({ location: z.string() }))
    .withOutput(z.object({ forecast: z.array(z.any()) }))
    .withExecution(async (input: any, deps: ToolDependencies) => {
        const apiKey = deps.config.apiKey;
        const baseUrl = deps.config.baseUrl;
        const response = await deps.http.get(`${baseUrl}/forecast`, {
            params: { location: input.location }
        });
        return response.data;
    })
    .withErrorHandling((error, context) => {
        return {
            status: "error",
            reason: error.message,
            retryable: error instanceof TimeoutError
        };
    })
    .build();
```

---

## PROBLEMA 8: ESCALABILIDAD — DECISIÓN GLOBAL DE LLM

### El Síntoma

En el Runtime flujo:

```
REQUEST → CONTEXT → POLICY → PLANNER → AI GENERATION → EXECUTION
                                        ↑
                             "Call LLM with context"
```

**Cada operación tiene un LLM call.**

### El Problema

Con 100k agentes ejecutando operaciones:

```
100,000 agentes × 10 op/seg = 1,000,000 LLM calls/second

Si OpenAI rata a 50k tokens input/second total:
- Cada llamada usa ~500 tokens
- = 500M tokens/segundo needed
- = 10,000x sobre la cuota

Incluso si batches, no escalas sin:
1. Local LLMs (Ollama)
2. Model selection logic (cuándo usar Claude vs GPT vs local)
3. Fallback chains (si OpenAI cae)
4. Caching de decisiones (¿cuándo reutilizar planes?)
```

### Recomendación Concreta

**El Planner (y decisiones críticas) NO siempre llaman LLM:**

```typescript
/**
 * DecisionMaker (reemplaza "AI GENERATION")
 */
export interface DecisionMaker {
    // Opción 1: Rules-based
    makeDecision(context: DecisionContext): Promise<Decision> {
        // Si goal es simple, rule engine
        if (context.input.content.startsWith("set ")) {
            return applyRulesEngine(context);
        }
        
        // Opción 2: LLM
        if (context.input.intent.confidence < 0.8) {
            return callLLM(context);
        }
        
        // Opción 3: Cache
        const cached = await decisionCache.get(context.input.hash);
        if (cached && !hasExpired(cached)) {
            return cached;
        }
        
        // Opción 4: Fallback
        if (llmIsDown) {
            return fallbackDecisionStrategy(context);
        }
    };
}
```

---

## PROBLEMA 9: MULTI-LEVEL MEMORY ES OVER-ENGINEERED

### Lo Especificado

```
SHORT-TERM (En RAM)
EPISODIC (Base de datos)
SEMANTIC (Vector DB)
CACHE (Redis)
```

### Preguntas

1. **¿Cuándo uso cada una?**
   - Episodic para ALL events? → Costo infinito
   - Semantic para TODO? → Embeddings para qué palabras?
   - Cache para qué exactamente?

2. **¿Cómo se sincroniza?**
   ```
   Write a message:
   - Short-term (RAM): instant
   - Episodic (DB): insert
   - Semantic (VectorDB): embed then insert
   - Cache: invalidate or add?
   
   ¿Qué pasa si episodic insert falla?
   ¿Semantic se rollback?
   ```

3. **¿Garbage collection?**
   - Short-term: claro (cuando sesión termina)
   - Episodic: ¿cuándo borrar? (GDPR, TTL, disk space?)
   - Semantic: ¿cuándo re-embed? (embeddings model cambió?)
   - Cache: ¿invalidación? (TTL simple es insuficiente)

### Para MVP

Esto es demasiado. Comienza con:

```typescript
// MVP Memory: Simple
interface MemoryEngine {
    // Episodic ONLY
    store(entry: EpisodicMemory): Promise<void>;
    query(criteria: QueryCriteria): Promise<EpisodicMemory[]>;
    
    // Búsqueda exacta, no semántica
    // Text search en DB (LIKE o full-text index)
}
```

Semantic/Vector DB es una optimización Phase 2.

---

## PROBLEMA 10: GOVERNANCE SIN COMPAT MATRIX

### Lo Especificado

```
Breaking Changes (Major) → v2.0.0
Non-breaking (Minor) → v1.1.0
Bug fixes (Patch) → v1.0.1
```

### Lo Faltante

**¿Qué es "breaking"?**

```typescript
// Scenario 1:
interface Capability {
    version: string;        // v1: presente
    // v2: se elimina
}

// ¿Esto rompe?
// Plugins v1 esperan el campo → YES, breaking

// Scenario 2:
interface Capability {
    available: boolean;     // v1: present
    // v2: se renombra a "isAvailable"
}

// ¿Esto rompe?
// Plugins v1 setean .available → YES, breaking

// Scenario 3:
interface ScheduleExpression {
    type: "immediate" | "at" | "delay" | "cron" | "interval" | "retry"  // v1
    // v2: se agrega "webhook"
}

// ¿Esto rompe?
// NO, es aditivo
// Pero si Runtime hace switch(expr.type) sin default...
// Rompe si plugin envía tipo nuevo a Runtime viejo
```

**Sin binary compatibility spec:**
- Nadie sabe qué es safe
- Plugins en github/npm sin versioning correcto
- Update a v2.1.0 rompe código que funciona

### Recomendación Concreta

Define **Compatibility Matrix** explícito:

```typescript
/**
 * Compatibility Declaration
 * 
 * Qué fue qué desde cuándo
 */
export const compatibilityMatrix = {
    "2.0.0": {
        interfaces: ["RuntimeContract", "SchedulerEngine", "PlannerEngine", ...],
        brokenIn: [],
        addedCapabilities: ["scheduled_execution", "multi_level_memory", ...],
        removedCapabilities: [],
        miratedFrom: "1.9.0"
    },
    "1.9.0": {
        // ...
    }
};

// En runtime:
if (!compatibilityMatrix[pluginMinVersion] ||
    pluginMinVersion > coreVersion) {
    throw new IncompatiblePluginError();
}
```

---

# 🟡 PROBLEMAS MEDIANOS (REFERENCIAS)

### P11: Workflow vs Orchestration confundido
- Workflow define steps + transitions (state machine)
- Pero también maneja compensations (Saga pattern)
- Confunde DOS conceptos: stateful workflows + eventual consistency
- **FIX**: Separar StateMachineEngine de WorkflowOrchestrationEngine

### P12: AI Provider abstraction incompleta
- No hay fallback chain (si OpenAI falla, usa Anthropic)
- No hay token accounting
- No hay embed model selection
- **FIX**: Especificar AIProviderChain con fallback strategy

### P13: Execution no especifica timeout propagation
- Runtime tiene timeout
- ExecutionEngine tiene timeout
- Plugin execution tiene timeout
- ¿Quién controla? ¿Se suman? ¿Se anidan?
- **FIX**: Especificar Timeout Nesting Rules

### P14: Policy Engine sin PolicyLanguage
- "Evaluate policies" no especifica QUÉ lenguaje
- ¿CEL (Common Expression Language)?
- ¿OPA (Open Policy Agent)?
- ¿Custom DSL?
- **FIX**: Elegir PolicyLanguage antes de implementar

### P15: Event model sin ordering guarantees
- "Emit event" puede ordenarse diferente en distributed system
- Sin causalidad claro entre eventos
- **FIX**: Especificar EventOrdering (total, causal, none)

---

# 🔴 DECISIONES IRREVERSIBLES A RECONSIDERAR

| Decisión | Impacto | Recomendación |
|----------|--------|--------------|
| "Usar cron para scheduling" | ALTO | Usar ScheduleExpression interface |
| "Semantic embeddings para search" | ALTO | Hacer opcional en MVP |
| "OpenTelemetry como único tracer" | ALTO | Especificar TracingInterface |
| "PostgreSQL partitioned by tenant_id" | ALTO | Abstractizar storage layer |
| "Saga pattern para compensations" | MEDIO | Especificar CompensationStrategy |
| "Redis para caching" | MEDIO | Especificar CacheInterface |
| "VectorDB para semantic" | ALTO | Fase 2+ |

---

# 📊 COMPONENTS READY FOR IMPLEMENTATION

## READY TO IMPLEMENT (Implementar ya)

### ✅ Capability Registry (8/10)
- Interface está clara
- Responsabilidades no duplicadas
- Sin dependencias críticas
- **Time to code**: 1-2 semanas

### ✅ Basic Scheduler (6/10)
- Especificación de cron está OK
- Retry policy funciona
- **BUT**: Falta durabilidad de estado
- **Fix**: Agregar StateCheckpointing a SchedulerEngine
- **Time to code**: 2-3 semanas

---

## NEEDS REFINEMENT (Refinar antes)

### 🟡 Memory Engine (6/10)
- Simplificar para MVP (solo Episodic)
- Definir GC policy
- Especificar query language
- **Time**: 1 semana adicional de design

### 🟡 Observability (7/10)
- Define Observability Budget (overhead SLOs)
- Especificar sampling strategy
- Clarify tracing API vs OpenTelemetry
- **Time**: 2-3 días adicionales

### 🟡 Plugin SDK (4/10)
- Rediseñar builders con mejor DI
- Agregar testing utilities robustas
- Especificar plugin lifecycle hooks
- **Time**: 1-2 semanas

---

## REDESIGN REQUIRED (Rediseñar)

### 🔴 Runtime Contract (5/10)
- **Issue**: Flujo contraatorio (Runtime vs Planner vs Scheduler)
- **Fix**: Tres pipelines explícitos
- **Time**: 1 semana

### 🔴 Planner Engine (6/10)
- **Issue**: "Optimal planning" no está especificado, no es ejecutable
- **Fix**: Elegir algoritmo (A*, heurístico, LLM-based)
- **Time**: 1-2 semanas

### 🔴 Security Model (5/10)
- **Issue**: Sandboxing es pseudocódigo
- **Fix**: Define PolicyEnforcement sin promesas imposibles
- **Time**: 1-2 semanas

### 🔴 AI Integration (5/10)
- **Issue**: Falta fallback chain, escalabilidad
- **Fix**: AIProviderChain con routing intelligent
- **Time**: 1-2 semanas

### 🔴 Workflow Engine (7/10)
- **Issue**: Confunde state machines con sagas
- **Fix**: Separar StateMachine (transitions) de Orchestration (durability)
- **Time**: 1 semana

---

# ⚠️ DECISIONES QUE NO DEBERÍA HABER EN RFC

Remove estas especificaciones (son implementación):

- ❌ "Use Cron expressions" → Use TimeExpression interface
- ❌ "OpenTelemetry v1.15+" → Use ObservabilityInterface
- ❌ "PostgreSQL partitioned" → Use StorageInterface
- ❌ "Prisma ORM" → Use DataAccessLayer abstraction
- ❌ "Redis for cache" → Use CacheInterface
- ❌ "Plugin code in Node.js" → Support WebAssembly later

---

# ✅ TABLA FINAL POR COMPONENTE

## Clasificación Final

```
READY TO IMPLEMENT:
├─ Capability Registry
└─ Basic Scheduler (con StateCheckpointing)

NEEDS REFINEMENT (2-3 semanas):
├─ Memory Engine (simplify)
├─ Observability (add budget)
├─ Plugin SDK (redesign DI)
└─ Governance (add compatibility matrix)

REDESIGN REQUIRED (4-6 semanas):
├─ Runtime Contract (3 pipelines)
├─ Planner Engine (algorithm spec)
├─ Security Model (remove sandbox promises)
├─ AI Integration (fallback chain)
├─ Workflow Engine (separate concerns)
└─ Deployment (remove Kubernetes hardcoding)
```

---

# 🎯 RESPUESTAS A PREGUNTAS FINALES

## 1. ¿Implementarías esta arquitectura en producción?

**NO. Absolutamente no.**

Razones:
- Flujos de ejecución contradictorios
- Componentes con responsabilidades duplicadas
- Interfaces críticas no especificadas (DecisionContext)
- Promesas de seguridad que no se pueden cumplir (sandboxing)
- Decisiones arquitectónicas hardcoded (cron, OpenTelemetry, VectorDB)
- Escalabilidad cuestionada (LLM call en cada operación)

**Timeline**: 4-6 semanas más de design antes de código.

---

## 2. ¿Qué cambiarías antes de escribir una línea de código?

### Top 3 Prioritarios

**#1: Define DecisionContext completamente**
- Es el corazón del sistema
- Afecta performance, scalability, security
- Sin esto, todo es adivinar
- **Time**: 3-4 días

**#2: Especifica 3 pipelines de ejecución (no 1)**
- Direct Tool (sin planning)
- Planned Execution (con planning)
- Workflow Execution (predefinido)
- Cada uno con su interface clara
- **Time**: 1 semana

**#3: Remove hardcoded decisions**
- No especifiques Cron (especifica TimeExpression)
- No especifiques OpenTelemetry SDK (especifica interface)
- No especifiques VectorDB (fase 2)
- **Time**: 2-3 días

### Cambios Adicionales

**#4: Unificar retry logic**
- ExecutionPolicy = única fuente de verdad
- Scheduler/Planner/Workflow usan ExecutionEngine
- **Time**: 3-4 días

**#5: Definir Observability Budget**
- SLOs para CPU/memory/network overhead
- Sampling rates por defecto
- Retention policies
- **Time**: 2-3 días

**#6: Agregar Compatibility Matrix**
- Qué rompe, qué no
- Plugin version compatibility
- Migration paths
- **Time**: 3-4 días

**#7: Especificar Policy Language**
- Elegir CEL vs OPA vs custom
- Define PolicyExpression interface
- **Time**: 3-4 días

---

## 3. ¿Qué 3 componentes implementarías primero y por qué?

### Priority 1: Capability Registry + Plugin SDK
**Why First:**
- No dependen de nada
- Desbloquea community participation
- Te permite validar plugin model
- **Time**: 3-4 semanas

**What to Build:**
```typescript
// MVP Plugin SDK
✅ AbelPlugin base class
✅ ToolPlugin builder
✅ Basic AIProvider interface
✅ Plugin registry (in-memory)
✅ Plugin testing utilities
✅ npm package publishing

🟡 Plugin sandboxing (SKIP for MVP)
🟡 Workflow plugins (MVP 1 plugin types)
🟡 Multi-provider selection
```

---

### Priority 2: Runtime Contract (Simplified)
**Why Second:**
- Necesario para que plugins funcionen
- Desbloquea E2E testing
- Define contrato fundamental
- **Time**: 2-3 semanas

**What to Build:**
```typescript
// MVP Runtime
✅ RuntimeContract interface
✅ Pipeline 1: Direct Tool execution
✅ Pipeline 2: Planned execution (with basic planner)
✅ Pipeline 3: Workflow execution (with basic state machine)
✅ ExecutionPolicy unification
✅ Basic Capability Discovery

🟡 Advanced Planning (Phase 2)
🟡 Multi-level memory (Phase 2)
🟡 Semantic search (Phase 2)
```

---

### Priority 3: Basic Scheduler
**Why Third:**
- Desbloquea durable workflows
- Requiere Event Sourcing
- Permite testeo de long-running processes
- **Time**: 2-3 semanas

**What to Build:**
```typescript
// MVP Scheduler
✅ SchedulerEngine interface
✅ In-memory scheduler (local dev)
✅ Cron support (via node-cron)
✅ Retry policy with backoff
✅ ExecutionState persistence (to DB)
✅ Error recovery on restart

🟡 Multi-tenant job separation (Phase 2)
🟡 Distributed scheduler (Phase 2)
🟡 Job chaining (Phase 2)
```

---

### What to SKIP for MVP

```
❌ Semantic memory (Phase 2)
❌ Multi-level memory (Phase 2)
❌ Advanced observability (Phase 2)
❌ Plugin sandboxing (Phase 2)
❌ Complex planning algorithms (Phase 2)
❌ Multi-region deployment (Phase 2)
❌ Kubernetes-specific features (Phase 2)
❌ AI Provider fallback chains (Phase 2)
```

---

## 4. Si fueras CTO, ¿aprobarías este RFC?

**NO. Rechazaría con feedback constructivo.**

### Mi Decision

**Votación**: 👎 Do Not Approve

**Reasoning:**

1. **Incomplete Specification** (2/5)
   - Interfaces críticas no especificadas (DecisionContext)
   - Flujos contradictorios
   - Responsabilidades duplicadas

2. **Architectural Risks** (2/5)
   - Promises that can't be kept (sandboxing)
   - Hardcoded decisions (cron, OpenTelemetry)
   - Scaling concerns (LLM per operation)

3. **Implementation Clarity** (3/5)
   - 50% de código está pseudocódigo
   - Plugin SDK builders son oversimplified
   - Security section es vaporware

4. **Design Maturity** (3/5)
   - Needs 4-6 more weeks of design
   - Too many components with unclear contracts
   - Decision tree for "which pipeline to use" is missing

### Recomendación

**Resubmit in 6 weeks with:**

```
✅ DecisionContext fully specified
✅ 3 execution pipelines (clear distinction)
✅ Retry logic unified
✅ Policy language chosen
✅ Observability budget defined
✅ Compatibility matrix
✅ Removed hardcoded implementation decisions
✅ Plugin sandboxing removed (replace with policy enforcement)
✅ Workflow/StateMachine separation
✅ MVP scope clearly defined (what's Phase 2)
```

### If I Had to Estimate Project Cost

```
Current Situation:
- RFC Status: INCOMPLETE
- Code readiness: 0% (can't start)
- Refinement needed: 6 weeks
- Implementation: 12-16 weeks
- Total: ~6 months to production-ready

If approved as-is and implemented:
- 30% rework in weeks 3-4 (discovering contradictions)
- 50% rework in weeks 5-8 (plugin model breaks)
- 40% rework in weeks 9-12 (scaling fails)
- Total waste: ~10 weeks
- Actual cost: 22 weeks instead of 12

Better to refine now, code later.
```

---

# 📋 RECOMENDACIÓN FINAL

## Immediate Actions (Next 2 weeks)

1. **Define DecisionContext** (3-4 days)
   - Make it the golden source of truth
   - Specify all fields and contracts
   - Document invariants

2. **Separate Execution Pipelines** (4-5 days)
   - Direct tool execution
   - Planned execution
   - Workflow execution
   - Each with clear interface

3. **Remove Implementation Details** (2-3 days)
   - Cron → TimeExpression
   - OpenTelemetry → TracingInterface
   - VectorDB → MemeoryInterface
   - PostgreSQL → StorageInterface

4. **Define Compatibility Strategy** (3-4 days)
   - Compatibility matrix
   - Version negotiation
   - Plugin version range support

5. **Add Observability Budget** (2-3 days)
   - CPU/memory/network limits
   - Sampling rates
   - Retention policies

## Then:

**Resubmit RFC** for Architecture Review Board approval

**Start Implementation** with clear scope:
- **Phase 1** (4 weeks): Registry + Scheduler + Basic Runtime
- **Phase 2** (4 weeks): Planner + Workflows
- **Phase 3** (4 weeks): Multi-level memory, advanced observability
- **Phase 4** (4 weeks): Enterprise features, plugins

---

# CONCLUSIÓN

**Esta arquitectura tiene IDEAS EXCELENTES pero ESPECIFICACIÓN MEDIOCRE.**

El concepto fundamental (agente como aggregate root, plugins desacoplados, engine-based architecture) es sólido.

**Pero la RFC tiene:**
- ❌ Contradicciones entre componentes
- ❌ Interfaces sin especificar
- ❌ Responsabilidades duplicadas
- ❌ Promesas imposibles de cumplir
- ❌ Decisiones irreversibles incluidas
- ❌ Pseudocódigo que parece código

**Recomendación**: **Invest 6 more weeks in design before implementing.**

**Expected outcome**: Production-ready architecture, realistic timeline, no mid-project rewrites.

---

**Audit Completed**: 2026-07-16  
**Auditor**: Principal Architect Review Board  
**Recommendation**: Resubmit after addressing critical issues  
**Confidence**: 95%
