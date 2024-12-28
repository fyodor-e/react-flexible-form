/* eslint-disable @typescript-eslint/no-explicit-any */
// Max N is 999.
// Then Typescript fails with too deep nesting

export type Increment<
  N extends number = 0,
  Arr extends Array<any> = [],
> = Arr["length"] extends N ? [...Arr, 0]["length"] : Increment<N, [...Arr, 0]>;
