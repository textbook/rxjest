import type { Observable } from "rxjs";

import type { Config } from "./config";

export async function toEmit<T>(
	this: jest.MatcherUtils,
	received$: Observable<T>,
	expected: T,
	options?: Partial<Config>,
): Promise<jest.CustomMatcherResult> {
	const hintOptions = { comment: "deep equality", isNot: this.isNot as boolean };
	const expectedHint = options ? `value, ${JSON.stringify(options)}` : "value";
	const emitted = await emittedUnless(received$, (actual) => this.equals(actual, expected), options?.within);

	const pass = emitted === null;


	return {
		message: (): string => this.utils.matcherHint("toEmit", "observable$", expectedHint, hintOptions)
			+ "\n\n"
			+ `Expected value: ${pass ? "not " : ""}${this.utils.printExpected(expected)}\n`
			+ (pass ? "" : `Emitted values: ${this.utils.printReceived(emitted)}\n`),
		pass,
	};
}

function emittedUnless<T>(
	stream$: Observable<T>,
	predicate: (actual: T) => boolean,
	within?: number,
): Promise<T[] | null> {
	const emitted: T[] = [];
	const emissions = new Promise<T[] | null>((resolve, reject) => {
		stream$.subscribe({
			complete() {
				resolve(emitted);
			},
			error(err) {
				reject(err);
			},
			next: (actual) => {
				if (predicate(actual)) {
					resolve(null);
				} else {
					emitted.push(actual);
				}
			},
		});
	});
	return within === undefined
		? emissions
		: Promise.race([emissions, after(within, emitted)]);
}

const after = <T>(ms: number, value: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));
