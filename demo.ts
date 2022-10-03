import "rxjest";
import { from, Observable, throwError } from "rxjs";

it("asserts that a matching value was emitted", async () => {
	const source$ = from(["foo", "bar", "baz"]);
	await expect(source$).toEmit("bar");
	await expect(source$).not.toEmit("qux", { within: 500 });
});

it("asserts that an error was thrown", async () => {
	await expect(throwError(() => new Error("oh no!"))).toError();
	await expect(from(new Observable())).not.toError({ within: 10 });
});
