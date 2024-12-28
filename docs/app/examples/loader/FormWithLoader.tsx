"use client";
import { OnSubmit, useForm, Field } from "react-flexible-form";
import { useCallback } from "react";
import { Button, HStack, Skeleton, VStack } from "@chakra-ui/react";
import ChakraFormInput from "../chakra/ChakraFormInput";
import { ChakraProvider } from "@chakra-ui/react";

type Values = {
  country: string | undefined;
  state: string | undefined;
  city: string | undefined;
  zipCode: string | undefined;
  street1: string | undefined;
  street2?: string | undefined;
};

const LoadingComonent = () => <Skeleton w="full" h="96px" />;

const FormWithLoader = () => {
  const onSubmit = useCallback<OnSubmit<Values>>(
    ({ formControl: { values } }) => {
      alert(`Form values: \n ${JSON.stringify(values)}`);
    },
    [],
  );

  const formControl = useForm<Values>({
    initialValues: {
      country: "",
      state: "",
      city: "",
      zipCode: "",
      street1: "",
      street2: "",
    },
    onSubmit,
  });

  const handleReload = useCallback(() => {
    formControl.setIsLoading(true);
    setTimeout(() => {
      formControl.setFieldValue("", {
        country: "US",
        state: "LA",
        city: "Los Angeles",
        zipCode: "90000",
        street1: "Street 1",
        street2: "",
      });
      formControl.setIsLoading(false);
    }, 3000);
  }, [formControl]);

  return (
    <ChakraProvider>
      <VStack w="full" alignItems="flex-start">
        <Button onClick={handleReload}>Reload</Button>
        <HStack w="full">
          <VStack flex="1">
            <Field
              rffFormControl={formControl}
              rffName="country"
              rffComponent={ChakraFormInput}
              label="Country"
              rffLoadingComponent={LoadingComonent}
            />
            <Field
              rffFormControl={formControl}
              rffName="state"
              rffComponent={ChakraFormInput}
              label="State"
              rffLoadingComponent={LoadingComonent}
            />
            <Field
              rffFormControl={formControl}
              rffName="city"
              rffComponent={ChakraFormInput}
              label="City"
              rffLoadingComponent={LoadingComonent}
            />
          </VStack>
          <VStack flex="1">
            <Field
              rffFormControl={formControl}
              rffName="zipCode"
              rffComponent={ChakraFormInput}
              label="Zip Code"
              rffLoadingComponent={LoadingComonent}
            />
            <Field
              rffFormControl={formControl}
              rffName="street1"
              rffComponent={ChakraFormInput}
              label="Street Address 1"
              rffLoadingComponent={LoadingComonent}
            />
            <Field
              rffFormControl={formControl}
              rffName="street2"
              rffComponent={ChakraFormInput}
              label="Street Address 2"
              rffLoadingComponent={LoadingComonent}
            />
          </VStack>
        </HStack>
        <Button
          isDisabled={formControl.isLoading}
          onClick={formControl.handleSubmit}
        >
          Submit
        </Button>
      </VStack>
    </ChakraProvider>
  );
};

export default FormWithLoader;
