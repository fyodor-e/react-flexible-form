/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";
import { FieldError, Resolver } from "../common/resolver";
import { appendErrors } from "../common/appendErrors";
import { toNestErrors } from "../common/toNestErrors";

/**
 * Why `path!` ? because it could be `undefined` in some case
 * https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
 */
const parseErrorSchema = (
  error: Yup.ValidationError,
  validateAllFieldCriteria: boolean,
) => {
  return (error.inner || []).reduce<Record<string, FieldError>>(
    (previous, error) => {
      if (!error.path) return previous;

      if (!previous[error.path]) {
        previous[error.path] = { message: error.message, type: error.type };
      }

      if (validateAllFieldCriteria) {
        const types = previous[error.path].types;
        const messages = types && error.type && types[error.type];

        previous[error.path] = appendErrors({
          name: error.path,
          validateAllFieldCriteria,
          errors: previous,
          type: error.type,
          message: Array.isArray(messages)
            ? [...messages, error.message]
            : error.message,
        }) as FieldError;
      }

      return previous;
    },
    {},
  );
};

export function yupResolver<TFieldValues extends object>(
  schema:
    | Yup.ObjectSchema<TFieldValues>
    | ReturnType<typeof Yup.lazy<Yup.ObjectSchema<TFieldValues>>>,
  schemaOptions: Parameters<(typeof schema)["validate"]>[1] = {},
  resolverOptions: {
    /**
     * @default async
     */
    mode?: "async" | "sync";
    /**
     * Return the raw input values rather than the parsed values.
     * @default false
     */
    raw?: boolean;
  } = {},
): Resolver<Yup.InferType<typeof schema>> {
  return async (values, context, options) => {
    try {
      await schema[
        resolverOptions.mode === "sync" ? "validateSync" : "validate"
      ](
        values,
        Object.assign({ abortEarly: false }, schemaOptions, { context }),
      );

      return {
        errors: {},
      };
    } catch (e: any) {
      if (!e.inner) {
        throw e;
      }

      return {
        errors: toNestErrors(
          parseErrorSchema(e, options.criteriaMode === "all"),
        ),
      };
    }
  };
}
