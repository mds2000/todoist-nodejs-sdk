import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['index.ts', 'types.ts'],
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
};

export default config;
