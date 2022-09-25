import type { Observable } from "rxjs";
import { first, firstValueFrom } from "rxjs";

export async function eventually<T>(stream$: Observable<T>, expected: T): Promise<boolean> {
	return firstValueFrom(stream$.pipe(first((actual) => {
		try {
			expect(actual).toEqual(expected);
			return true;
		} catch {
			return false;
		}
	}))).then(() => true).catch(() => false);
}
