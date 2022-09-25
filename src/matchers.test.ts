import { equals, iterableEquality, subsetEquality } from "@jest/expect-utils";
import * as matcherUtils from "jest-matcher-utils";
import { from } from "rxjs";

import { toEmit } from "./matchers";

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
			"\u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoEmit\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // deep equality\u001b[22m",
			"",
			"Expected value: \u001b[32m4\u001b[39m",
			"Emitted values: \u001b[31m[1, 2, 3]\u001b[39m",
			"",
		]);
	});

	it("creates appropriate message for negative case", async () => {
		const { message } = await toEmit.call({ ...context, isNot: true }, from([1, 2, 3]), 2);
		expect(message().split("\n")).toStrictEqual([
			"\u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mnot\u001b[2m.\u001b[22mtoEmit\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // deep equality\u001b[22m",
			"",
			"Expected value: not \u001b[32m2\u001b[39m",
			"",
		]);
	});
});
