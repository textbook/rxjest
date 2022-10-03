import { from, Observable, throwError } from "rxjs";

import ".";

describe("extending Jest", () => {
	describe("toEmit", () => {
		it("works when value is emitted", async () => {
			await expect(from(["foo", "bar", "baz"])).toEmit("bar");
		});

		it("works when value is not emitted", async () => {
			await expect(from(["foo", "bar", "baz"])).not.toEmit("qux");
		});


		it("works when observable is empty", async () => {
			await expect(from([])).not.toEmit("bar");
		});

		it("works when observable errors", async () => {
			const err = new Error("oh no!");
			await expect(async () => {
				await expect(throwError(() => err)).toEmit("bar");
			}).rejects.toThrow(err);
		});

		it("works with object comparisons", async () => {
			await expect(from([{ hello: "world" }])).toEmit({ hello: "world" });
			await expect(from([{ hello: "world" }])).not.toEmit({ goodbye: "world" });
		});

		it("avoids timing out", async () => {
			await expect(new Observable()).not.toEmit(123, { within: 10 });
		}, 25);
	});

	describe("toError", () => {
		it("works when observable errors", async () => {
			await expect(throwError(() => new Error("oh no!"))).toError();
		});

		it("works when observable does not error", async () => {
			await expect(from([])).not.toError();
		});

		it("avoids timing out", async () => {
			await expect(new Observable()).not.toError({ within: 10 });
		}, 25);
	});

	// eslint-disable-next-line jest/no-disabled-tests
	describe.skip("failing examples for docs", () => {
		it("shows emitted values", async () => {
			await expect(from(["foo", "bar", "baz"])).toEmit("qux");
		});

		it("passes errors to Jest", async () => {
			await expect(throwError(() => new Error("oh no!"))).toEmit(expect.anything());
		});

		it("times out", async () => {
			await expect(new Observable()).toEmit(123);
		}, 100);

		it("can avoid timing out", async () => {
			await expect(new Observable()).toEmit(123, { within: 10 });
		}, 100);

		it("reports unexpected errors", async () => {
			await expect(throwError(() => new Error("oh no!"))).not.toError();
		});

		it("reports expected errors not received", async () => {
			await expect(from([])).toError();
		});
	});
});
