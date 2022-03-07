module.exports = {
	verbose: true,
	coverageProvider: "v8",
	errorOnDeprecated: true,
	maxWorkers: "50%",
	slowTestThreshold: 10,
	testMatch: [
		// "<rootDir>/tests/**/*.test.js",
		"<rootDir>/tests/*.test.js",
	],
	globalSetup: "<rootDir>/tests/config/globalSetup",
	globalTeardown: "<rootDir>/tests/config/globalTeardown",

	// clearMocks: false,
	// resetMocks: false,
	// restoreMocks: false,
};
