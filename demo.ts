import "rxjest";
import { from } from "rxjs";

it("asserts that a matching value was emitted", async () => {
	await expect(from(["foo", "bar", "baz"])).toEmit("bar");
	await expect(from(["foo", "bar", "baz"])).not.toEmit("qux");
});
