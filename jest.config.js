module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    moduleNameMapper: {
        '^@api$': '<rootDir>/src/utils/burger-api',
        '^@utils-types$': '<rootDir>/src/utils/types',
        '^@pages$': '<rootDir>/src/pages',
        '^@components$': '<rootDir>/src/components',
        '^@ui$': '<rootDir>/src/components/ui',
        '^@slices$': '<rootDir>/src/services/slices',
        '^@selectors$': '<rootDir>/src/services/selectors'
    }
};