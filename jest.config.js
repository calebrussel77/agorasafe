/**
 * Link https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
 * Link https://nextjs.org/docs/testing
 **/

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

/** @type {import('ts-jest').JestConfigWithTsJest} */
const customJestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.jest.json',
    },
  },

  setupFilesAfterEnv: ['./src/jest.setup.ts'],

  // if using TypeScript with a baseUrl set to the root directory
  // then you need the below for alias' to work
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@formkit/auto-animate':
      '<rootDir>/src/jest/__mocks__/@formkit/auto-animate.ts',
  },

  moduleDirectories: ['node_modules', 'src'],

  modulePathIgnorePatterns: ['.history'],

  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
