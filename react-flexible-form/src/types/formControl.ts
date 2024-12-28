/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetField } from "./formProps";
import { FormTouched } from "./formTouched";
import { FormErrors } from "./resolver";
import { SetterOrValue } from "./setterOrValue";

export type FormControl<
  Values extends object,
  SubmitProps = undefined,
  SubmitReturn = void,
> = {
  values: Values;
  errors: FormErrors<Values>;
  touched: FormTouched<Values>;
  dirty: FormTouched<Values>;
  setFieldValue: SetField<Values>;
  setFieldError: SetField<FormErrors<Values>>;
  setFieldTouched: SetField<FormTouched<Values>>;
  setFieldDirty: SetField<FormTouched<Values>>;

  submitCount: number;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: SetterOrValue<boolean>) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: SetterOrValue<boolean>) => void;

  isValid: boolean;

  handleSubmit: undefined extends SubmitProps & undefined
    ? () => Promise<SubmitReturn>
    : (submitProps: SubmitProps) => Promise<SubmitReturn>;
};
