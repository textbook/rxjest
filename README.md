# RxJeSt

[![Node.js CI](https://github.com/textbook/rxjest/actions/workflows/push.yml/badge.svg)](https://github.com/textbook/rxjest/actions/workflows/push.yml)
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

### Matchers

Once added, the following matchers will be available:

#### `.toEmit`

`.toEmit` checks that the supplied observable emits the specified value at some point before completing:

```js
it("asserts that a matching value was emitted", async () => {
    await expect(from(["foo", "bar", "baz"])).toEmit("bar", { within: 25 });
});
```

**Note** that this is an asynchronous matcher that needs to be `await`ed or `return`ed.

This matcher takes an optional second argument, an object containing the following options:

- `within` - the time, in ms, to wait to see if the expected value is (or is not) emitted

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

        thrown: "Exceeded timeout of 100 ms for a test.
        Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."

          51 |              });
          52 |
      >   53 |              it("times out", async () => {
             |              ^
          54 |                      await expect(new Observable()).toEmit(123);
          55 |              }, 100);
          56 |

          at src/index.test.ts:53:3
          at src/index.test.ts:44:11
          at Object.<anonymous> (src/index.test.ts:5:1)
    ```

#### `.toError`

`.toError` checks that the supplied observable errors rather than completing:

```js
it("asserts that the observable errors", async () => {
    await expect(throwError(() => new Error("oh no!"))).toError();
});
```

**Note** that this is an asynchronous matcher that needs to be `await`ed or `return`ed.

This matcher takes an optional argument, an object containing the following options:

- `within` - the time, in ms, to wait to see if the observable errors (or does not)

This matcher has the following failure cases:

- If the observable completes without an error, that is shown explicitly:

    ```none
      ● extending Jest › failing examples for docs › reports expected errors not received

        expect(observable$).toError()

        Observable completed without error

          60 |
          61 |              it("reports expected errors not received", async () => {
        > 62 |                      await expect(from([])).toError();
             |                                             ^
          63 |              });
          64 |      });
          65 | });

          at Object.<anonymous> (src/index.test.ts:62:27)
    ```

- If an unexpected error is thrown, it is shown in the output:

    ```none
      ● extending Jest › failing examples for docs › reports unexpected errors

        expect(observable$).not.toError()

        Expected value: not [Error: oh no!]

          56 |
          57 |              it("reports unexpected errors", async () => {
        > 58 |                      await expect(throwError(() => new Error("oh no!"))).not.toError();
             |                                                                              ^
          59 |              });
          60 |
          61 |              it("reports expected errors not received", async () => {

          at Object.<anonymous> (src/index.test.ts:58:60)
    ```

- If the observable does not error within the timeout, the test times out (see example above)

#### `.toErrorWith`

`.toErrorWith` checks that the supplied observable errors with a matching message rather than completing:

```js
it("asserts that the observable errors", async () => {
    await expect(throwError(() => new Error("oh no!"))).toErrorWith(/^oh no!$/);
});
```

**Note** that this is an asynchronous matcher that needs to be `await`ed or `return`ed.

This matcher has the following failure cases:

- If the observable completes without an error, that is shown explicitly:

    ```none
      ● extending Jest › failing examples for docs › reports matching errors not received

        expect(observable$).toErrorWith(expected)

        Expected pattern: /whoops/

        Observable completed without error

          90 |
          91 |              it("reports matching errors not received", async () => {
        > 92 |                      await expect(from([])).toErrorWith(/whoops/);
             |                                             ^
          93 |              });
          94 |
          95 |              it("reports mismatched errors received", async () => {

          at Object.<anonymous> (src/index.test.ts:92:27)
    ```

- If an unexpected error is thrown, it is shown in the output:

    ```none
      ● extending Jest › failing examples for docs › reports mismatched errors received

        expect(observable$).toErrorWith(expected)

        Expected pattern: /whoops/
        Received message: "oh no!"

          94 |
          95 |              it("reports mismatched errors received", async () => {
      >   96 |                      await expect(throwError(() => new Error("oh no!"))).toErrorWith(/whoops/);
             |                                                                          ^
          97 |              });
          98 |
          99 |              it("reports matched errors unexpectedly received", async () => {

          at Object.<anonymous> (src/index.test.ts:96:56)
    ```

- If an unexpected match is received it is shown:

    ```none
      ● extending Jest › failing examples for docs › reports matched errors unexpectedly received

        expect(observable$).not.toErrorWith(expected)

        Expected pattern: not /oh no/
        Received message: "oh no!"

           98 |
           99 |             it("reports matched errors unexpectedly received", async () => {
        > 100 |                     await expect(throwError(() => new Error("oh no!"))).not.toErrorWith(/oh no/);
              |                                                                             ^
          101 |             });
          102 |     });
          103 | });

          at Object.<anonymous> (src/index.test.ts:100:60)
    ```

### Version support

- **Jest**: tested against v27, v28 and v29 (see `peerDependencies` field in `package.json`)
- **Node**: tested against v14, v16 and v18 (see `engines` field in `package.json`)
- **RxJS**: tested against v6 and v7 (see `peerDependencies` field in `package.json`)

### Linting

If you're using the Jest plugin for ESLint and have [`jest/valid-expect`][valid-expect] enabled, you can configure it
to understand that the matchers are asynchronous as follows:

```json5
{
  // ...
  "rules": {
    // ...
    "jest/valid-expect": [
      "error",
      {
        "asyncMatchers": [
          "toEmit",
          "toError",
          "toErrorWith"
        ]
      }
    ]
  }
}
```

## Development

You can [fork and clone] this repository to work on it. Once you've cloned the code locally, install the dependencies
with `npm ci` then check everything is installed and running correctly with `npm run ship`.

### Scripts

The following convenience scripts are provided for development and can be run with `npm run <script>`:

- `build`: Transpile the source code from `src/` to `lib/`
- `e2e`: Test the package at an E2E level using `bin/e2e.sh`
  - The script takes an argument specifying the version to download from NPM and test or `local` to test the current
    code (e.g. `npm run e2e -- x.y.z`)
  - When testing the local package, use the `--build` flag to rebuild and repack the package (i.e.
    `npm run e2e -- local --build`)
  - The version of Jest installed in the example package can be overridden from the default (v29) using the
    `JEST_VERSION` environment variable
  - The version of RxJS installed in the example package can be overridden from the default (v7) using the
    `RXJS_VERSION` environment variable
- `lint`: Check the code style with ESLint
- `ship`: Lint, then run low-level tests, then run high-level tests
- `test`: Test the source code at a unit and integration level using Jest

### Testing

There are three levels of testing:

- **E2E**: the highest level is provided by actually using RxJeSt in an example package. The tests used here are
  in `demo.js` (which is copied into the example package and renamed by `bin/e2e.sh`).
- **Integration**: `index.test.js` uses the matchers in an actual Jest context, but is still importing source code
  rather than using the transpiled package
- **Unit**: the lowest level of tests are in `src/matchers/<matcher>.test.ts`. These can check more granular details of
  e.g. failing test messages by directly invoking the matcher functions with a context equivalent to what Jest provides
  as `this` (the context can be created with `createContext` from `src/matchers/testUtils.ts`).

[fork and clone]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks
[jest]: https://jestjs.io/
[rxjs]: https://rxjs.dev/
[setup file]: https://jestjs.io/docs/configuration#setupfilesafterenv-array
[valid-expect]: https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/valid-expect.md
