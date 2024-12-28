/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormTouched<V> =
  // Check for V = any
  0 extends 1 & V
    ? any
    : NonNullable<V> extends (infer A)[]
      ? FormTouched<A>[]
      : {
          [K in keyof NonNullable<V>]?: NonNullable<
            NonNullable<V>[K]
          > extends (infer A)[]
            ? FormTouched<A>[]
            : NonNullable<NonNullable<V>[K]> extends object
              ? FormTouched<NonNullable<NonNullable<V>[K]>>
              : boolean;
        };
