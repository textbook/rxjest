import * as matchers from "./matchers";

declare global {
	namespace jest {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface Matchers<R> {
			toEmit<T>(expected: T, options?: Partial<matchers.Config>): Promise<CustomMatcherResult>;
			toError(): Promise<CustomMatcherResult>;
		}
	}
}

expect.extend(matchers);
