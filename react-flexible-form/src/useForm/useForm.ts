/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormErrors, FormTouched, SetterOrValue } from "../types";
import { FormProps } from "../types/formProps";
import { getIn, isChanged, setIn } from "../utils";
import { useCallback, useMemo, useState } from "react";
import { defaultUseFormSubmitCreator } from "./defaultUseFormSubmitCreator";
import { defaultUseValidate } from "./defaultUseValidate";
import { defaultUseDirty } from "./defaultUseDirty";
import { defaultUseInitialValues } from "./defaultUseInitialValues";

export const useForm = <
  Values extends object,
  SubmitProps = undefined,
  SubmitReturn = void,
>({
  onSubmit,

  initialValues: initialValuesFromProps,
  values: valuesFromProps,
  setFieldValue: setFieldValueFromProps,
  errors: errorsFromProps,
  setFieldError: setFieldErrorFromProps,
  touched: touchedFromProps,
  setFieldTouched: setFieldTouchedFromProps,
  dirty: dirtyFromProps,
  setFieldDirty: setFieldDirtyFromProps,

  useFormSubmitCreator = defaultUseFormSubmitCreator,

  useValidate = defaultUseValidate,
  context,
  criteriaMode,
  resolver,

  useDirty = defaultUseDirty,
  useInitialValues = defaultUseInitialValues,

  submitCount: submitCountFromProps,
  setSubmitCount: setSubmitCountFromProps,

  isSubmitting: isSubmittingFromProps,
  setIsSubmitting: setIsSubmittingFromProps,

  isLoading: isLoadingFromProps,
  setIsLoading: setIsLoadingFromProps,
}: FormProps<Values, SubmitProps, SubmitReturn>): FormControl<
  Values,
  SubmitProps,
  SubmitReturn
> => {
  // 1. Types are replaced with any for compilation performance
  // 2. setField...Local variants may be used only if
  //    set... functions accept function as argument.
  //    Otherwise setField... functions should be provided as arguments
  //    and setField...Local variants will never be called.
  const [internalValues, setValuesInternal] = useState<Values>(
    // Either initialValues or values are always provided
    initialValuesFromProps ?? (valuesFromProps as any),
  );

  const [internalErrors, setErrorsInternal] = useState<FormErrors<Values>>(
    errorsFromProps ?? ({} as any),
  );
  const [internalTouched, setTouchedInternal] = useState<FormTouched<Values>>(
    touchedFromProps ?? ({} as any),
  );
  const [internalDirty, setDirtyInternal] = useState<FormTouched<Values>>(
    dirtyFromProps ?? ({} as any),
  );
  const [internalSubmitCount, setInternalSubmitCount] = useState<number>(
    submitCountFromProps ?? 0,
  );
  const [internalIsSubmitting, setInternalIsSubmitting] = useState<boolean>(
    isSubmittingFromProps ?? false,
  );

  const [internalIsLoading, setInternalIsLoading] = useState<boolean>(
    isLoadingFromProps ?? false,
  );

  const setFieldValueInternal = useCallback(
    (name: any, value: SetterOrValue<any>) => {
      setValuesInternal((prev) => {
        const prevValue = getIn({ values: prev, name });
        const newValue = typeof value === "function" ? value(prevValue) : value;
        if (isChanged(prevValue, newValue))
          return setIn({ values: prev, name, value: newValue });
        else return prev;
      });
    },
    [],
  );

  const setFieldErrorInternal = useCallback(
    (name: any, error: SetterOrValue<any>) => {
      setErrorsInternal((prev) => {
        const prevError = getIn({ values: prev, name });
        const newError = typeof error === "function" ? error(prevError) : error;
        if (isChanged(newError, prevError))
          return setIn({ values: prev, name, value: newError });
        else return prev;
      });
    },
    [],
  );

  const setFieldTouchedInternal = useCallback(
    (name: any, touched: SetterOrValue<any>) => {
      setTouchedInternal((prev) => {
        const prevTouched = getIn({ values: prev, name });
        const newTouched =
          typeof touched === "function" ? touched(prevTouched) : touched;
        if (isChanged(newTouched, prevTouched))
          return setIn({ values: prev, name, value: newTouched });
        else return prev;
      });
    },
    [],
  );

  const setFieldDirtyInternal = useCallback(
    (name: any, dirty: SetterOrValue<any>) => {
      setDirtyInternal((prev) => {
        const prevDirty = getIn({ values: prev, name });
        const newDirty = typeof dirty === "function" ? dirty(prevDirty) : dirty;
        if (isChanged(newDirty, prevDirty))
          return setIn({ values: prev, name, value: newDirty });
        else return prev;
      });
    },
    [],
  );

  const values = (setFieldValueFromProps && valuesFromProps) || internalValues;
  // If setErrors is provided errors will not be undefined
  const errors = (setFieldErrorFromProps && errorsFromProps) || internalErrors;
  // If setTouched is provided touched will not be undefined
  const touched =
    (setFieldTouchedFromProps && touchedFromProps) || internalTouched;
  // If setDirty is provided dirty will not be undefined
  const dirty = (setFieldDirtyFromProps && dirtyFromProps) || internalDirty;

  const setFieldValue = setFieldValueFromProps ?? setFieldValueInternal;
  const setFieldError = setFieldErrorFromProps ?? setFieldErrorInternal;
  const setFieldTouched = setFieldTouchedFromProps ?? setFieldTouchedInternal;
  const setFieldDirty = setFieldDirtyFromProps ?? setFieldDirtyInternal;

  const submitCount =
    (setSubmitCountFromProps && submitCountFromProps) ?? internalSubmitCount;
  const setSubmitCount = setSubmitCountFromProps ?? setInternalSubmitCount;

  const isSubmitting =
    (setIsSubmittingFromProps && isSubmittingFromProps) ?? internalIsSubmitting;
  const setIsSubmitting = setIsSubmittingFromProps ?? setInternalIsSubmitting;

  const isLoading =
    (setIsLoadingFromProps && isLoadingFromProps) ?? internalIsLoading;
  const setIsLoading = setIsLoadingFromProps ?? setInternalIsLoading;

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const formControlWoSubmit = useMemo<
    Omit<FormControl<Values>, "handleSubmit">
  >(
    () => ({
      values,
      errors,
      touched,
      dirty,

      setFieldValue,
      setFieldError,
      setFieldTouched,
      setFieldDirty,

      submitCount,
      isSubmitting,
      setIsSubmitting,

      isLoading,
      setIsLoading,

      isValid,
    }),
    [
      values,
      errors,
      touched,
      dirty,

      setFieldValue,
      setFieldError,
      setFieldTouched,
      setFieldDirty,

      submitCount,
      isSubmitting,
      setIsSubmitting,
      isLoading,
      setIsLoading,
      isValid,
    ],
  );

  const validator = useValidate({
    formControl: formControlWoSubmit,
    criteriaMode: criteriaMode,
    context,
    resolver,
  });

  const initialValues = useInitialValues({
    formControl: formControlWoSubmit,
    initialValues: initialValuesFromProps,
  });

  useDirty({
    formControl: formControlWoSubmit,
    initialValues,
  });

  const handleSubmit = useFormSubmitCreator({
    formControl: formControlWoSubmit,
    validator,
    onSubmit,
    setSubmitCount,
    setIsSubmitting,
  });

  const formControl = useMemo<FormControl<Values, SubmitProps, SubmitReturn>>(
    () => ({
      ...formControlWoSubmit,
      handleSubmit,
    }),
    [formControlWoSubmit, handleSubmit],
  );

  return formControl;
};
