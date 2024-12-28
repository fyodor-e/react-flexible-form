/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "../../types";
import { beforeEach, expect, jest, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { defaultUseFormSubmitCreator } from "../defaultUseFormSubmitCreator";
import { deepSetTouched } from "../../utils";

type Values = {
  prop1: string;
  prop2: number;
};

jest.mock("../../utils", () => ({
  deepSetTouched: jest.fn(),
}));

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

const validator: any = jest.fn();
const onSubmit: any = jest.fn();
const setSubmitCount = jest.fn();
const setIsSubmitting = jest.fn();

beforeEach(() => {
  validator.mockReset();
  onSubmit.mockReset();
  setSubmitCount.mockReset();
  setIsSubmitting.mockReset();

  (formControl.setFieldError as any).mockReset();
  (formControl.setFieldTouched as any).mockReset();

  (deepSetTouched as any).mockReset();
});

test("Should return memoized handleSubmit function", async () => {
  const { result, rerender } = renderHook(defaultUseFormSubmitCreator, {
    initialProps: {
      formControl,
      validator,
      onSubmit,
      setSubmitCount,
      setIsSubmitting,
    },
  });

  const handleSubmit = result.current;

  expect(result.current).toEqual(expect.any(Function));

  // rerender with the same props
  rerender({
    formControl,
    validator,
    onSubmit,
    setSubmitCount,
    setIsSubmitting,
  });

  expect(result.current).toBe(handleSubmit);

  // rerender changing one prop
  rerender({
    formControl,
    validator: jest.fn() as any,
    onSubmit,
    setSubmitCount,
    setIsSubmitting,
  });

  expect(result.current).not.toBe(handleSubmit);
});

test("Should execute submission sequence", async () => {
  const { result } = renderHook(defaultUseFormSubmitCreator, {
    initialProps: {
      formControl,
      validator,
      onSubmit,
      setSubmitCount,
      setIsSubmitting,
    },
  });

  const submitProps = { s: "123" };
  const touched: any = { prop1: true, prop2: true };
  (deepSetTouched as any).mockReturnValueOnce(touched);

  const error = {};
  validator.mockReturnValueOnce(error);

  await (result.current as any)(submitProps);

  expect(setSubmitCount.mock.calls[0][0]).toBe(formControl.submitCount + 1);
  expect(setIsSubmitting.mock.calls[0][0]).toBe(true);
  expect((deepSetTouched as any).mock.calls[0][0]).toEqual(formControl.values);
  expect((formControl.setFieldTouched as any).mock.calls[0][0]).toEqual("");
  expect((formControl.setFieldTouched as any).mock.calls[0][1]).toEqual(
    touched,
  );
  expect((formControl.setFieldError as any).mock.calls[0][0]).toEqual("");
  expect((formControl.setFieldError as any).mock.calls[0][1]).toEqual(error);
  expect(onSubmit.mock.calls[0][0]).toEqual({ formControl, submitProps });
});

test("Should NOT submit form if any error is found by validator", async () => {
  const { result } = renderHook(defaultUseFormSubmitCreator, {
    initialProps: {
      formControl,
      validator,
      onSubmit,
      setSubmitCount,
      setIsSubmitting,
    },
  });

  const error = { prop1: { message: "error" } };
  validator.mockReturnValueOnce(error);

  await result.current();

  expect((formControl.setFieldError as any).mock.calls[0][0]).toEqual("");
  expect((formControl.setFieldError as any).mock.calls[0][1]).toEqual(error);
  expect(onSubmit).toBeCalledTimes(0);
});

test("Should submit form if no error is present in formControl and no validator is passed", async () => {
  const { result } = renderHook(defaultUseFormSubmitCreator, {
    initialProps: {
      formControl,
      validator: undefined,
      onSubmit,
      setSubmitCount,
      setIsSubmitting,
    },
  });

  const submitProps = { s: "123" };
  await (result.current as any)(submitProps);

  expect(formControl.setFieldError).toBeCalledTimes(0);
  expect(onSubmit.mock.calls[0][0]).toEqual({ formControl, submitProps });
});

test("Should NOT submit form if any error is present in formControl and no validator is passed", async () => {
  const { result } = renderHook(defaultUseFormSubmitCreator, {
    initialProps: {
      formControl: {
        ...formControl,
        errors: { prop1: { message: "error" } },
      },
      validator: undefined,
      onSubmit,
      setSubmitCount,
      setIsSubmitting,
    },
  });

  await result.current();

  expect(onSubmit).toBeCalledTimes(0);
});

test("handleSubmit should return what onSubmit returned", async () => {
  const onSubmitRes = { ret: "ret1" };
  const { result } = renderHook(defaultUseFormSubmitCreator, {
    initialProps: {
      formControl,
      validator: undefined,
      onSubmit: () => onSubmitRes,
      setSubmitCount,
      setIsSubmitting,
    },
  });

  const res = await result.current();

  expect(res).toEqual(onSubmitRes);
});

test("handleSubmit should throw if onSubmit throw", async () => {
  const { result } = renderHook(defaultUseFormSubmitCreator, {
    initialProps: {
      formControl,
      validator: undefined,
      onSubmit: () => {
        throw new Error("err1");
      },
      setSubmitCount,
      setIsSubmitting,
    },
  });

  await expect(() => result.current()).rejects.toThrow("err1");
});
