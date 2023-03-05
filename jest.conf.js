const config = {
    verbose: true,
    moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "identity-obj-proxy",
        '^uuid$': require.resolve('uuid'),
    },
    setupFilesAfterEnv: [
        "@testing-library/jest-dom/extend-expect",
        '<rootDir>/jest.env.js',
    ],
    testEnvironment: 'jest-environment-jsdom',
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    coveragePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
};

module.exports = config;