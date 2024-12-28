/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormErrors, FormTouched, FormProps } from "../../types";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import { useForm } from "../useForm";

import { defaultUseFormSubmitCreator } from "../defaultUseFormSubmitCreator";
import { defaultUseValidate } from "../defaultUseValidate";
import { defaultUseDirty } from "../defaultUseDirty";
import { defaultUseInitialValues } from "../defaultUseInitialValues";

jest.mock("../defaultUseFormSubmitCreator", () => ({
  defaultUseFormSubmitCreator: jest.fn(),
}));
jest.mock("../defaultUseValidate", () => ({
  defaultUseValidate: jest.fn(),
}));
jest.mock("../defaultUseDirty", () => ({
  defaultUseDirty: jest.fn(),
}));
jest.mock("../defaultUseInitialValues", () => ({
  defaultUseInitialValues: jest.fn(),
}));

type Values = {
  prop1: string;
  prop2: number;
};

beforeEach(() => {
  (defaultUseFormSubmitCreator as any).mockReset();
  (defaultUseValidate as any).mockReset();
  (defaultUseDirty as any).mockReset();
  (defaultUseInitialValues as any).mockReset();
});

void describe("1. Default props", () => {
  test("Should return FormContext", async () => {
    const formProps: FormProps<Values> = {
      initialValues: { prop1: "prop1", prop2: 12 },
    };

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    expect(result.current.values).toEqual(formProps.initialValues);
    expect(result.current.setFieldValue).toEqual(expect.any(Function));

    expect(result.current.errors).toEqual({});
    expect(result.current.setFieldError).toEqual(expect.any(Function));

    expect(result.current.touched).toEqual({});
    expect(result.current.setFieldTouched).toEqual(expect.any(Function));

    expect(result.current.dirty).toEqual({});
    expect(result.current.setFieldDirty).toEqual(expect.any(Function));

    expect(result.current.submitCount).toBe(0);
    expect(result.current.isSubmitting).toBe(false);
  });

  test("Should be able to change values, errors, touched and dirty useng set... functions", async () => {
    const formProps: FormProps<Values> = {
      initialValues: { prop1: "prop1", prop2: 12 },
    };

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    const newValues: Values = { prop1: "another prop", prop2: 23 };
    const newErrors: FormErrors<Values> = {
      prop1: { message: "prop1 error", type: "required" },
      prop2: { message: "prop2 error", type: "required" },
    };
    const newTouched: FormTouched<Values> = { prop1: true, prop2: false };
    const newDirty: FormTouched<Values> = { prop1: false, prop2: true };

    act(() => {
      result.current.setFieldValue("", newValues);
      result.current.setFieldError("", newErrors);
      result.current.setFieldTouched("", newTouched);
      result.current.setFieldDirty("", newDirty);
    });

    expect(result.current.values).toEqual(newValues);
    expect(result.current.errors).toEqual(newErrors);
    expect(result.current.touched).toEqual(newTouched);
    expect(result.current.dirty).toEqual(newDirty);
  });

  test("Should be able to change isSubmitting, isLoading useng set... functions", async () => {
    const formProps: FormProps<Values> = {
      initialValues: { prop1: "prop1", prop2: 12 },
    };

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    act(() => {
      result.current.setIsLoading(true);
      result.current.setIsSubmitting(true);
    });

    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isSubmitting).toEqual(true);
  });

  test("Should be able to change values, errors, touched and dirty useng setField... functions", async () => {
    const formProps: FormProps<Values> = {
      initialValues: { prop1: "prop1", prop2: 12 },
    };

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    const newValue = "another prop";
    const newError = { message: "prop1 error", type: "required" };
    const newDirty = false;

    act(() => {
      result.current.setFieldValue("prop1", newValue);
      result.current.setFieldError("prop1", newError);
      result.current.setFieldTouched("prop1", true);
      result.current.setFieldDirty("prop1", newDirty);
    });

    expect(result.current.values).toEqual({
      ...formProps.initialValues,
      prop1: newValue,
    });
    expect(result.current.errors).toEqual({ prop1: newError });
    expect(result.current.touched).toEqual({ prop1: true });
    expect(result.current.dirty).toEqual({ prop1: newDirty });
  });

  test("Should call use... hooks on each render", async () => {
    const criteriaMode = "all";
    const context = { prop1: "context" };
    const resolver: any = jest.fn();
    const initialValues = { prop1: "initial prop1", prop2: 1 };
    const validator: any = jest.fn();
    const onSubmit: any = jest.fn();
    const setSubmitCount: any = jest.fn();
    const setIsSubmitting: any = jest.fn();

    const formProps: FormProps<Values> = {
      criteriaMode,
      context,
      resolver,
      initialValues,
      setSubmitCount,
      setIsSubmitting,
      onSubmit,
    };

    (defaultUseValidate as any).mockReturnValueOnce(validator);
    (defaultUseInitialValues as any).mockReturnValueOnce(initialValues);

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { handleSubmit, ...formControlWoSubmit } = result.current;

    expect((defaultUseValidate as any).mock.calls[0][0]).toEqual({
      formControl: formControlWoSubmit,
      criteriaMode,
      context,
      resolver,
    });

    expect((defaultUseInitialValues as any).mock.calls[0][0]).toEqual({
      formControl: formControlWoSubmit,
      initialValues,
    });

    expect((defaultUseDirty as any).mock.calls[0][0]).toEqual({
      formControl: formControlWoSubmit,
      initialValues,
    });

    expect((defaultUseFormSubmitCreator as any).mock.calls[0][0]).toEqual({
      formControl: formControlWoSubmit,
      validator,
      onSubmit,
      setSubmitCount,
      setIsSubmitting,
    });
  });

  test("Should call setField... functions only when value, touched, error or dirty was changed", async () => {
    const formProps: FormProps<Values> = {
      initialValues: { prop1: "prop1", prop2: 12 },
      errors: { prop1: { message: "Error" } },
      touched: { prop2: true },
      dirty: { prop1: true },
    };

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    act(() => {
      result.current.setFieldValue("", { prop1: "prop1", prop2: 12 });
      result.current.setFieldError("", { prop1: { message: "Error" } });
      result.current.setFieldTouched("", { prop2: true });
      result.current.setFieldDirty("", { prop1: true });
    });

    // Values, errors, touched and dirty should not be changed
    // Use toBe as references should not be changed (should be same objects)
    // This is important for useEffect not fire
    expect(result.current.values).toBe(formProps.initialValues);
    expect(result.current.errors).toBe(formProps.errors);
    expect(result.current.touched).toBe(formProps.touched);
    expect(result.current.dirty).toBe(formProps.dirty);
  });
});

describe("2. Custom setField... functions", () => {
  test("Should be able to change values, errors, touched and dirty useng set... functions", async () => {
    const setFieldValue: any = jest.fn();
    const setFieldError: any = jest.fn();
    const setFieldTouched: any = jest.fn();
    const setFieldDirty: any = jest.fn();

    const formProps: FormProps<Values> = {
      initialValues: undefined,
      values: { prop1: "prop1", prop2: 12 },
      setFieldValue,
      errors: {},
      setFieldError,
      touched: {},
      setFieldTouched,
      dirty: {},
      setFieldDirty,
    };

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    const newValues: Values = { prop1: "another prop", prop2: 23 };
    const newErrors: FormErrors<Values> = {
      prop1: { message: "prop1 error", type: "required" },
      prop2: { message: "prop2 error", type: "required" },
    };
    const newTouched: FormTouched<Values> = { prop1: true, prop2: false };
    const newDirty: FormTouched<Values> = { prop1: false, prop2: true };

    act(() => {
      result.current.setFieldValue("", newValues);
      result.current.setFieldError("", newErrors);
      result.current.setFieldTouched("", newTouched);
      result.current.setFieldDirty("", newDirty);
    });

    expect(setFieldValue.mock.calls[0][0]).toEqual("");
    expect(setFieldValue.mock.calls[0][1]).toEqual(newValues);

    expect(setFieldError.mock.calls[0][0]).toEqual("");
    expect(setFieldError.mock.calls[0][1]).toEqual(newErrors);

    expect(setFieldTouched.mock.calls[0][0]).toEqual("");
    expect(setFieldTouched.mock.calls[0][1]).toEqual(newTouched);

    expect(setFieldDirty.mock.calls[0][0]).toEqual("");
    expect(setFieldDirty.mock.calls[0][1]).toEqual(newDirty);
  });

  test("Should be able to change isSubmitting, isLoading using set... functions", async () => {
    const setIsLoading: any = jest.fn();
    const setIsSubmitting: any = jest.fn();

    const formProps: FormProps<Values> = {
      initialValues: { prop1: "prop1", prop2: 12 },

      isLoading: false,
      setIsLoading,
      isSubmitting: false,
      setIsSubmitting,
    };

    const { result } = renderHook(useForm<Values>, {
      initialProps: formProps,
    });

    act(() => {
      result.current.setIsLoading(true);
      result.current.setIsSubmitting(true);
    });

    expect(setIsLoading.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
  });
});
