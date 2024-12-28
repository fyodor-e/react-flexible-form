/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyPaths, DeepPick } from "../types";
import { getIn } from "./getIn";
import { prepareName } from "./prepareName";

export const setIn = <
  Values,
  Name extends KeyPaths<Values> = KeyPaths<Values>,
>({
  values,
  name,
  value,
}: {
  values: Values;
  name: Name;
  value: DeepPick<Values, Name>;
}): Values => {
  const prevValue = getIn({ values, name });
  if (prevValue === value) return values;

  const path = prepareName(name).split(".");

  return setInInternal({
    values,
    path,
    value,
  });
};

const setInInternal = ({
  values,
  path,
  value,
}: {
  values: any;
  path: string[];
  value: any;
}): any => {
  // If not path was provided
  if (path.length === 0 || path[0] === "") {
    return value;
  }

  if (values == null || typeof values !== "object") {
    values = isNaN(+path[0]) ? {} : [];
  }

  if (Array.isArray(values)) {
    if (isNaN(+path[0])) return values;

    return [
      ...values.slice(0, +path[0]),
      setInInternal({
        values: values[+path[0]],
        path: path.slice(1),
        value,
      }),
      ...values.slice(+path[0] + 1),
    ];
  }

  return {
    ...values,
    [path[0]]: setInInternal({
      values: values[path[0]],
      path: path.slice(1),
      value,
    }),
  };
};
