"use client";
import { Field, OnSubmit, useForm, UseValidate } from "react-flexible-form";
import * as Yup from "yup";
import { FC, useCallback, useEffect, useMemo } from "react";
import SimpleInput from "./SimpleInput";
import { yupResolver } from "react-flexible-form-resolvers";
import { throttle } from "throttle-debounce";

export type Address = {
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

/* Important code start */
const useValidate: UseValidate<Address> = ({
  formControl: { values, setFieldError },
  resolver,
  context,
  criteriaMode,
}) => {
  const validator = useCallback(
    async (values: Address) => {
      const { errors } = resolver
        ? await resolver(values, context, {
            criteriaMode,
            shouldUseNativeValidation: false,
            fields: undefined,
          })
        : { errors: {} };
      return errors;
    },
    [resolver, context, criteriaMode],
  );

  const throttleFn = useMemo(
    () =>
      throttle(5000, async (values: Address) => {
        const newErrors = await validator(values);
        setFieldError("", newErrors);
      }),
    [validator, setFieldError],
  );

  useEffect(() => {
    throttleFn(values);
  }, [throttleFn, values]);

  return useCallback(() => validator(values), [validator, values]);
};
/* Important code end */

const AddressForm: FC = () => {
  const onSubmit = useCallback<OnSubmit<Address>>(
    ({ formControl: { values } }) => {
      alert(`Submitted form values: \n ${JSON.stringify(values)}`);
    },
    [],
  );

  /* Important code start */
  const formControl = useForm<Address>({
    initialValues: {
      country: "",
      state: "",
      city: "",
      zipCode: "",
      street1: "",
      street2: undefined,
    },
    resolver,
    onSubmit,
    useValidate,
  });
  /* Important code end */

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateRows: "repeat(4, auto)",
        gridTemplateColumns: "auto auto",
        gap: "10px",
      }}
    >
      <Field
        rffFormControl={formControl}
        rffName="country"
        rffComponent={SimpleInput}
        label="Country"
        style={{ gridColumn: 1, gridRow: 1 }}
      />
      <Field
        rffFormControl={formControl}
        rffName="state"
        rffComponent={SimpleInput}
        label="State"
        style={{ gridColumn: 1, gridRow: 2 }}
      />
      <Field
        rffFormControl={formControl}
        rffName="city"
        rffComponent={SimpleInput}
        label="City"
        style={{ gridColumn: 1, gridRow: 3 }}
      />
      <Field
        rffFormControl={formControl}
        rffName="zipCode"
        rffComponent={SimpleInput}
        label="Zip Code"
        style={{ gridColumn: 2, gridRow: 1 }}
      />
      <Field
        rffFormControl={formControl}
        rffName="street1"
        rffComponent={SimpleInput}
        label="Street Address 1"
        style={{ gridColumn: 2, gridRow: 2 }}
      />
      <Field
        rffFormControl={formControl}
        rffName="street2"
        rffComponent={SimpleInput}
        label="Street Address 2"
        style={{ gridColumn: 2, gridRow: 3 }}
      />
      <button onClick={formControl.handleSubmit}>Submit</button>
    </div>
  );
};

export default AddressForm;
