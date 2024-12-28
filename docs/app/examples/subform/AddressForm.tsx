import { Field, FormControl } from "react-flexible-form";
import * as Yup from "yup";
import { FC } from "react";
import SimpleInput from "./SimpleInput";

export type Address = {
  country: string;
  state: string;
  city: string;
  zipCode: string;
  street1: string;
  street2?: string | undefined;
};

export const addressValidator = Yup.object({
  country: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  zipCode: Yup.string().required("Required"),
  street1: Yup.string().required("Required"),
  street2: Yup.string(),
});

type Props = {
  subFormControl: Omit<FormControl<Address>, "handleSubmit">;
};

const AddressForm: FC<Props> = ({ subFormControl }) => {
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
        rffFormControl={subFormControl}
        rffName="country"
        rffComponent={SimpleInput}
        label="Country"
        style={{ gridColumn: 1, gridRow: 1 }}
      />
      <Field
        rffFormControl={subFormControl}
        rffName="state"
        rffComponent={SimpleInput}
        label="State"
        style={{ gridColumn: 1, gridRow: 2 }}
      />
      <Field
        rffFormControl={subFormControl}
        rffName="city"
        rffComponent={SimpleInput}
        label="City"
        style={{ gridColumn: 1, gridRow: 3 }}
      />
      <Field
        rffFormControl={subFormControl}
        rffName="zipCode"
        rffComponent={SimpleInput}
        label="Zip Code"
        style={{ gridColumn: 2, gridRow: 1 }}
      />
      <Field
        rffFormControl={subFormControl}
        rffName="street1"
        rffComponent={SimpleInput}
        label="Street Address 1"
        style={{ gridColumn: 2, gridRow: 2 }}
      />
      <Field
        rffFormControl={subFormControl}
        rffName="street2"
        rffComponent={SimpleInput}
        label="Street Address 2"
        style={{ gridColumn: 2, gridRow: 3 }}
      />
    </div>
  );
};

export default AddressForm;
