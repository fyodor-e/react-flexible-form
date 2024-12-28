/* eslint-disable @typescript-eslint/no-explicit-any */
import { Increment } from "./increment";
import { UnionToIntersection } from "./unionToIntersection";

export type CheckUndefined<
  T,
  IsUndefined extends boolean,
> = undefined extends T & undefined
  ? true
  : [NonNullable<T>] extends [UnionToIntersection<NonNullable<T>>]
    ? IsUndefined
    : true;

export type CheckNull<T, IsNull extends boolean> = null extends T & null
  ? true
  : IsNull;

export type SetNullUndefined<
  T,
  IsNull extends boolean,
  IsUndefined extends boolean,
> = IsNull extends true
  ? IsUndefined extends true
    ? T | null | undefined
    : T | null
  : IsUndefined extends true
    ? T | undefined
    : T;

// number literal (i.e. '1') is converted to number, string literal (i.e. 'prop') is left unchanged
type GetKey<T> = T extends `${infer N extends number}` ? N : T;

type SingleDeepPick<
  T,
  P,
  IsNull extends boolean,
  IsUndefined extends boolean,
  Iteration extends number = 0,
  Intersection = UnionToIntersection<Extract<NonNullable<T>, object>>,
> = Iteration extends 7
  ? never
  : P extends `${infer K}.${infer R}`
    ? GetKey<K> extends keyof Intersection
      ? SingleDeepPick<
          Intersection[GetKey<K>],
          R,
          CheckNull<T, IsNull>,
          CheckUndefined<T, IsUndefined>,
          Increment<Iteration>
        >
      : unknown
    : GetKey<P> extends keyof Intersection
      ? SetNullUndefined<
          Intersection[GetKey<P>],
          CheckNull<T, IsNull>,
          CheckUndefined<T, IsUndefined>
        >
      : unknown;

export type DeepPick<T, P> =
  // First step is check for any. Any cannot be processed correctly
  0 extends 1 & T ? any : P extends "" ? T : SingleDeepPick<T, P, false, false>;
