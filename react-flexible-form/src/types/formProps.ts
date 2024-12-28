/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormErrors,
  FormControl,
  FormTouched,
  DeepPick,
  KeyPaths,
  SetterOrValue,
} from ".";
import { SetStateAction } from "react";
import { Resolver } from ".";

export type ValueFunction<V> = (v: V) => void;
export type FunctionValueFunction<V> = (v: SetStateAction<V>) => void;

export type OnSubmit<
  Values extends object,
  SubmitProps = undefined,
  SubmitReturn = void,
> = (arg: {
  formControl: Omit<FormControl<Values>, "handleSubmit">;
  submitProps: SubmitProps;
}) => Promise<SubmitReturn> | SubmitReturn;

export type UseFormSubmitCreatorArg<
  Values extends object,
  SubmitProps = undefined,
  SubmitReturn = void,
> = {
  formControl: Omit<FormControl<Values>, "handleSubmit">;
  validator?: (
    formControl: Omit<FormControl<Values>, "handleSubmit">,
  ) => Promise<FormErrors<Values>>;
  onSubmit?: OnSubmit<Values, SubmitProps, SubmitReturn>;
  setSubmitCount: (submitCount: number) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
};

export type UseFormSubmitCreator<
  Values extends object,
  SubmitProps,
  SubmitReturn,
> = (
  arg: UseFormSubmitCreatorArg<Values, SubmitProps, SubmitReturn>,
) => undefined extends SubmitProps & undefined
  ? () => Promise<SubmitReturn>
  : (submitProps: SubmitProps) => Promise<SubmitReturn>;

export type UseValidate<Values extends object> = (arg: {
  formControl: Omit<FormControl<Values>, "handleSubmit">;
  resolver?: Resolver<Values>;
  context?: any;
  criteriaMode?: "all" | "firstError";
}) => () => Promise<FormErrors<Values>>;

export type UseDirty<Values extends object> = (arg: {
  formControl: Omit<FormControl<Values>, "handleSubmit">;
  initialValues: Values | undefined;
}) => void;

export type UseInitialValues<Values extends object> = (arg: {
  formControl: Omit<FormControl<Values>, "handleSubmit">;
  initialValues: Values | undefined;
}) => Values | undefined;

export type SetField<Values> = <
  Name extends KeyPaths<Values> = KeyPaths<Values>,
>(
  name: Name,
  value: SetterOrValue<DeepPick<Values, Name>>,
) => void;

export type FormProps<
  Values extends object,
  SubmitProps = undefined,
  SubmitReturn = void,
> = {
  onSubmit?: OnSubmit<Values, SubmitProps, SubmitReturn>;

  useFormSubmitCreator?: UseFormSubmitCreator<
    Values,
    SubmitProps,
    SubmitReturn
  >;

  useValidate?: UseValidate<Values>;
  context?: any;
  criteriaMode?: "all" | "firstError";
  resolver?: Resolver<Values>;

  useDirty?: UseDirty<Values>;

  useInitialValues?: UseInitialValues<Values>;
} & (
  | {
      initialValues: Values;
      values?: undefined;
      setFieldValue?: undefined;
    }
  | {
      initialValues?: Values | undefined;
      values: Values;
      setFieldValue: SetField<Values>;
    }
) &
  (
    | {
        errors?: FormErrors<Values>;
        setFieldError?: undefined;
      }
    | {
        errors: FormErrors<Values>;
        setFieldError: SetField<FormErrors<Values>>;
      }
  ) &
  (
    | {
        touched?: FormTouched<Values>;
        setFieldTouched?: undefined;
      }
    | {
        touched: FormTouched<Values>;
        setFieldTouched: SetField<FormTouched<Values>>;
      }
  ) &
  (
    | {
        dirty?: FormTouched<Values>;
        setFieldDirty?: undefined;
      }
    | {
        dirty: FormTouched<Values>;
        setFieldDirty: SetField<FormTouched<Values>>;
      }
  ) &
  (
    | {
        submitCount?: number;
        setSubmitCount?: undefined;
      }
    | {
        submitCount: number;
        setSubmitCount: (submitCount: SetterOrValue<number>) => void;
      }
  ) &
  (
    | {
        isSubmitting?: boolean;
        setIsSubmitting?: undefined;
      }
    | {
        isSubmitting: boolean;
        setIsSubmitting: (isSubmitting: SetterOrValue<boolean>) => void;
      }
  ) &
  (
    | {
        isLoading?: boolean;
        setIsLoading?: undefined;
      }
    | {
        isLoading: boolean;
        setIsLoading: (isLoading: SetterOrValue<boolean>) => void;
      }
  );
