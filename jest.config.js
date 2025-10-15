module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/renderer/$1',
    '^@/components/(.*)$': '<rootDir>/src/renderer/components/$1',
    '^@/stores/(.*)$': '<rootDir>/src/renderer/stores/$1',
    '^@/utils/(.*)$': '<rootDir>/src/renderer/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/renderer/types/$1',
  },
  collectCoverageFrom: [
    'src/renderer/**/*.{ts,tsx}',
    '!src/renderer/**/*.d.ts',
    '!src/renderer/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
}