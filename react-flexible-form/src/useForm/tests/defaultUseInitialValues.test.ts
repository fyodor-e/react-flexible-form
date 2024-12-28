/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "../../types";
import { beforeEach, expect, jest, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { defaultUseInitialValues } from "../defaultUseInitialValues";

type Values = {
  prop1: string;
  prop2: number;
};

const formControl: Omit<FormControl<Values>, "handleSubmit"> = {
  values: { prop1: "prop1", prop2: 12 },
  errors: {},
  touched: {},
  dirty: {},

  setFieldValue: jest.fn(),
  setFieldError: jest.fn(),
  setFieldTouched: jest.fn(),
  setFieldDirty: jest.fn(),

  submitCount: 0,
  isSubmitting: false,
  setIsSubmitting: jest.fn(),
  isLoading: false,
  setIsLoading: jest.fn(),

  isValid: true,
};

beforeEach(() => {
  (formControl.setFieldValue as any).mockReset();
});

test("Should return memoized initialValues if they are provided", async () => {
  const initialValues = { prop1: "abc", prop2: 123 };

  const { result } = renderHook(defaultUseInitialValues, {
    initialProps: { formControl, initialValues },
  });

  expect(result.current).toEqual(initialValues);
});

test("Should not change initialValues after they were initialized", async () => {
  const initialValues = { prop1: "abc", prop2: 123 };

  const { result, rerender } = renderHook(defaultUseInitialValues, {
    initialProps: { formControl, initialValues },
  });

  expect(result.current).toEqual(initialValues);

  rerender({
    formControl,
    initialValues: { prop1: "def", prop2: 456 },
  });

  expect(result.current).toEqual(initialValues);
});

test("Should not set initialValues when initialValues are undefined", async () => {
  const { result, rerender } = renderHook(defaultUseInitialValues, {
    initialProps: { formControl, initialValues: undefined as any },
  });

  expect(result.current).toEqual(undefined);

  const initialValues = { prop1: "abc", prop2: 123 };

  rerender({ formControl, initialValues });

  expect(result.current).toEqual(initialValues);
  expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual("");
  expect((formControl.setFieldValue as any).mock.calls[0][1]).toEqual(
    initialValues,
  );
});
