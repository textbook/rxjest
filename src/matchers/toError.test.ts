import { from, Observable, throwError } from "rxjs";
import { toError } from ".";

import { createContext } from "./testUtils";

const defaultContext = createContext();

describe("toError", () => {
	it("determines passing test correctly", async () => {
		const { pass } = await toError.call(defaultContext, throwError(() => new Error("oh no!")));
		expect(pass).toBe(true);
	});

	it("determines failing test correctly", async () => {
		const { pass } = await toError.call(defaultContext, from([]));
		expect(pass).toBe(false);
	});

	it("shows if expected error not received", async () => {
		const { message } = await toError.call(defaultContext, from([]));
		expect(message().split("\n")).toStrictEqual([
			"expect(observable$).toError()",
			"",
			"Observable completed without error",
			"",
		]);
	});

	it("shows the error if received unexpectedly", async () => {
		const { message } = await toError.call(createContext({ isNot: true }), throwError(() => new Error("oh no!")));
		expect(message().split("\n")).toStrictEqual([
			"expect(observable$).not.toError()",
			"",
			"Expected value: not [Error: oh no!]",
			"",
		]);
	});

	it("supports setting a timeout", async () => {
		const { message, pass } = await toError.call(defaultContext, new Observable(), { within: 50 });
		expect(pass).toBe(false);
		expect(message().split("\n")).toStrictEqual([
			'expect(observable$).toError({"within":50})',
			"",
			"Observable did not error within 50ms",
			"",
		]);
	});
});
