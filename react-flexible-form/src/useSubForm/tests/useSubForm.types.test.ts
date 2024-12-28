/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, expectType } from "../../types";
import { useSubform } from "../useSubform";

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
  const { values } = useSubform({
    formControl,
    name: "embeddedObj",
  });

  expectType<typeof values, Values["embeddedObj"]>({ prop2: "prop2" });
};

const NameIsPrimitive = () => {
  const { values } = useSubform({
    formControl,
    name: "prop1",
  });

  expectType<typeof values, never>("" as never);
};

const NameDoesNotExist = () => {
  useSubform({
    formControl,
    // @ts-expect-error incorrectProp is not in Values keys
    name: "incorrectProp",
  });
};
