import { Observable } from "rxjs";

import type { Config } from "./config";
import { errorIfThrown } from "./utils";

export async function toError<T>(
	this: jest.MatcherUtils,
	received$: Observable<T>,
	options?: Partial<Config>,
): Promise<jest.CustomMatcherResult> {
	const hintOptions = { isNot: this.isNot as boolean };
	const expectedHint = options ? JSON.stringify(options) : "";
	const within = options?.within;
	const withoutError = within === undefined
		? "Observable completed without error\n"
		: `Observable did not error within ${within}ms\n`;

	const error = await errorIfThrown(received$, within);
	const pass = error !== null;

	return {
		message: () => this.utils.matcherHint("toError", "observable$", expectedHint, hintOptions)
			+ "\n\n"
			+ (pass ? `Expected value: not ${this.utils.printReceived(error)}\n` : withoutError),
		pass,
	};
}
