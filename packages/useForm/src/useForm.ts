import {
  FormControl,
  FormErrors,
  FormTouched,
} from "@react-stateless-form/types";
import { FormProps, FunctionValueFunction, ValueFunction } from "./formProps";
import { deepEqual, setIn } from "@react-stateless-form/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultFormSubmitter } from "./defaultFormSubmitter";
import defaultUseValidate from "./defaultUseValidate";

export const useForm = <
  Values extends object,
  SetValues extends
    | ValueFunction<Values>
    | FunctionValueFunction<Values>
    | undefined = undefined,
  SetErrors extends
    | ValueFunction<FormErrors<Values>>
    | FunctionValueFunction<FormErrors<Values>>
    | undefined = undefined,
  SetTouched extends
    | ValueFunction<FormTouched<Values>>
    | FunctionValueFunction<FormTouched<Values>>
    | undefined = undefined,
  SetDirty extends
    | ValueFunction<FormTouched<Values>>
    | FunctionValueFunction<FormTouched<Values>>
    | undefined = undefined,
  SubmitProps = undefined,
>({
  onSubmit,

  initialValues: initialValuesFromProps,
  values: valuesFromProps,
  setValues: setValuesFromProps,
  errors: errorsFromProps,
  setErrors: setErrorsFromProps,
  touched: touchedFromProps,
  setTouched: setTouchedFromProps,
  dirty: dirtyFromProps,
  setDirty: setDirtyFromProps,

  setFieldValue: setFieldValueFromProps,
  setFieldError: setFieldErrorFromProps,
  setFieldTouched: setFieldTouchedFromProps,
  setFieldDirty: setFieldDirtyFromProps,

  formSubmitCreator = defaultFormSubmitter as any,

  useValidate = defaultUseValidate as any,
  context,
  criteriaMode,
  resolver,

  submitCount: submitCountFromProps,
  setSubmitCount: setSubmitCountFromProps,

  isSubmitting: isSubmittingFromProps,
  setIsSubmitting: setIsSubmittingFromProps,
}: FormProps<
  Values,
  SetValues,
  SetErrors,
  SetTouched,
  SetDirty,
  SubmitProps
>): FormControl<Values, SubmitProps> => {
  // 1. Types are replaced with any for compilation performance
  // 2. setField...Local variants may be used only if
  //    set... functions accept function as argument.
  //    Otherwise setField... functions should be provided as arguments
  //    and setField...Local variants will never be called.
  const [internalValues, setInternalValues] = useState<Values>(
    initialValuesFromProps ?? valuesFromProps,
  );
  const [internalErrors, setInternalErrors] = useState<FormErrors<Values>>(
    errorsFromProps ?? {},
  );
  const [internalTouched, setInternalTouched] = useState<FormTouched<Values>>(
    touchedFromProps ?? {},
  );
  const [internalDirty, setInternalDirty] = useState<FormTouched<Values>>(
    dirtyFromProps ?? {},
  );
  const [internalSubmitCount, setInternalSubmitCount] = useState<number>(0);
  const [internalIsSubmitting, setInternalIsSubmitting] =
    useState<boolean>(false);

  const setValues = setValuesFromProps ?? setInternalValues;
  const setErrors = setErrorsFromProps ?? setInternalErrors;
  const setTouched = setTouchedFromProps ?? setInternalTouched;
  const setDirty = setDirtyFromProps ?? setInternalDirty;

  const setFieldValueLocal: any = useCallback(
    (arg: { name: any; value: any }) => {
      (setValues as any)((prev: Values) => setIn({ values: prev, ...arg }));
    },
    [setValues],
  );
  const setFieldErrorLocal: any = useCallback(
    ({ name, error }: { name: any; error: any }) => {
      (setErrors as any)((prev: FormErrors<Values>) =>
        setIn({ values: prev, name, value: error }),
      );
    },
    [setErrors],
  );
  const setFieldTouchedLocal: any = useCallback(
    ({ name, touched }: { name: any; touched: any }) => {
      (setTouched as any)((prev: FormTouched<Values>) =>
        setIn({ values: prev as any, name, value: touched }),
      );
    },
    [setTouched],
  );

  const setFieldDirtyLocal: any = useCallback(
    ({ name, dirty }: { name: any; dirty: any }) => {
      (setDirty as any)((prev: FormTouched<Values>) =>
        setIn({ values: prev as any, name, value: dirty }),
      );
    },
    [setDirty],
  );

  const [initialValues, setInitialValues] = useState<Values | undefined>(
    undefined,
  );

  useEffect(() => {
    // initialValues are set only once using provided initialValuesFromProps
    if (initialValuesFromProps && !initialValues) {
      setInitialValues(initialValuesFromProps);
    }
  }, [initialValuesFromProps]);

  const values = (setValuesFromProps && valuesFromProps) || internalValues;
  // If setErrors is provided errors will not be undefined
  const errors = (setErrorsFromProps && errorsFromProps) || internalErrors;
  // If setTouched is provided touched will not be undefined
  const touched = (setTouchedFromProps && touchedFromProps) || internalTouched;
  // If setDirty is provided dirty will not be undefined
  const dirty = (setDirtyFromProps && dirtyFromProps) || internalDirty;

  const setFieldValue = setFieldValueFromProps ?? setFieldValueLocal;
  const setFieldError = setFieldErrorFromProps ?? setFieldErrorLocal;
  const setFieldTouched = setFieldTouchedFromProps ?? setFieldTouchedLocal;
  const setFieldDirty = setFieldDirtyFromProps ?? setFieldDirtyLocal;

  const submitCount = submitCountFromProps ?? internalSubmitCount;
  const setSubmitCount = setSubmitCountFromProps ?? setInternalSubmitCount;

  const isSubmitting = isSubmittingFromProps ?? internalIsSubmitting;
  const setIsSubmitting = setIsSubmittingFromProps ?? setInternalIsSubmitting;

  useEffect(() => {
    if (initialValues && values) {
      setDirty(deepEqual(initialValues, values));
    }
  }, [values, setDirty, initialValues]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const formControlWoSubmit = useMemo<
    Omit<FormControl<Values>, "handleSubmit">
  >(
    () => ({
      values,
      setValues,

      errors,
      setErrors,

      touched,
      setTouched,

      dirty,
      setDirty,

      setFieldValue,
      setFieldError,
      setFieldTouched,
      setFieldDirty,

      submitCount,
      isSubmitting,

      isValid,
    }),
    [
      values,
      setValues,

      errors,
      setErrors,

      touched,
      setTouched,

      dirty,
      setDirty,

      setFieldValue,
      setFieldError,
      setFieldTouched,
      setFieldDirty,

      submitCount,
      isSubmitting,
    ],
  );

  const validator = useValidate({
    formControl: formControlWoSubmit,
    criteriaMode,
    context,
    resolver,
  });

  const handleSubmit = useMemo(
    () =>
      formSubmitCreator({
        formControl: formControlWoSubmit,
        validator,
        onSubmit,
        setSubmitCount,
        setIsSubmitting,
      }),
    [
      formControlWoSubmit,
      formSubmitCreator,

      validator,
      onSubmit,
      setSubmitCount,
      setIsSubmitting,
    ],
  );

  const formControl = useMemo<FormControl<Values, SubmitProps>>(
    () => ({
      ...formControlWoSubmit,
      handleSubmit,
    }),
    [formControlWoSubmit, handleSubmit],
  );

  return formControl;
};
