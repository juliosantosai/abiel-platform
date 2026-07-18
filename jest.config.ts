/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testMatch: [
    "**/*.test.ts",
    "**/*.integration.test.ts",
    "**/*.contract.test.ts",
    "**/*.e2e.test.ts",
  ],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          allowJs: true,
          esModuleInterop: true,
          skipLibCheck: true,
          module: "CommonJS",
          moduleResolution: "Node",
          ignoreDeprecations: "6.0",
        },
        diagnostics: false,
      },
    ],
  },
};
