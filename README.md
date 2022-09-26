# RxJeSt

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/textbook/rxjest/Node.js%20CI?logo=github)](https://github.com/textbook/rxjest/actions/workflows/push.yml)
[![NPM](https://img.shields.io/npm/v/rxjest?color=blue&logo=npm)](https://www.npmjs.com/package/rxjest)

[Jest] matchers for working with [RxJS] observables.

## Usage

Add the matchers to Jest by importing this package in a [setup file]:

```js
// jest.config.js
module.exports = {
  // ...
  "setupFilesAfterEnv": [
    "<rootDir>/setupTests.js"
  ]
}
```
```js
// setupTests.js
import "rxjest";  // or require("rxjest");
```

You can now use `.toEmit` to check that the supplied observable emits the specified value at some point before
completing:

```js
it("asserts that a matching value was emitted", async () => {
    await expect(from(["foo", "bar", "baz"])).toEmit("bar");
});
```

**Note** that this is an asynchronous matcher that needs to be `await`ed or `return`ed.

This matcher has the following failure cases:

- If the observable completes without a matching value being emitted, the test fails (and shows the values that _were_
    emitted, to aid in debugging):

    ```none
      ● extending Jest › failing examples for docs › shows emitted values
    
        expect(observable$).toEmit(value) // deep equality
    
        Expected value: "qux"
        Emitted values: ["foo", "bar", "baz"]
    
          34 |      fdescribe("failing examples for docs", () => {
          35 |              it("shows emitted values", async () => {
        > 36 |                      await expect(from(["foo", "bar", "baz"])).toEmit("qux");
             |                                                                ^
          37 |              });
          38 |
          39 |              it("passes errors to Jest", async () => {
    
          at Object.<anonymous> (src/index.test.ts:36:46)
    ```

- If the observable errors, the error is propagated to the test and reported by Jest:

    ```none
      ● extending Jest › failing examples for docs › passes errors to Jest
    
        oh no!
    
          38 |
          39 |              it("passes errors to Jest", async () => {
        > 40 |                      await expect(throwError(() => new Error("oh no!"))).toEmit(expect.anything());
             |                                                    ^
          41 |              });
          42 |
          43 |              it("times out", async () => {
    
          at src/index.test.ts:40:34
          at src/matchers.ts:25:11
          at emittedUnless (src/matchers.ts:23:9)
          at Object.toEmit (src/matchers.ts:9:24)
          at Object.<anonymous> (src/index.test.ts:40:56)
    ```

- If the observable neither emits a matching value nor completes within the timeout, the test times out:

    ```none
      ● extending Jest › failing examples for docs › times out
    
        thrown: "Exceeded timeout of 5000 ms for a test.
        Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."
    
          41 |              });
          42 |
        > 43 |              it("times out", async () => {
             |              ^
          44 |                      await expect(new Observable()).toEmit(123);
          45 |              });
          46 |      });
    
          at src/index.test.ts:43:3
          at src/index.test.ts:34:2
          at Object.<anonymous> (src/index.test.ts:5:1)
    ```

### Version support

- Jest: tested against v27, v28 and v29 (see `peerDependencies` field in `package.json`)
- Node: tested against v14, v16 and v18 (see `engines` field in `package.json`)
- RxJS: tested against v6 and v7 (see `peerDependencies` field in `package.json`)

### Linting

If you're using the Jest plugin for ESLint and have [`jest/valid-expect`][valid-expect] enabled, you can configure it
to understand that this matcher is asynchronous as follows:

```json5
{
  // ...
  "rules": {
    // ...
    "jest/valid-expect": [
      "error",
      {
        "asyncMatchers": [
          "toEmit"
        ]
      }
    ]
  }
}
```

[jest]: https://jestjs.io/
[rxjs]: https://rxjs.dev/
[setup file]: https://jestjs.io/docs/configuration#setupfilesafterenv-array
[valid-expect]: https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/valid-expect.md
