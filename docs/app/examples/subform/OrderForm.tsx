"use client";
import { yupResolver } from "react-flexible-form-resolvers";
import { Field, OnSubmit, useForm, useSubform } from "react-flexible-form";
import * as Yup from "yup";
import SimpleInput from "./SimpleInput";
import { useCallback } from "react";
import AddressForm, { Address, addressValidator } from "./AddressForm";

type Order = {
  orderNo: number;
  carrier: string;
  deliveryAddress: Address;
};

const resolver = yupResolver(
  Yup.object({
    orderNo: Yup.number().required("Required"),
    carrier: Yup.string().required("Required"),
    deliveryAddress: addressValidator,
  }),
);

const OrderForm = () => {
  const onSubmit = useCallback<OnSubmit<Order>>(
    ({ formControl: { values } }) => {
      alert(`Submitted form values: \n ${JSON.stringify(values)}`);
    },
    [],
  );

  const formControl = useForm<Order>({
    initialValues: {
      orderNo: 0,
      carrier: "",
      deliveryAddress: {
        country: "",
        state: "",
        city: "",
        zipCode: "",
        street1: "",
        street2: undefined,
      },
    },
    resolver,
    onSubmit,
  });
  /* Important code start */
  const addressFormControl = useSubform({
    formControl,
    name: "deliveryAddress",
  });
  /* Important code end */

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Field
        rffFormControl={formControl}
        rffName="orderNo"
        rffComponent={SimpleInput}
        label="Order No"
      />
      <Field
        rffFormControl={formControl}
        rffName="carrier"
        rffComponent={SimpleInput}
        label="Carrier"
      />
      {/* Important code start */}
      <AddressForm subFormControl={addressFormControl} />
      {/* Important code end */}
      <button onClick={formControl.handleSubmit}>Submit</button>
    </div>
  );
};

export default OrderForm;
