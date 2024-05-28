import { FormContext } from "@react-stateless-form/types";
import { expect, jest, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDefaultConvertFunction } from "../src/useDefaultConvertFunction";

jest.mock("@react-stateless-form/utils", () => ({
  // Simplified implementation of getIn for testing
  getIn: ({ values, name }: { values: any; name: string }) => values[name],
}));

const context: FormContext<{ prop1: string; prop2: number }> = {
  values: { prop1: "prop1", prop2: 1 },
  errors: { prop1: "prop1Error" },
  touched: { prop1: true },

  setErrors: jest.fn() as any,
  setFieldError: jest.fn() as any,
  setTouched: jest.fn() as any,
  setFieldTouched: jest.fn() as any,
  setValues: jest.fn() as any,
  setFieldValue: jest.fn() as any,
};

test("should return value, error and touched using passed rsfName", () => {
  const initialProps = {
    rsfName: "prop1",
    ...context,
  };

  const { result } = renderHook((props) => useDefaultConvertFunction(props), {
    initialProps,
  });

  expect(result.current.value).toBe(context.values.prop1);
  expect(result.current.error).toBe(context.errors.prop1);
  expect(result.current.touched).toBe(context.touched.prop1);

  expect(result.current.onBlur).toEqual(expect.any(Function));
  expect(result.current.onChange).toEqual(expect.any(Function));
});

test("should memoize values event if other props of the context has been changed", () => {
  const initialProps = {
    rsfName: "prop1",
    ...context,
  };

  const { result, rerender } = renderHook(
    (props) => useDefaultConvertFunction(props),
    {
      initialProps,
    },
  );

  const initialValue = result.current.value;
  const initialError = result.current.error;
  const initialTouched = result.current.touched;

  const initialOnBlur = result.current.onBlur;
  const initialOnChange = result.current.onChange;

  const updatedProps: FormContext<{ prop1: string; prop2: number }> & {
    rsfName: string;
  } = {
    rsfName: initialProps.rsfName,
    ...context,
    values: {
      ...context.values,
      prop2: context.values.prop2 + 10,
    },
    errors: {
      ...context.errors,
      prop2: "another error",
    },
    touched: {
      ...context.touched,
      prop2: !context.touched.prop2,
    },
  };

  rerender(updatedProps);

  expect(result.current.value).toBe(initialValue);
  expect(result.current.error).toBe(initialError);
  expect(result.current.touched).toBe(initialTouched);

  expect(result.current.onBlur).toBe(initialOnBlur);
  expect(result.current.onChange).toBe(initialOnChange);
});

test("should update result when context is changed", () => {
  const initialProps = {
    rsfName: "prop1",
    ...context,
  };

  const { result, rerender } = renderHook(
    (props) => useDefaultConvertFunction(props),
    {
      initialProps,
    },
  );

  const initialValue = result.current.value;
  const initialError = result.current.error;
  const initialTouched = result.current.touched;

  const initialOnBlur = result.current.onBlur;
  const initialOnChange = result.current.onChange;

  rerender({
    ...initialProps,
    values: {
      ...initialProps.values,
      prop1: "another value",
    },
    errors: {
      ...initialProps.errors,
      prop1: "another error",
    },
    touched: {
      ...initialProps.touched,
      prop1: !initialProps.touched.prop1,
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
    rsfName: "prop1",
    ...context,
  };

  const { result } = renderHook((props) => useDefaultConvertFunction(props), {
    initialProps,
  });

  result.current.onBlur && result.current.onBlur();

  expect((context.setFieldTouched as any).mock.calls).toHaveLength(1);
  expect((context.setFieldTouched as any).mock.calls[0][0]).toEqual({
    name: initialProps.rsfName,
  });
});

test("onChange should call setFieldValue", () => {
  const initialProps = {
    rsfName: "prop1",
    ...context,
  };

  const { result } = renderHook((props) => useDefaultConvertFunction(props), {
    initialProps,
  });

  result.current.onChange &&
    result.current.onChange({ target: { value: "some value" } });

  expect((context.setFieldValue as any).mock.calls).toHaveLength(1);
  expect((context.setFieldValue as any).mock.calls[0][0]).toEqual({
    name: initialProps.rsfName,
    value: "some value",
  });
});

test("should return undefined if error is not a string", () => {
  const initialProps = {
    rsfName: "prop1",
    ...context,
    errors: {
      prop1: { p: "other" },
    },
  };

  const { result } = renderHook((props) => useDefaultConvertFunction(props), {
    initialProps,
  });

  expect(result.current.error).toBe(undefined);
});