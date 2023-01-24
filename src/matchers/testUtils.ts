import { equals, iterableEquality, subsetEquality } from "@jest/expect-utils";
import chalk from "chalk";
import * as matcherUtils from "jest-matcher-utils";

chalk.level = 0;

export const createContext: (overrides?: Partial<jest.MatcherUtils>) => jest.MatcherUtils = (overrides) => ({
	customTesters: [],
	dontThrow: () => undefined,
	equals,
	isNot: false,
	promise: "",
	utils: {
		...matcherUtils,
		iterableEquality,
		subsetEquality,
	},
	...overrides,
});
