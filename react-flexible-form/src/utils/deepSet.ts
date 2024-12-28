/* eslint-disable @typescript-eslint/no-explicit-any */
/** Will set object properties that are present in n
 * And will not touch props that are present in old but absent in n
 * @param old original object
 * @param n new object
 */
export const deepSet = <O>(old: O, n: O): O => {
  if (Array.isArray(n) && Array.isArray(old)) {
    return n
      .map((e, i) => deepSet(old[i], e))
      .concat(old.slice(n.length)) as any;
  }

  if (Array.isArray(n)) return n;

  if (n != null && typeof n === "object") {
    const initial = old != null && typeof old === "object" ? old : {};
    return Object.entries(n).reduce<any>((res, [k, v]) => {
      res[k] = deepSet(res[k], v);
      return res;
    }, initial);
  }
  return n;
};
