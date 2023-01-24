import { from, throwError } from "rxjs";

import { createContext } from "./testUtils";
import { toErrorWith } from "./toErrorWith";

const defaultContext = createContext();

describe("toErrorWith", () => {
	it("determines passing test correctly", async () => {
		const { pass } = await toErrorWith.call(defaultContext, throwError(() => new Error("oh no!")), /^oh no!$/);
		expect(pass).toBe(true);
	});

	it("creates appropriate message for positive case", async () => {
		const { message } = await toErrorWith.call(defaultContext, throwError(() => new Error("oh no!")), /^oh no!$/);
		expect(message().split("\n")).toStrictEqual([
			"expect(observable$).toErrorWith(expected)",
			"",
			"Expected pattern: not /^oh no!$/",
			"Received message: \"oh no!\"",
			"",
		]);
	});

	it("creates appropriate message for negative case", async () => {
		const { message } = await toErrorWith.call(createContext({ isNot: true }), throwError(() => new Error("oh no!")), /^oh no!$/);
		expect(message().split("\n")).toStrictEqual([
			"expect(observable$).not.toErrorWith(expected)",
			"",
			"Expected pattern: not /^oh no!$/",
			"Received message: \"oh no!\"",
			"",
		]);
	});

	it("determines failing test correctly", async () => {
		const { pass } = await toErrorWith.call(defaultContext, from([]), /oh no!/);
		expect(pass).toBe(false);
	});

	it("handles non-matching error", async () => {
		const { message, pass } = await toErrorWith.call(defaultContext, throwError(() => new Error("oh no!")), /^something went wrong$/);
		expect(pass).toBe(false);
		expect(message().split("\n")).toStrictEqual([
			"expect(observable$).toErrorWith(expected)",
			"",
			"Expected pattern: /^something went wrong$/",
			"Received message: \"oh no!\"",
			"",
		]);
	});
});
