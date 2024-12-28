/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormErrors, UseValidate } from "../types";
import { useCallback, useEffect } from "react";

export const defaultUseValidate: UseValidate<any> = ({
  formControl: { values, setFieldError },
  resolver,
  context,
  criteriaMode,
}): (() => Promise<FormErrors<any>>) => {
  const validator = useCallback(async () => {
    const { errors } = resolver
      ? await resolver(values, context, {
          criteriaMode,
          shouldUseNativeValidation: false,
          fields: undefined,
        })
      : { errors: {} };
    return errors as FormErrors<any>;
  }, [resolver, context, values, criteriaMode]);

  useEffect(() => {
    (async () => {
      const newErrors = await validator();
      setFieldError("", newErrors);
    })();
  }, [validator, setFieldError]);

  return validator;
};
