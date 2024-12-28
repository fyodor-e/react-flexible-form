/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "../../types";
import { beforeEach, expect, jest, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { defaultUseDirty } from "../defaultUseDirty";

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
  setIsSubmitting: jest.fn() as any,
  isLoading: false,
  setIsLoading: jest.fn(),

  isValid: true,
};

beforeEach(() => {
  (formControl.setFieldDirty as any).mockReset();
});

test("Should setFieldDirty on each value change", async () => {
  renderHook(defaultUseDirty, {
    initialProps: { formControl, initialValues: undefined },
  });

  expect(formControl.setFieldDirty).toBeCalledTimes(1);
  expect((formControl.setFieldDirty as any).mock.calls[0][0]).toEqual("");
  expect((formControl.setFieldDirty as any).mock.calls[0][1]).toEqual({
    prop1: true,
    prop2: true,
  });
});

// This test should be in formControl
// test("Should not call setFieldDirty if durty value was not changed", async () => {
//   renderHook(defaultUseDirty, {
//     initialProps: {
//       formControl: { ...formControl, dirty: { prop1: false, prop2: false } },
//       initialValues: formControl.values,
//     },
//   });

//   expect(formControl.setFieldDirty).toBeCalledTimes(0);
// });
