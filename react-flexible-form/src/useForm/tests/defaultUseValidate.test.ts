/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "../../types";
import { beforeEach, expect, jest, test } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { defaultUseValidate } from "../defaultUseValidate";

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
  (formControl.setFieldError as any).mockReset();
  (formControl.setFieldTouched as any).mockReset();
});

test("No validate is provided - should set errors to empty object", async () => {
  renderHook(defaultUseValidate, {
    initialProps: { formControl, criteriaMode: "all" },
  });

  waitFor(() => {
    expect((formControl.setFieldError as any).mock.calls[0][0]).toEqual("");
    expect((formControl.setFieldError as any).mock.calls[0][1]).toEqual({});
  });
});

test("When validate is provided it should be called on every values change", async () => {
  const resolver: any = jest.fn();
  const error = { prop1: { message: "error" } };
  const criteriaMode = "all";
  resolver.mockReturnValueOnce(error);
  const context = { prop: "context" };

  const { rerender } = renderHook(defaultUseValidate, {
    initialProps: { formControl, resolver, context, criteriaMode },
  });

  waitFor(() => {
    expect(resolver.mock.calls[0][0]).toEqual(formControl.values);
    expect(resolver.mock.calls[0][1]).toEqual(context);
    expect(resolver.mock.calls[0][2]).toEqual({
      criteriaMode,
      shouldUseNativeValidation: false,
      fields: {},
    });

    expect((formControl.setFieldError as any).mock.calls[0][0]).toEqual("");
    expect((formControl.setFieldError as any).mock.calls[0][1]).toEqual(error);
  });

  const anotherError = { prop2: { message: "error prop2" } };
  resolver.mockReturnValueOnce(error);

  rerender({
    formControl: {
      ...formControl,
      values: { prop1: "prop1", prop2: 22 },
    },
    resolver,
    context,
    criteriaMode,
  });

  waitFor(() => {
    expect((formControl.setFieldError as any).mock.calls[0][0]).toEqual("");
    expect((formControl.setFieldError as any).mock.calls[0][1]).toEqual(
      anotherError,
    );
  });
});
