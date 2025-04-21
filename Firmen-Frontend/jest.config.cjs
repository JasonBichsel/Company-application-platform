module.exports = {
//  preset: 'vite-jest',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  //testMatch: ['**/src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  //setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns:["<rootDir>/node_modules</rootDir>"],
  moduleNameMapper: {
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '\\.css$': '<rootDir>/src/mocks/styleMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'] // Falls du die setup.js Datei benutzt
};
