import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  displayName: 'playground',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.{ts,tsx}',
    '!app/**/loading.{ts,tsx}',
    '!app/**/error.{ts,tsx}',
    '!app/**/not-found.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/app/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/app/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/__tests__/**/*.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(customJestConfig)