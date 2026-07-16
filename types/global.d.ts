/*
 * Type declarations for incremental TypeScript migration.
 * Keep this file small and focused on cross-cutting declarations.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: string;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    DEMO_EMPRESA_ID?: string;
  }
}
