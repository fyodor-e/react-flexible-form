"use client";
import { yupResolver } from "react-flexible-form-resolvers";
import { OnSubmit, useForm, Field } from "react-flexible-form";
import { useCallback } from "react";
import * as Yup from "yup";
import ChakraFormInput from "./ChakraFormInput";
import { Button, HStack, VStack } from "@chakra-ui/react";

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

const ChakraAddressForm = () => {
  const onSubmit = useCallback<OnSubmit<Values>>(
    async ({ formControl: { values, setIsSubmitting } }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
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
      street2: undefined,
    },
    onSubmit,
    resolver,
  });

  return (
    <VStack w="full" alignItems="flex-start">
      <HStack w="full">
        <VStack w="full">
          <Field
            rffFormControl={formControl}
            rffName="country"
            rffComponent={ChakraFormInput}
            label="Country"
          />
          <Field
            rffFormControl={formControl}
            rffName="state"
            rffComponent={ChakraFormInput}
            label="State"
          />
          <Field
            rffFormControl={formControl}
            rffName="city"
            rffComponent={ChakraFormInput}
            label="City"
          />
        </VStack>
        <VStack w="full">
          <Field
            rffFormControl={formControl}
            rffName="zipCode"
            rffComponent={ChakraFormInput}
            label="Zip Code"
          />
          <Field
            rffFormControl={formControl}
            rffName="street1"
            rffComponent={ChakraFormInput}
            label="Street Address 1"
          />
          <Field
            rffFormControl={formControl}
            rffName="street2"
            rffComponent={ChakraFormInput}
            label="Street Address 2"
          />
        </VStack>
      </HStack>
      <Button
        onClick={formControl.handleSubmit}
        isLoading={formControl.isSubmitting}
      >
        Submit
      </Button>
    </VStack>
  );
};

export default ChakraAddressForm;
