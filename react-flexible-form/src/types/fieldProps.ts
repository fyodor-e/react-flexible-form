/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from "react";
import { DeepPick } from "./deepPick";
import { KeyPaths } from "./keyPaths";
import { FormControl } from "./formControl";
import { ConvertHook } from ".";

export type DefaultBaseProps = {
  onBlur?: () => void;
  onChange?: (arg: { target: { value: string | number } }) => void;
  error?: string;
  touched?: boolean;
  value: any;
};

export type FieldProps<
  Values extends object,
  ComponentProps extends { value?: any },
  BaseProps extends { value?: any } = DefaultBaseProps,
  LoadingComponentProps extends object = Record<string, never>,
  Name extends KeyPaths<Values> = KeyPaths<Values>,
  Value = DeepPick<Values, Name>,
> = {
  rffFormControl: Omit<FormControl<Values>, "handleSubmit">;

  rffName: Name;
  rffComponent: ElementType<ComponentProps>;

  rffLoadingComponent?: ElementType<LoadingComponentProps>;
  rffUseConvert?: ConvertHook<Values, BaseProps>;
} & Omit<ComponentProps, keyof BaseProps> &
  Partial<Omit<BaseProps, "value">> &
  (Value extends ComponentProps["value"]
    ? { value?: Value }
    : { value: ComponentProps["value"] });
