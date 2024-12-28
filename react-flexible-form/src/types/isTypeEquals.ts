// https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
type IfEquals<T, U, Y = unknown, N = never> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? Y : N;

/**
 * Issues a type error if `Expected` is not identical to `Actual`.
 *
 * `Expected` should be declared when invoking `expectType`.
 * `Actual` should almost always we be a `typeof value` statement.
 *
 * @example `expectType<number | string, typeof value>(value)`
 * TypeScript issues a type error since `value is not assignable to never`.
 * This means `typeof value` is not identical to `number | string`
 * @param _actual
 */
export function expectType<Expected, Actual>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _actual: IfEquals<Actual, Expected, Actual>,
): void {}
