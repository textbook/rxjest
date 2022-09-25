import { from } from "rxjs";

import { eventually } from "./index";

describe("RxJeSt", () => {
	describe("eventually", () => {
		it("resolves to false if no value matches", () => {
			return expect(eventually(from(["foo", "bar", "baz"]), "qux")).resolves.toBe(false);
		});
	});
});
