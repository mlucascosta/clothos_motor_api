/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript' },
          target: 'es2022',
          keepClassNames: true,
        },
        module: { type: 'commonjs' },
        sourceMaps: true,
      },
    ],
  },
  moduleNameMapper: {
    // Aliases com .js explícito (ex: @shared/domain/Either.js → src/shared/domain/Either)
    '^@shared/(.*)\\.js$': '<rootDir>/src/shared/$1',
    '^@application/(.*)\\.js$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)\\.js$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)\\.js$': '<rootDir>/src/presentation/$1',
    '^@domain/(.*)\\.js$': '<rootDir>/src/domain/$1',
    // Aliases sem .js
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    // Imports relativos com .js explícito
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/presentation/server.ts'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
};
