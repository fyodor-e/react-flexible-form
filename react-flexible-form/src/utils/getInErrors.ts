/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyPaths, FormErrors } from "../types";
import { getIn } from "./getIn";

export const getInErrors = <
  // eslint-disable-next-line @typescript-eslint/ban-types
  Errors extends FormErrors<{}> = FormErrors<{}>,
  Name extends KeyPaths<Errors> = KeyPaths<Errors>,
>({
  errors,
  name,
}: {
  errors: Errors;
  name: Name;
}): string[] => {
  const error: any = getIn({ name: name as any, values: errors });
  if (!error) return [];

  let errorsArr: string[] = [];

  if (typeof error.types === "object" && typeof error.message === "string") {
    errorsArr = Object.values(error.types).filter(
      (m): m is string => typeof m === "string",
    );
  } else if (typeof error.message === "string") {
    errorsArr.push(error.message);
  }

  return errorsArr;
};
