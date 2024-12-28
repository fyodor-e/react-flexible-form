/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, PropsWithChildren } from "react";
import { Field } from "../Field";
import { DefaultBaseProps, FormControl, ConvertHook } from "../../types";

type Values = {
  prop1: "prop1";
  stringProp: string;
  numberProp: number;
  embeddedObj: {
    prop2: "prop2";
  };
};

const formControl: FormControl<Values> = {
  values: {
    prop1: "prop1",
    stringProp: "123",
    numberProp: 90,
    embeddedObj: {
      prop2: "prop2",
    },
  },
  touched: {},
  errors: {},
  dirty: {},
  setFieldValue: () => {},
  setFieldError: () => {},
  setFieldTouched: () => {},
  setFieldDirty: () => {},

  submitCount: 0,
  isSubmitting: false,
  setIsSubmitting: () => {},
  isLoading: false,
  setIsLoading: () => {},
  handleSubmit: () => Promise.resolve(),
  isValid: true,
};

// 1. Value assignability
//    (i.e. value: string should be assugnable to ComponentProps' value: string | undefined)

type ValueStringUndefined = {
  value: string | undefined;
};

const ValueStringUndefinedComponent: FC<ValueStringUndefined> = () => null;

const ValueStringUndefinedField = () => {
  return (
    <>
      <Field
        rffFormControl={formControl}
        rffComponent={ValueStringUndefinedComponent}
        rffName="stringProp"
      />
      {/* @ts-expect-error incompatible prop */}
      <Field
        rffFormControl={formControl}
        rffComponent={ValueStringUndefinedComponent}
        rffName="numberProp"
      />
    </>
  );
};

type ValueNumber = {
  value: number;
};

const ValueNumberComponent: FC<ValueNumber> = () => null;

const ValueNumberField = () => {
  return (
    <>
      <Field
        rffFormControl={formControl}
        rffComponent={ValueNumberComponent}
        rffName="numberProp"
      />
      {/* @ts-expect-error incorrect prop name */}
      <Field
        rffFormControl={formControl}
        rffComponent={ValueNumberComponent}
        rffName="stringProp"
      />
    </>
  );
};

// 2. Additional props in Component's props

type AdditionalProps = {
  requiredProp: string;
  optionalProp?: number;
  value: string;
};

const AdditionalPropsComponent: FC<AdditionalProps> = () => null;

const AdditionalPropsField = () => {
  return (
    <>
      <Field
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        requiredProp="2"
        rffFormControl={formControl}
      />
      <Field
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        // @ts-expect-error prop type is incorrect
        requiredProp={2} // should be a string
        rffFormControl={formControl}
      />
      {/* @ts-expect-error missing required prop */}
      <Field
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        rffFormControl={formControl}
        // requiredProp="2" - missing
      />
      <Field
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        requiredProp="2"
        rffFormControl={formControl}
        optionalProp={123}
      />
      <Field
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        requiredProp="2"
        rffFormControl={formControl}
        // @ts-expect-error prop type is incorrect
        optionalProp="123" // should be a number
      />
    </>
  );
};

// 2.1 useConvert provide additional props

const useConvertWithAdditionalProps: ConvertHook<
  Values,
  AdditionalProps
> = () => ({
  requiredProp: "123",
  optionalProp: 1,
  value: "prop1",
});

const UseConvertWithAdditionalPropsField = () => {
  return (
    <>
      <Field
        rffUseConvert={useConvertWithAdditionalProps}
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        rffFormControl={formControl}
      />
      <Field
        rffUseConvert={useConvertWithAdditionalProps}
        rffComponent={AdditionalPropsComponent}
        // @ts-expect-error rffName is incorrect
        rffName="errorProp"
        rffFormControl={formControl}
      />
      <Field
        rffUseConvert={useConvertWithAdditionalProps}
        rffComponent={AdditionalPropsComponent}
        rffFormControl={formControl}
        rffName="prop1"
        requiredProp="2" // may be provided
        optionalProp={1} // as well as optionalProp
      />
    </>
  );
};

// 2.2 useConvert produce only base props

const useConvertBase: ConvertHook<Values> = () => ({
  value: "prop1",
  onChange: () => {},
});

const ConvertWithOnlyBasePropsField = () => {
  return (
    <>
      <Field
        rffUseConvert={useConvertBase}
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        requiredProp="2"
        rffFormControl={formControl}
      />
      {/* @ts-expect-error missing required prop */}
      <Field
        rffUseConvert={useConvertBase}
        rffComponent={AdditionalPropsComponent}
        rffName="prop1"
        // requiredProp="2" - missing
        rffFormControl={formControl}
      />
      {/* @ts-expect-error rffName is incorrect */}
      <Field
        rffUseConvert={useConvertBase}
        rffComponent={AdditionalPropsComponent}
        rffName="embeddedObj" // should be prop1
        requiredProp="2"
        rffFormControl={formControl}
      />
    </>
  );
};

// 3. useConvert types test

type AlternativeBaseProps = {
  requiredProp: string;
  optionalProp?: number;
  onBlur: () => void;
  value: "prop1";
};
const Component2: FC<AlternativeBaseProps> = () => null;

const useConvertRequiredIsMissing: ConvertHook<
  Values,
  AlternativeBaseProps
> = () =>
  // @ts-expect-error missing prop
  ({
    onBlur: () => {},
    value: "prop1",
    optionalProp: 2,
  });

type AnotherComponentProps = { anotherRequiredProp: number };
const AnotherComponent: FC<AnotherComponentProps> = () => null;

const useConvertIncompatible2: ConvertHook<Values> = () => ({
  onBlur: () => {},
  value: "prop1",
});

// 4. Return props from converter function
//    are not compatible with provided component

const IncompatibleComponent = () => {
  return (
    <Field
      useConvert={useConvertIncompatible2}
      rffFormControl={formControl}
      // @ts-expect-error error
      rffComponent={AnotherComponent}
      rffName="prop1"
    />
  );
};

type AlternativeBaseProps2 = { additionlProp: string; value: "prop1" };
const AlternativeComponent: FC<AlternativeBaseProps2> = () => null;

const useConvertAdditional: ConvertHook<
  Values,
  AlternativeBaseProps2
> = () => ({
  value: "prop1",
  additionlProp: "",
});

const AdditionalConevrtFunctionProps = () => {
  return (
    <Field
      rffUseConvert={useConvertAdditional}
      rffFormControl={formControl}
      rffComponent={AlternativeComponent}
      rffName="prop1"
    />
  );
};

const AdditionalPropIsPresentInFieldProps = () => {
  return (
    <Field
      rffUseConvert={useConvertAdditional}
      rffFormControl={formControl}
      rffComponent={AlternativeComponent}
      rffName="prop1"
      additionlProp=""
    />
  );
};

// 5. BaseProps does not contain value but has selected prop

type BasePropsWithSelected = {
  additionlProp: string;
  selected: "prop1";
  value: any;
};
const ComponentWithSelectedProp: FC<BasePropsWithSelected> = () => null;

const useConvertSelected: ConvertHook<Values, BasePropsWithSelected> = () => ({
  value: undefined,
  selected: "prop1",
  additionlProp: "",
});

const BasePropsWithSelectedField = () => {
  return (
    <>
      <Field
        rffUseConvert={useConvertSelected}
        rffFormControl={formControl}
        rffComponent={ComponentWithSelectedProp}
        additionlProp=""
        rffName="prop1"
      />
      {/* Override selected prop */}
      <Field
        rffUseConvert={useConvertSelected}
        rffFormControl={formControl}
        rffComponent={ComponentWithSelectedProp}
        rffName="prop1"
        additionlProp=""
        selected="prop1"
      />
      {/* Incorrect selected prop value */}
      <Field
        rffUseConvert={useConvertSelected}
        rffFormControl={formControl}
        rffComponent={ComponentWithSelectedProp}
        rffName="prop1"
        additionlProp=""
        // @ts-expect-error incorect value
        selected="incorrect value" // should be selected='prop1'
      />
    </>
  );
};

const useConvertSelectedIncorrect: ConvertHook<
  Values,
  BasePropsWithSelected
> = () => ({
  // @ts-expect-error incorrect value
  selected: "prop2", // should be selected: "prop1"
  additionlProp: "",
});

// useDefaultConvertHook tests

type DefaultConvertHookCompatibleProps = {
  value: "prop1";
  onChange: (arg: { target: { value: string | number } }) => void;
  onBlur: () => void;
  error: string | undefined;
  touched: boolean;
};
const DefaultConvertHookCompatibleComponent: FC<
  DefaultConvertHookCompatibleProps
> = () => null;

const DefaultConvertHookField = () => {
  return (
    <>
      <Field
        rffFormControl={formControl}
        rffComponent={DefaultConvertHookCompatibleComponent}
        rffName="prop1"
      />
      {/* @ts-expect-error incorrect value type */}
      <Field
        rffFormControl={formControl}
        rffComponent={DefaultConvertHookCompatibleComponent}
        rffName="embeddedObj"
      />
    </>
  );
};

const DefaultHookCompPropsWithRequired: FC<
  DefaultConvertHookCompatibleProps & { reqProp: "reqProp" }
> = () => null;

const DefaultHookCompPropsWithRequiredField = () => {
  return (
    <>
      <Field
        rffFormControl={formControl}
        rffComponent={DefaultHookCompPropsWithRequired}
        rffName="prop1"
        reqProp="reqProp"
      />
    </>
  );
};

// Default base props
type ComponentWithRequiredAdditionalProp = {
  label: string;
  value: string;
};

// HTML <input /> component tests

const HTMLInputComponent = () => {
  return (
    <>
      <Field
        rffFormControl={formControl}
        rffComponent="input"
        rffName="prop1"
      />
    </>
  );
};

// <div /> does not have props of the <input />, like onChange, etc.
const HTMLDivComponent = () => {
  return (
    <>
      <Field
        rffFormControl={formControl}
        // @ts-expect-error <div /> does not has props of <input />
        rffComponent="div"
        rffName="prop1"
      />
    </>
  );
};

type OnChangeIncompatibleForInputPorps = Omit<DefaultBaseProps, "onChange"> & {
  onChange: (arg: string) => void;
};

const useConvertIncompatibleForInput: ConvertHook<
  Values,
  OnChangeIncompatibleForInputPorps
> = () => ({
  onBlur: () => {},
  onChange: () => {},
  value: "123",
});

const HTMLInputIncompatibleComponent = () => {
  return (
    <>
      <Field
        rffUseConvert={useConvertIncompatibleForInput}
        rffFormControl={formControl}
        rffComponent="input"
        rffName="prop1"
      />
    </>
  );
};

// Component with children

type ComponentWithChildrenProps = {
  value: "prop1";
};

const ComponentWithChildren: FC<
  PropsWithChildren<ComponentWithChildrenProps>
> = ({ children }) => children;

const ComponentWithoutChildren: FC<ComponentWithChildrenProps> = () => null;

const ComponentWithChildrenField = () => {
  return (
    <>
      <Field
        rffFormControl={formControl}
        rffComponent={ComponentWithChildren}
        rffName="prop1"
      >
        <></>
      </Field>

      {/* @ts-expect-error no children on the component */}
      <Field
        rffFormControl={formControl}
        rffComponent={ComponentWithoutChildren}
        rffName="prop1"
      >
        <></>
      </Field>
    </>
  );
};
