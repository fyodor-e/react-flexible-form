/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, DefaultBaseProps } from ".";

export type ConvertHook<
  Values extends object,
  BaseProps extends { value?: any } = DefaultBaseProps,
> = (props: {
  rffName: string;
  formControl: Omit<FormControl<Values>, "handleSubmit">;
}) => BaseProps;

export type DefaultConvertHook = (props: {
  rffName: string;
  formControl: Pick<
    FormControl<any>,
    "values" | "errors" | "touched" | "setFieldTouched" | "setFieldValue"
  >;
}) => DefaultBaseProps;
