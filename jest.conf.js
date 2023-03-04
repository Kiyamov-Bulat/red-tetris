const config = {
    verbose: true,
    moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "identity-obj-proxy",
        '^uuid$': require.resolve('uuid'),
    },
    testEnvironment: 'jest-environment-jsdom',
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
    // transformIgnorePatterns: [
    //     `/node_modules/(?!(somePkg)|react-dnd|core-dnd|@react-dnd)`,
    // ],
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