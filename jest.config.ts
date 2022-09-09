import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
	cache: false,
	preset: "ts-jest",
	testEnvironment: "jsdom",
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	verbose: true,
	automock: false, // tells Jest to automatically create a mocked version of any imported code.
	setupFilesAfterEnv: ["./test/setupTests.ts"],
	moduleNameMapper: {
		"\\~(.*)": "./src/$1"
	},
	transform: {
		"^.+\\.(tsx|jsx|ts|js|mjs)?$": "@swc-node/jest"
	},
	moduleFileExtensions: [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],
	modulePathIgnorePatterns: ["./dist/"],
	collectCoverage: true,
	collectCoverageFrom: ["./src/**"]
}
export default config
