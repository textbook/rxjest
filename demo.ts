import "rxjest";
import { from, throwError } from "rxjs";

it("asserts that a matching value was emitted", async () => {
	await expect(from(["foo", "bar", "baz"])).toEmit("bar");
	await expect(from(["foo", "bar", "baz"])).not.toEmit("qux");
});

it("asserts that an error was thrown", async () => {
	await expect(throwError(() => new Error("oh no!"))).toError();
	await expect(from([])).not.toError();
});
