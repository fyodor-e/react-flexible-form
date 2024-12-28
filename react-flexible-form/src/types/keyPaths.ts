/* eslint-disable @typescript-eslint/no-explicit-any */
import { Increment } from "./increment";
import { UnionToIntersection } from "./unionToIntersection";

type GenNode<
  K extends string | number,
  IsRoot extends boolean,
> = IsRoot extends true
  ? // Empty string to reference to the whole object
    `${K}`
  : `.${K}`;

export type KeyPaths<
  V,
  IsRoot extends boolean = true,
  Iteration extends number = 0,
  O extends UnionToIntersection<
    Exclude<Extract<V, object>, Array<any>>
  > = UnionToIntersection<Exclude<Extract<V, object>, Array<any>>>,
  K extends keyof O = keyof O,
> =
  // First step is check for any. Any cannot be processed correctly
  0 extends 1 & V
    ? string
    : // If iteration be more that 7 typescript stops processing
      Iteration extends 7
      ? never
      : Extract<V, object> extends never
        ? never
        :
            | (IsRoot extends true ? "" : never)
            | (Extract<V, Array<any>> extends never
                ? never
                :
                    | GenNode<number, IsRoot>
                    | `${GenNode<number, IsRoot>}${KeyPaths<Extract<V, Array<any>>[number], false, Increment<Iteration>>}`)
            | (O extends never
                ? never
                : K extends string | number
                  ?
                      | GenNode<K, IsRoot>
                      | `${GenNode<K, IsRoot>}${KeyPaths<O[K], false, Increment<Iteration>>}`
                  : never);
