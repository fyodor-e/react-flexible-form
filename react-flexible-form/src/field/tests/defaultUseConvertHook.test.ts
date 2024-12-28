/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "../../types";
import { expect, jest, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { defaultUseConvert } from "../defaultUseConvert";

const formControl: FormControl<{ prop1: string; prop2: number }> = {
  values: { prop1: "prop1", prop2: 1 },
  errors: { prop1: { message: "prop1Error", type: "required" } },
  touched: { prop1: true },
  dirty: {},

  setFieldError: jest.fn() as any,
  setFieldTouched: jest.fn() as any,
  setFieldValue: jest.fn() as any,
  setFieldDirty: jest.fn() as any,

  submitCount: 0,
  isSubmitting: false,
  setIsSubmitting: jest.fn() as any,
  isLoading: false,
  setIsLoading: jest.fn(),
  handleSubmit: () => Promise.resolve(),

  isValid: true,
};

test("should return value, error and touched using passed rffName", () => {
  const initialProps = {
    rffName: "prop1",
    formControl,
  };

  const { result } = renderHook((props) => defaultUseConvert(props), {
    initialProps,
  });

  expect(result.current.value).toBe(formControl.values.prop1);
  expect(result.current.error).toBe(formControl.errors.prop1?.message);
  expect(result.current.touched).toBe(formControl.touched.prop1);

  expect(result.current.onBlur).toEqual(expect.any(Function));
  expect(result.current.onChange).toEqual(expect.any(Function));
});

test("should memoize values event if other props of the formControl has been changed", () => {
  const initialProps = {
    rffName: "prop1",
    formControl,
  };

  const { result, rerender } = renderHook((props) => defaultUseConvert(props), {
    initialProps,
  });

  const initialValue = result.current.value;
  const initialError = result.current.error;
  const initialTouched = result.current.touched;

  const initialOnBlur = result.current.onBlur;
  const initialOnChange = result.current.onChange;

  const updatedProps: {
    formControl: FormControl<{ prop1: string; prop2: number }>;
    rffName: string;
  } = {
    rffName: initialProps.rffName,
    formControl: {
      ...formControl,
      values: {
        ...formControl.values,
        prop2: formControl.values.prop2 + 10,
      },
      errors: {
        ...formControl.errors,
        prop2: { message: "another error", type: "required" },
      },
      touched: {
        ...formControl.touched,
        prop2: !formControl.touched.prop2,
      },
    },
  };

  rerender(updatedProps);

  expect(result.current.value).toBe(initialValue);
  expect(result.current.error).toBe(initialError);
  expect(result.current.touched).toBe(initialTouched);

  expect(result.current.onBlur).toBe(initialOnBlur);
  expect(result.current.onChange).toBe(initialOnChange);
});

test("should update result when formControl is changed", () => {
  const initialProps = {
    rffName: "prop1",
    formControl,
  };

  const { result, rerender } = renderHook((props) => defaultUseConvert(props), {
    initialProps,
  });

  const initialValue = result.current.value;
  const initialError = result.current.error;
  const initialTouched = result.current.touched;

  const initialOnBlur = result.current.onBlur;
  const initialOnChange = result.current.onChange;

  rerender({
    ...initialProps,
    formControl: {
      ...initialProps.formControl,
      values: {
        ...initialProps.formControl.values,
        prop1: "another value",
      },
      errors: {
        ...initialProps.formControl.errors,
        prop1: { message: "another error", type: "required" },
      },
      touched: {
        ...initialProps.formControl.touched,
        prop1: !initialProps.formControl.touched.prop1,
      },
    },
  });

  expect(result.current.value).not.toBe(initialValue);
  expect(result.current.error).not.toBe(initialError);
  expect(result.current.touched).not.toBe(initialTouched);

  expect(result.current.onBlur).not.toBe(initialOnBlur);
  expect(result.current.onChange).not.toBe(initialOnChange);
});

test("onBlur should call setFieldTouched", () => {
  const initialProps = {
    rffName: "prop1",
    formControl,
  };

  const { result } = renderHook((props) => defaultUseConvert(props), {
    initialProps,
  });

  result.current.onBlur && result.current.onBlur();

  expect((formControl.setFieldTouched as any).mock.calls).toHaveLength(1);
  expect((formControl.setFieldTouched as any).mock.calls[0][0]).toEqual(
    initialProps.rffName,
  );
  expect((formControl.setFieldTouched as any).mock.calls[0][1]).toEqual(true);
});

test("onChange should call setFieldValue", () => {
  const initialProps = {
    rffName: "prop1",
    formControl,
  };

  const { result } = renderHook((props) => defaultUseConvert(props), {
    initialProps,
  });

  result.current.onChange &&
    result.current.onChange({ target: { value: "some value" } });

  expect((formControl.setFieldValue as any).mock.calls).toHaveLength(1);
  expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(
    initialProps.rffName,
  );
  expect((formControl.setFieldValue as any).mock.calls[0][1]).toEqual(
    "some value",
  );
});

test("should return undefined if error is not a string", () => {
  const initialProps = {
    rffName: "prop1",
    formControl: {
      ...formControl,
      errors: {
        prop1: { p: "other" },
      },
    },
  };

  const { result } = renderHook((props) => defaultUseConvert(props), {
    initialProps,
  });

  expect(result.current.error).toBe(undefined);
});
