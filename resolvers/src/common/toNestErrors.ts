/* eslint-disable @typescript-eslint/no-explicit-any */
import get from "./get";
import { FieldError } from "./resolver";

export const isDateObject = (value: unknown): value is Date =>
  value instanceof Date;

export const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value == null;

export const isObjectType = (value: unknown): value is object =>
  typeof value === "object";

export const isObject = <T extends object>(value: unknown): value is T =>
  !isNullOrUndefined(value) &&
  !Array.isArray(value) &&
  isObjectType(value) &&
  !isDateObject(value);

export const isKey = (value: string) => /^\w*$/.test(value);

const compact = <TValue>(value: TValue[]) =>
  Array.isArray(value) ? value.filter(Boolean) : [];

const stringToPath = (input: string): string[] =>
  compact(input.replace(/["|']|\]/g, "").split(/\.|\[/));

const set = (object: any, path: string, value?: unknown) => {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;

  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = object[key];
      newValue =
        isObject(objValue) || Array.isArray(objValue)
          ? objValue
          : !isNaN(+tempPath[index + 1])
            ? []
            : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
};

export const toNestErrors = (errors: Record<string, FieldError>): any => {
  const fieldErrors: any = {};
  for (const path in errors) {
    const error = errors[path];

    if (isNameInFieldArray(Object.keys(errors), path)) {
      const fieldArrayErrors = Object.assign({}, get(fieldErrors, path));

      set(fieldArrayErrors, "root", error);
      set(fieldErrors, path, fieldArrayErrors);
    } else {
      set(fieldErrors, path, error);
    }
  }

  return fieldErrors;
};

const isNameInFieldArray = (names: any[], name: any) =>
  names.some((n) => n.startsWith(name + "."));
