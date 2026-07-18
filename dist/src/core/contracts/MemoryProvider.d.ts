export interface MemoryEntry<TValue = unknown> {
    key: string;
    value: TValue;
    tenantId?: string;
    namespace?: string;
    metadata?: Record<string, unknown>;
}
export interface MemoryQuery {
    key?: string;
    namespace?: string;
    tenantId?: string;
    limit?: number;
    metadata?: Record<string, unknown>;
}
export interface MemoryProvider<TValue = unknown> {
    store(entry: MemoryEntry<TValue>): Promise<void>;
    retrieve(query: MemoryQuery): Promise<MemoryEntry<TValue>[]>;
}
//# sourceMappingURL=MemoryProvider.d.ts.map