import { FormControl } from "../formControl";
import { expectType, FieldError, FormTouched } from "..";

type Values = {
  p: "p" | "c";
  arr: {
    prop2: number;
  }[];
};

const formControl: FormControl<Values> = {
  values: { p: "p", arr: [] },
  errors: {},
  touched: {},
  dirty: {},
  setFieldValue: () => {},
  setFieldTouched: () => {},
  setFieldError: () => {},
  setFieldDirty: () => {},
  submitCount: 0,
  isSubmitting: false,
  setIsSubmitting: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isValid: true,
  handleSubmit: () => Promise.resolve(),
};

formControl.setFieldValue("p", "c");
formControl.setFieldValue("p", (prev) => {
  expectType<Values["p"], typeof prev>(prev);
  return prev;
});

formControl.setFieldValue("arr.1", { prop2: 12 });
formControl.setFieldValue("arr.1", (prev) => {
  expectType<Values["arr"][number], typeof prev>(prev);
  return prev;
});

formControl.setFieldError("arr", { message: "error" });
formControl.setFieldError("arr", (prev) => {
  expectType<
    FieldError | ({ prop2?: FieldError | undefined } | undefined)[] | undefined,
    typeof prev
  >(prev);
  return prev;
});

formControl.setFieldTouched("arr.1", { prop2: false });
formControl.setFieldTouched("arr", (prev) => {
  expectType<FormTouched<Values["arr"]> | undefined, typeof prev>(prev);
  return prev;
});

formControl.setFieldDirty("arr.1", { prop2: false });
formControl.setFieldDirty("arr", (prev) => {
  expectType<FormTouched<Values["arr"]> | undefined, typeof prev>(prev);
  return prev;
});
