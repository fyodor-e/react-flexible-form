/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { UseFormSubmitCreator } from "../types";
import { deepSetTouched } from "../utils";

export const defaultUseFormSubmitCreator: UseFormSubmitCreator<
  any,
  any,
  any
> = ({ formControl, validator, onSubmit, setSubmitCount, setIsSubmitting }) =>
  useCallback(
    async (submitProps?: any) => {
      setSubmitCount(formControl.submitCount + 1);

      // Set all fields to touched
      formControl.setFieldTouched("", deepSetTouched(formControl.values));

      let errors = formControl.errors;
      // If validator is passed - use it to validate form and set errors
      if (validator) {
        errors = await validator(formControl);
        formControl.setFieldError("", errors);
      }

      // Submit form only if there are no errors after validation
      if (Object.keys(errors).length === 0 && onSubmit) {
        setIsSubmitting(true);
        return await onSubmit({ formControl, submitProps });
      }
    },
    [formControl, validator, onSubmit, setSubmitCount, setIsSubmitting],
  );
