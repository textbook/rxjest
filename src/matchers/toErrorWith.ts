import { Observable } from "rxjs";

import { errorIfThrown } from "./utils";

export async function toErrorWith<T>(
	this: jest.MatcherUtils,
	received$: Observable<T>,
	expected: RegExp,
): Promise<jest.CustomMatcherResult> {
	const hintOptions = { isNot: this.isNot as boolean };
	const thrown = await errorIfThrown(received$);
	const message = getMessage(thrown);
	const pass = thrown !== null && message !== undefined && expected.test(message);
	return {
		message: () => this.utils.matcherHint("toErrorWith", "observable$", "expected", hintOptions)
			+ "\n\n"
			+ `Expected pattern: ${pass ? "not " : ""}${this.utils.printExpected(expected)}\n`
			+ (thrown === null ? "\nObservable completed without error" : `Received message: ${this.utils.printReceived(message)}`)
			+ "\n",
		pass,
	};
}

const getMessage = (error: unknown | null): string | undefined => {
	if (
		typeof error === "object"
		&& error !== null
		&& "message" in error
		&& typeof error.message === "string"
	) {
		return error.message;
	}
};
