/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormTouched } from "../types";

export const deepSetTouched = <O>(obj: O): FormTouched<O> => {
  if (Array.isArray(obj)) {
    return obj.map(deepSetTouched) as any;
  }
  if (obj != null && typeof obj === "object") {
    return Object.entries(obj).reduce<any>((res, [k, v]) => {
      res[k] = deepSetTouched(v);
      return res;
    }, {});
  }
  return true as any;
};
