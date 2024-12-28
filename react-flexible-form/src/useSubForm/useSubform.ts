/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeepPick,
  FormControl,
  FormErrors,
  FormTouched,
  KeyPaths,
  SetField,
} from "../types";
import { useCallback } from "react";
import { getIn } from "../utils";

export const useSubform = <
  Values extends object,
  Name extends KeyPaths<Values> = KeyPaths<Values>,
  Value = DeepPick<Values, Name>,
>({
  formControl: {
    values,
    errors,
    touched,
    dirty,

    setFieldValue,
    setFieldError,
    setFieldTouched,
    setFieldDirty,

    ...rest
  },
  name,
}: {
  name: Name;
  formControl: Omit<FormControl<Values>, "handleSubmit">;
}): Value extends object ? Omit<FormControl<Value>, "handleSubmit"> : never =>
  ({
    // No need to wrap in useMemo, as getIn always return same object if it was not changed
    values: getIn<any, any>({ name, values }),
    errors: getIn<any, any>({ name, values: errors }) ?? {},
    dirty: getIn<any, any>({ name, values: dirty }) ?? {},
    touched: getIn<any, any>({ name, values: touched }) ?? {},

    setFieldValue: useCallback<SetField<Value>>(
      (subName: any, value: any) => {
        setFieldValue<any>(name + (subName ? `.${subName}` : ""), value);
      },
      [setFieldValue, name],
    ),
    setFieldError: useCallback<SetField<FormErrors<Value>>>(
      (subName: any, error: any) => {
        setFieldError<any>(name + (subName ? `.${subName}` : ""), error);
      },
      [setFieldError, name],
    ),
    setFieldTouched: useCallback<SetField<FormTouched<Value>>>(
      (subName: any, touched: any) => {
        setFieldTouched<any>(name + (subName ? `.${subName}` : ""), touched);
      },
      [setFieldTouched, name],
    ),
    setFieldDirty: useCallback<SetField<FormTouched<Value>>>(
      (subName: any, dirty: any) => {
        setFieldDirty<any>(name + (subName ? `.${subName}` : ""), dirty);
      },
      [setFieldDirty, name],
    ),
    // submitCount, isSubmitting and isValid are primitive types
    // so no need to wrap them in useMemo
    ...rest,
  }) as any;
