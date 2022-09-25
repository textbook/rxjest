import type { Observable } from "rxjs";

export async function eventually<T>(stream$: Observable<T>, expected: T): Promise<boolean> {
	return false;
}
