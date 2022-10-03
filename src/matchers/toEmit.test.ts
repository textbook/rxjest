import { from, timer } from "rxjs";

import { createContext } from "./testUtils";
import { toEmit } from ".";

const defaultContext = createContext();

describe("toEmit", () => {
	it("determines passing test correctly", async () => {
		const { pass } = await toEmit.call(defaultContext, from([1, 2, 3]), 2);
		expect(pass).toBe(true);
	});

	it("determines failing test correctly", async () => {
		const { pass } = await toEmit.call(defaultContext, from([1, 2, 3]), 4);
		expect(pass).toBe(false);
	});

	it("creates appropriate message for positive case", async () => {
		const { message } = await toEmit.call(defaultContext, from([1, 2, 3]), 4);
		expect(message().split("\n")).toStrictEqual([
			"expect(observable$).toEmit(value) // deep equality",
			"",
			"Expected value: 4",
			"Emitted values: [1, 2, 3]",
			"",
		]);
	});

	it("creates appropriate message for negative case", async () => {
		const { message } = await toEmit.call(createContext({ isNot: true }), from([1, 2, 3]), 2);
		expect(message().split("\n")).toStrictEqual([
			"expect(observable$).not.toEmit(value) // deep equality",
			"",
			"Expected value: not 2",
			"",
		]);
	});

	it("supports setting a timeout", async () => {
		const { message, pass } = await toEmit.call(defaultContext, timer(100), 0, { within: 50 });
		expect(pass).toBe(false);
		expect(message().split("\n")).toStrictEqual([
			'expect(observable$).toEmit(value, {"within":50}) // deep equality',
			"",
			"Expected value: 0",
			"Emitted values: []",
			"",
		]);
	});
});
