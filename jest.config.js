module.exports = {
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage/",
  coveragePathIgnorePatterns: [
    "__avoid__",
    "__ignore__",
    "__mocks__",
    "dist",
    "node_modules"
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  moduleFileExtensions: ["ts", "js"],
  roots: ["src/"],
  testPathIgnorePatterns: [
    "__avoid__",
    "__ignore__",
    "__mocks__",
    "dist",
    "node_modules"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};