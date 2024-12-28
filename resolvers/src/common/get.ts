/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, isObjectType } from "./toNestErrors";

export default <T>(
  obj: T,
  path: string | null | undefined,
  defaultValue?: unknown,
): any => {
  if (!path || !isObjectType(obj)) {
    return defaultValue;
  }

  const result = path
    .split(/[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (result, key) =>
        // eslint-disable-next-line @typescript-eslint/ban-types
        isNullOrUndefined(result) ? result : result[key as keyof {}],
      obj,
    );

  return result === undefined || result === obj
    ? obj[path as keyof T] === undefined
      ? defaultValue
      : obj[path as keyof T]
    : result;
};
