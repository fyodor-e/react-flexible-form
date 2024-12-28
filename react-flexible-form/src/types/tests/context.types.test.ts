import { FormControl } from "../formControl";

type Values = {
  p: "p";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const control: FormControl<Values> = {
  values: { p: "p" },
  errors: {},
  touched: {},
  dirty: {},

  setFieldValue: () => {},
  setFieldError: () => {},
  setFieldTouched: () => {},
  setFieldDirty: () => {},

  isSubmitting: false,
  setIsSubmitting: () => {},
  submitCount: 0,
  isLoading: false,
  setIsLoading: () => {},
  handleSubmit: () => Promise.resolve(),

  isValid: true,
};
