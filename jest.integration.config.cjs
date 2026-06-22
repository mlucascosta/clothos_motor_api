/** @type {import('jest').Config} */
const base = require('./jest.config.cjs');

module.exports = {
  ...base,
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/*.test.ts'],
  // O base ignora `tests/integration` (para a suíte unitária não rodá-los).
  // Aqui é o oposto: estes SÃO os testes de integração — não herdar esse ignore.
  testPathIgnorePatterns: ['node_modules', 'dist'],
  globalSetup: '<rootDir>/tests/integration/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/integration/setup/globalTeardown.ts',
  // Testes de integração não participam do threshold de cobertura unitária
  collectCoverage: false,
  // runInBand já passado via CLI; reforça execução serial (sem workers extras)
  maxWorkers: 1,
  // Timeout generoso: concorrência com 50 jobs + EXPLAIN podem demorar
  testTimeout: 30000,
};
