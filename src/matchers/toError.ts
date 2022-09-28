import { Observable } from "rxjs";

export async function toError<T>(this: jest.MatcherUtils, received$: Observable<T>): Promise<jest.CustomMatcherResult> {
	const options = { isNot: this.isNot as boolean };
	const error = await new Promise((resolve) => {
		received$.subscribe({
			complete() {
				resolve(null);
			},
			error(err) {
				resolve(err);
			},
		});
	});
	const pass = error !== null;

	return {
		message: () => this.utils.matcherHint("toError", "observable$", "", options)
			+ "\n\n"
			+ (pass ? `Expected value: not ${this.utils.printReceived(error)}\n` : "Observable completed without error\n"),
		pass,
	};
}
