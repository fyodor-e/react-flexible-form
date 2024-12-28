/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "../../types";
import { beforeEach, expect, test, jest } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useSubform } from "../useSubform";

type Values = {
  nestedObj: {
    prop1: string;
    prop2: number;
  };
};

const formControl: FormControl<Values> = {
  values: {
    nestedObj: {
      prop1: "123",
      prop2: 456,
    },
  },
  touched: {
    nestedObj: {
      prop1: true,
      prop2: false,
    },
  },
  errors: {
    nestedObj: {
      prop1: {
        type: "required",
        message: "Required",
      },
      prop2: {
        type: "required2",
        message: "Required2",
      },
    },
  },
  dirty: {
    nestedObj: {
      prop1: false,
      prop2: false,
    },
  },

  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  setFieldError: jest.fn(),
  setFieldDirty: jest.fn(),
  submitCount: 0,
  isSubmitting: false,
  setIsSubmitting: jest.fn(),
  isLoading: false,
  setIsLoading: jest.fn(),
  handleSubmit: () => Promise.resolve(),

  isValid: true,
};

const name = "nestedObj";

beforeEach(() => {
  (formControl.setFieldValue as any).mockReset();
  (formControl.setFieldTouched as any).mockReset();
  (formControl.setFieldError as any).mockReset();
  (formControl.setFieldDirty as any).mockReset();
});

test("values test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  expect(result.current.values).toBe(formControl.values.nestedObj);
});

test("errors test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  expect(result.current.errors).toBe(formControl.errors.nestedObj);
});

test("touched test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  expect(result.current.touched).toBe(formControl.touched.nestedObj);
});

test("dirty test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  expect(result.current.dirty).toBe(formControl.dirty.nestedObj);
});

test("isSubmitting/submitCount should be returned as passed", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  expect(result.current.isSubmitting).toBe(formControl.isSubmitting);
  expect(result.current.submitCount).toBe(formControl.submitCount);
});

test("setFieldValue test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  result.current.setFieldValue("prop1", "345");
  expect(formControl.setFieldValue).toBeCalledTimes(1);
  expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(
    `${name}.prop1`,
  );
  expect((formControl.setFieldValue as any).mock.calls[0][1]).toEqual("345");
});

test("setFieldError test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  result.current.setFieldError("prop1", {
    type: "required",
    message: "message1",
  });
  expect(formControl.setFieldError).toBeCalledTimes(1);
  expect((formControl.setFieldError as any).mock.calls[0][0]).toEqual(
    `${name}.prop1`,
  );
  expect((formControl.setFieldError as any).mock.calls[0][1]).toEqual({
    type: "required",
    message: "message1",
  });
});

test("setFieldTouched test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  result.current.setFieldTouched("prop1", true);

  expect(formControl.setFieldTouched).toBeCalledTimes(1);
  expect((formControl.setFieldTouched as any).mock.calls[0][0]).toEqual(
    `${name}.prop1`,
  );
  expect((formControl.setFieldTouched as any).mock.calls[0][1]).toEqual(true);
});

test("setFieldDirty test", () => {
  const { result } = renderHook<any, any>(useSubform, {
    initialProps: { formControl, name },
  });

  result.current.setFieldDirty("prop1", true);
  expect(formControl.setFieldDirty).toBeCalledTimes(1);
  expect((formControl.setFieldDirty as any).mock.calls[0][0]).toEqual(
    `${name}.prop1`,
  );
  expect((formControl.setFieldDirty as any).mock.calls[0][1]).toEqual(true);
});
