"use client";
import { OnSubmit, useForm, Field, getInErrors } from "react-flexible-form";
import { useCallback } from "react";
import * as Yup from "yup";
import { yupResolver } from "react-flexible-form-resolvers";

type Values = {
  firstName: string;
  lastName: string;
};

const resolver = yupResolver(
  Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
  }),
);

const SimpleForm = () => {
  const onSubmit = useCallback<OnSubmit<Values>>(
    ({ formControl: { values } }) => {
      alert(`Form values: \n ${JSON.stringify(values)}`);
    },
    [],
  );

  const formControl = useForm({
    initialValues: { firstName: "", lastName: "" },
    onSubmit,
    resolver,
  });

  return (
    <div
      style={{
        gap: "7px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label>First Name</label>
      <Field
        rffFormControl={formControl}
        rffName="firstName"
        rffComponent="input"
      />
      <div style={{ color: "red", whiteSpace: "pre" }}>
        {getInErrors({ errors: formControl.errors, name: "firstName" }).join(
          ", ",
        ) || " "}
      </div>
      <label>Last Name</label>
      <Field
        rffFormControl={formControl}
        rffName="lastName"
        rffComponent="input"
      />
      <div style={{ color: "red", whiteSpace: "pre" }}>
        {getInErrors({ errors: formControl.errors, name: "lastName" }).join(
          ", ",
        ) || " "}
      </div>
      <button onClick={formControl.handleSubmit}>Submit</button>
    </div>
  );
};

export default SimpleForm;
