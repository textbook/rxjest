import { from, throwError } from "rxjs";

import { eventually } from "./index";

describe("RxJeSt", () => {
	describe("eventually", () => {
		it("resolves to false if no value matches", async () => {
			await expect(eventually(from(["foo", "bar", "baz"]), "qux")).resolves.toBe(false);
		});

		it("resolves to false if no value is emitted", async () => {
			await expect(eventually(from([]), "qux")).resolves.toBe(false);
		});

		it("resolves to true if any value matches", async () => {
			await expect(eventually(from(["foo", "bar", "baz"]), "bar")).resolves.toBe(true);
		});

		it("resolves to false if the observable errors", async () => {
			await expect(eventually(throwError(() => "oh no!"), "qux")).resolves.toBe(false);
		});
	});
});
