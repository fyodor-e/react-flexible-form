"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OnSubmit,
  useForm,
  Field,
  ConvertHook,
  getIn,
} from "react-flexible-form";
import { useCallback } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import Select, { GroupBase, Props as ReactSelectProps } from "react-select";
import "react-datepicker/dist/react-datepicker.css";

type Color = { label: string; value: string };

type Values = {
  date: Date | null;
  color: Color;
};

const colors: Color[] = [
  { label: "Green", value: "green" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
];
// Important code start
const useReactSelectConvert: ConvertHook<
  any,
  Pick<
    ReactSelectProps<unknown, false, GroupBase<unknown>>,
    "value" | "onChange"
  >
> = ({ formControl: { values, setFieldValue }, rffName }) => {
  const value = getIn<any>({ name: rffName, values });
  const onChange = useCallback<
    NonNullable<
      ReactSelectProps<unknown, false, GroupBase<unknown>>["onChange"]
    >
  >(
    (value) => {
      setFieldValue<any>(rffName, value);
    },
    [rffName, setFieldValue],
  );

  return {
    value,
    onChange,
  };
};

const useDatePickerConvert: ConvertHook<
  any,
  {
    selected: Date | null;
    onChange: NonNullable<DatePickerProps["onChange"]>;
    value?: undefined;
  }
> = ({ formControl: { values, setFieldValue }, rffName }) => {
  const selected = getIn<any>({ name: rffName, values });
  const onChange = useCallback<NonNullable<DatePickerProps["onChange"]>>(
    (value: any) => {
      setFieldValue<any>(rffName, value);
    },
    [rffName, setFieldValue],
  );

  return {
    selected,
    onChange,
  };
};
// Important code end
const CustomUseConvert = () => {
  const onSubmit = useCallback<OnSubmit<Values>>(
    ({ formControl: { values } }) => {
      alert(`Form values: \n ${JSON.stringify(values)}`);
    },
    [],
  );

  const formControl = useForm({
    initialValues: { date: new Date(), color: colors[0] },
    onSubmit,
  });

  return (
    <div
      style={{
        gap: "7px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Important code start */}
      <label>Date</label>
      <Field
        rffUseConvert={useDatePickerConvert}
        rffFormControl={formControl}
        rffName="date"
        rffComponent={DatePicker as any}
      />
      <label>Color</label>
      <Field
        rffUseConvert={useReactSelectConvert}
        rffFormControl={formControl}
        rffName="color"
        rffComponent={Select<Color>}
        options={colors}
      />
      {/* Important code end */}
      {!formControl.isValid && (
        <>
          <div className="text-red-500">Form have errors:</div>
          <div className="text-red-500">
            {JSON.stringify(formControl.errors)}
          </div>
        </>
      )}
      <button onClick={formControl.handleSubmit}>Submit</button>
    </div>
  );
};

export default CustomUseConvert;
