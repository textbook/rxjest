import { equals, iterableEquality, subsetEquality } from "@jest/expect-utils";
import chalk from "chalk";
import * as matcherUtils from "jest-matcher-utils";
import { from } from "rxjs";

import { toEmit } from "./matchers";

chalk.level = 0;

const context: jest.MatcherUtils = {
	dontThrow: () => undefined,
	equals,
	isNot: false,
	promise: "",
	utils: {
		...matcherUtils,
		iterableEquality,
		subsetEquality,
	},
};

describe("toEmit", () => {
	it("determines passing test correctly", async () => {
		const { pass } = await toEmit.call(context, from([1, 2, 3]), 2);
		expect(pass).toBe(true);
	});

	it("determines failing test correctly", async () => {
		const { pass } = await toEmit.call(context, from([1, 2, 3]), 4);
		expect(pass).toBe(false);
	});

	it("creates appropriate message for positive case", async () => {
		const { message } = await toEmit.call(context, from([1, 2, 3]), 4);
		expect(message().split("\n")).toStrictEqual([
			"expect(received).toEmit(expected) // deep equality",
			"",
			"Expected value: 4",
			"Emitted values: [1, 2, 3]",
			"",
		]);
	});

	it("creates appropriate message for negative case", async () => {
		const { message } = await toEmit.call({ ...context, isNot: true }, from([1, 2, 3]), 2);
		expect(message().split("\n")).toStrictEqual([
			"expect(received).not.toEmit(expected) // deep equality",
			"",
			"Expected value: not 2",
			"",
		]);
	});
});
