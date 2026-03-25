module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  clearMocks: true,
  restoreMocks: true,
  coverageDirectory: 'coverage',
};
