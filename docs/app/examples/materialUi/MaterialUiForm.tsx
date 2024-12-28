"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OnSubmit,
  useForm,
  Field,
  ConvertHook,
  getIn,
  getInErrors,
} from "react-flexible-form";
import { useCallback, useMemo } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { yupResolver } from "react-flexible-form-resolvers";
import * as Yup from "yup";

type Values = {
  country: string;
  state: string;
  city: string;
  zipCode: string;
  street1: string;
  street2?: string | undefined;
};

const resolver = yupResolver(
  Yup.object({
    country: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    zipCode: Yup.string().required("Required"),
    street1: Yup.string().required("Required"),
    street2: Yup.string(),
  }),
);

const useConvert: ConvertHook<Values, TextFieldProps> = ({
  rffName: name,
  formControl: { values, errors, touched, setFieldValue, setFieldTouched },
}) => {
  const value = getIn({ values, name: name as any });
  const error = getInErrors({ errors, name: name as any });
  const fieldError = error.length ? error.join(", ") : undefined;
  const fieldTouched = !!getIn({ values: touched, name: name as any });

  return useMemo(() => {
    return {
      value,
      error: fieldTouched && !!fieldError,
      helperText: (fieldTouched && fieldError) || " ",
      onBlur: () => setFieldTouched(name as any, true),
      onChange: ({ target: { value } }) => setFieldValue(name as any, value),
    };
  }, [name, value, fieldError, fieldTouched, setFieldTouched, setFieldValue]);
};

const MaterialUiForm = () => {
  const onSubmit = useCallback<OnSubmit<Values>>(
    ({ formControl: { values, setIsSubmitting } }) => {
      alert(`Form values: \n ${JSON.stringify(values)}`);
      setIsSubmitting(false);
    },
    [],
  );

  const formControl = useForm({
    initialValues: {
      country: "",
      state: "",
      city: "",
      zipCode: "",
      street1: "",
      street2: "",
    },
    onSubmit,
    resolver,
  });

  return (
    <Box
      component="div"
      sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <Box component="div" sx={{ display: "flex", gap: "10px" }}>
        <Box
          component="div"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Field
            rffFormControl={formControl}
            rffName="country"
            rffComponent={TextField}
            label="Country"
            rffUseConvert={useConvert}
          />
          <Field
            rffFormControl={formControl}
            rffName="state"
            rffComponent={TextField}
            label="State"
            rffUseConvert={useConvert}
          />
          <Field
            rffFormControl={formControl}
            rffName="city"
            rffComponent={TextField}
            label="City"
            rffUseConvert={useConvert}
          />
        </Box>
        <Box
          component="div"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Field
            rffFormControl={formControl}
            rffName="zipCode"
            rffComponent={TextField}
            label="Zip Code"
            rffUseConvert={useConvert}
          />
          <Field
            rffFormControl={formControl}
            rffName="street1"
            rffComponent={TextField}
            label="Street Address 1"
            rffUseConvert={useConvert}
          />
          <Field
            rffFormControl={formControl}
            rffName="street2"
            rffComponent={TextField}
            label="Street Address 2"
            rffUseConvert={useConvert}
          />
        </Box>
      </Box>
      <Button
        disabled={formControl.isSubmitting}
        onClick={formControl.handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default MaterialUiForm;
