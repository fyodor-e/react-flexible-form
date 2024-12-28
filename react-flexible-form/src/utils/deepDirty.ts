/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormTouched } from "../types";

export const deepDirty = <Values>(
  a: Values,
  b: Values,
): FormTouched<Values> => {
  if (Array.isArray(a) && Array.isArray(b)) {
    const arr1 = a.length > b.length ? a : b;
    const arr2 = a.length <= b.length ? a : b;

    return arr1.map((elemA, index) => deepDirty(elemA, arr2[index])) as any;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    const arr = (Array.isArray(a) ? a : b) as any[];

    return arr.map((elem) => deepDirty(elem, undefined)) as any;
  }

  const aKeys = typeof a === "object" && a != null ? Object.keys(a) : [];
  const bKeys = typeof b === "object" && b != null ? Object.keys(b) : [];

  if (aKeys.length || bKeys.length) {
    // Combine keys of both objects
    const keysObj = [...aKeys, ...bKeys].reduce<{
      [key: string]: 1;
    }>((res, key) => {
      res[key] = 1;
      return res;
    }, {});

    return Object.keys(keysObj).reduce<any>((res, key) => {
      const aValue =
        typeof a === "object" && a != null ? (a as any)[key] : undefined;
      const bValue =
        typeof b === "object" && b != null ? (b as any)[key] : undefined;

      res[key] = deepDirty(aValue, bValue);
      return res;
    }, {});
  }

  return (a !== b) as any;
};
