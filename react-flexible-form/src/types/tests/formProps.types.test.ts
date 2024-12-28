/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormProps } from "../formProps";
import { expectType } from "../isTypeEquals";
import { SetterOrValue } from "../setterOrValue";

type Values = {
  p: "p";
};

// setField... are required if errors, touched and dirty are provided

const formPropsError: FormProps<Values> = {
  initialValues: { p: "p" },
  errors: {},
  touched: {},
  dirty: {},
};

const formPropsSuccess: FormProps<Values> = {
  values: { p: "p" },
  errors: {},
  touched: {},
  dirty: {},

  setFieldValue: () => {},
  setFieldError: () => {},
  setFieldTouched: () => {},
  setFieldDirty: () => {},

  isLoading: false,
  setIsLoading: (setterOrValue) => {
    expectType<SetterOrValue<boolean>, typeof setterOrValue>(() => true);
  },

  isSubmitting: false,
  setIsSubmitting: (setterOrValue) => {
    expectType<SetterOrValue<boolean>, typeof setterOrValue>(() => true);
  },

  submitCount: 0,
  setSubmitCount: (setterOrValue) => {
    expectType<SetterOrValue<number>, typeof setterOrValue>(() => 0);
  },
};

// set... functions can be omitted (undefined)
// Either values or initialValues should be provided
const formPropsWoSetterFunctions: FormProps<Values> = {
  initialValues: { p: "p" },
};

const formPropsWithValuesOnly: FormProps<Values> = {
  values: { p: "p" },
  setFieldValue: () => {},
};

// @ts-expect-error Either values or initialValues should be provided
const formPropsWoValuesOrInitialValues: FormProps<Values> = {};

// @ts-expect-error if setErrors is provided - errors should also be provided
const formPropsWithErrors: FormProps<Values> = {
  initialValues: { p: "p" },
  // errors is required
  setFieldError: () => {},
};

// @ts-expect-error if setTouched is provided - errors should also be provided
const formPropsWithTouched: FormProps<Values> = {
  initialValues: { p: "p" },
  // touched is required
  setFieldTouched: () => {},
};

// @ts-expect-error if setDirty is provided - dirty should also be provided
const formPropsWithDirty: FormProps<Values> = {
  initialValues: { p: "p" },
  // dirty is required
  setFieldDirty: () => {},
};

// @ts-expect-error if setIsLoading is provided - isLoading should also be provided
const formPropsWithDirty: FormProps<Values> = {
  initialValues: { p: "p" },
  // isLoading is required
  setIsLoading: () => {},
};

// @ts-expect-error if setIsSubmitting is provided - isSubmitting should also be provided
const formPropsWithDirty: FormProps<Values> = {
  initialValues: { p: "p" },
  // isSubmitting is required
  setIsSubmitting: () => {},
};

// @ts-expect-error if setSubmitCount is provided - submitCount should also be provided
const formPropsWithDirty: FormProps<Values> = {
  initialValues: { p: "p" },
  // submitCount is required
  setSubmitCount: () => {},
};

// SubmitProps
type SubmitProps = {
  prop1: "prop1";
};

const formPropsSubmitProps: FormProps<Values, SubmitProps> = {
  values: { p: "p" },
  errors: {},
  touched: {},
  dirty: {},

  setFieldValue: () => {},
  setFieldError: () => {},
  setFieldTouched: () => {},
  setFieldDirty: () => {},

  onSubmit: ({ submitProps }) => {
    expectType<SubmitProps, typeof submitProps>({ prop1: "prop1" });
  },
};

// SubmitReturn
type SubmitReturn = {
  ret: "ret1";
};

const formPropsSubmitReturn: FormProps<Values, undefined, SubmitReturn> = {
  values: { p: "p" },
  errors: {},
  touched: {},
  dirty: {},

  setFieldValue: () => {},
  setFieldError: () => {},
  setFieldTouched: () => {},
  setFieldDirty: () => {},

  onSubmit: () => ({ ret: "ret1" }),
};
