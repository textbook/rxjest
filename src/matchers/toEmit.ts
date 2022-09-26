import type { Observable } from "rxjs";

export async function toEmit<T>(
	this: jest.MatcherUtils,
	received$: Observable<T>,
	expected: T,
): Promise<jest.CustomMatcherResult> {
	const options = { comment: "deep equality", isNot: this.isNot as boolean };
	const emitted = await emittedUnless(received$, (actual) => this.equals(actual, expected));

	const pass = emitted === null;

	return {
		message: (): string => this.utils.matcherHint("toEmit", "observable$", "value", options)
			+ "\n\n"
			+ `Expected value: ${pass ? "not " : ""}${this.utils.printExpected(expected)}\n`
			+ (pass ? "" : `Emitted values: ${this.utils.printReceived(emitted)}\n`),
		pass,
	};
}

function emittedUnless<T>(stream$: Observable<T>, predicate: (actual: T) => boolean): Promise<T[] | null> {
	return new Promise<T[] | null>((resolve, reject) => {
		const emitted: T[] = [];
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
}
