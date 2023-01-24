import { Observable } from "rxjs";

export const after = <T>(ms: number, value: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export function errorIfThrown<T>(received$: Observable<T>, within?: number): Promise<unknown | null> {
	const thrown = new Promise((resolve) => {
		received$.subscribe({
			complete() {
				resolve(null);
			},
			error(err) {
				resolve(err);
			},
		});
	});
	return within === undefined
		? thrown
		: Promise.race([thrown, after(within, null)]);
}
