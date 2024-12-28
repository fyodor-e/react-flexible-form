/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, expectType } from "../../types";
import { useFieldArray } from "../useFieldArray";

type Values = {
  prop1: "prop1";
  embeddedObj: {
    prop2: "prop2";
  };
  array: { arrP: string }[];
  array2: { e2: number }[];
};

const formControl: FormControl<Values> = {
  values: {
    prop1: "prop1",
    embeddedObj: {
      prop2: "prop2",
    },
    array: [],
    array2: [],
  },
  touched: {},
  errors: {},
  dirty: {},
  setFieldValue: () => {},
  setFieldError: () => {},
  setFieldTouched: () => {},
  setFieldDirty: () => {},

  submitCount: 0,
  isSubmitting: false,
  setIsSubmitting: () => {},
  isLoading: false,
  setIsLoading: () => {},
  handleSubmit: () => Promise.resolve(),
  isValid: true,
};

const Success = () => {
  const { append } = useFieldArray({
    formControl,
    name: "array",
  });

  expectType<typeof append, (e: Values["array"][number]) => void>(() => {});
};

const NameIsNotArray = () => {
  const { append } = useFieldArray({
    formControl,
    // @ts-expect-error name should point to array
    name: "embeddedObj",
  });

  // @ts-expect-error append type is not correct when name does not point to array
  expectType<typeof append, (e: Values["array"][number]) => void>(() => {});
};

const NameIsArrayIndex = () => {
  const { append } = useFieldArray({
    formControl,
    // @ts-expect-error name should point to array
    name: "array.0",
  });

  // @ts-expect-error append type is not correct when name does not point to array
  expectType<typeof append, (e: Values["array"][number]) => void>(() => {});
};
