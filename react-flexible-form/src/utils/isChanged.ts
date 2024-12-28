/* eslint-disable @typescript-eslint/no-explicit-any */
export const isChanged = <Values extends object = object>(
  a: Values,
  b: Values,
): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    const arr1 = a.length > b.length ? a : b;
    const arr2 = a.length <= b.length ? a : b;

    return arr1.some((elemA, index) => isChanged(elemA, arr2[index]));
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    const arr = (Array.isArray(a) ? a : b) as any[];

    return arr.some((elem) => isChanged(elem, undefined));
  }

  const aKeys = typeof a === "object" && a != null ? Object.keys(a) : [];
  const bKeys = typeof b === "object" && b != null ? Object.keys(b) : [];

  if (aKeys.length || bKeys.length) {
    // Combine keys of both objects
    const keysSet = [...aKeys, ...bKeys].reduce<{ [key: string]: 1 }>(
      (res, key) => {
        res[key] = 1;
        return res;
      },
      {},
    );

    return Object.keys(keysSet).some((key: string) => {
      const aValue =
        typeof a === "object" && a != null ? (a as any)[key] : undefined;
      const bValue =
        typeof b === "object" && b != null ? (b as any)[key] : undefined;

      return isChanged(aValue, bValue);
    });
  }

  return (a !== b) as any;
};
