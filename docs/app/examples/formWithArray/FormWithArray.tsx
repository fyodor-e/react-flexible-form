"use client";
import { yupResolver } from "react-flexible-form-resolvers";
import { OnSubmit, useForm, Field, useFieldArray } from "react-flexible-form";
import { useCallback, useMemo } from "react";
import * as Yup from "yup";
import { Button, HStack, VStack } from "@chakra-ui/react";
import ChakraFormInput from "../chakra/ChakraFormInput";

type Values = {
  warehouse: string;
  inventory: {
    code: string;
    name: string;
    quantity: number;
  }[];
};

const resolver = yupResolver(
  Yup.object({
    warehouse: Yup.string().required("Required"),
    inventory: Yup.array()
      .of(
        Yup.object({
          code: Yup.string().required("Required"),
          name: Yup.string().required("Required"),
          quantity: Yup.number()
            .typeError("Required")
            .min(0, "Should be positive")
            .required("Required"),
        }),
      )
      .required("Required"),
  }),
);

const FormWithArray = () => {
  const onSubmit = useCallback<OnSubmit<Values>>(
    ({ formControl: { values } }) => {
      alert(`Form values: \n ${JSON.stringify(values)}`);
    },
    [],
  );

  const formControl = useForm<Values>({
    initialValues: {
      warehouse: "",
      inventory: useMemo(
        () =>
          new Array(100).fill(undefined).map((_, i) => ({
            name: `Item ${i}`,
            code: `c-${i}`,
            quantity: Math.round(Math.random() * 1000),
          })),
        [],
      ),
    },
    onSubmit,
    resolver,
  });

  /* Important code start */
  const { remove } = useFieldArray({ formControl, name: "inventory" });

  return (
    <VStack w="full" alignItems="flex-start">
      <Field
        rffFormControl={formControl}
        rffName="warehouse"
        rffComponent={ChakraFormInput}
        label="Warehouse"
      />
      {formControl.values.inventory.map((_, i) => (
        <HStack key={i}>
          <Field
            rffFormControl={formControl}
            rffName={`inventory.${i}.name`}
            rffComponent={ChakraFormInput}
            label="Name"
          />
          <Field
            rffFormControl={formControl}
            rffName={`inventory.${i}.code`}
            rffComponent={ChakraFormInput}
            label="Code"
          />
          <Field
            rffFormControl={formControl}
            rffName={`inventory.${i}.quantity`}
            rffComponent={ChakraFormInput}
            label="Quantity"
          />
          <Button
            size="md"
            minWidth="auto"
            variant="outline"
            colorScheme="red"
            onClick={() => remove(i)}
          >
            Delete
          </Button>
        </HStack>
      ))}
      <Button onClick={formControl.handleSubmit}>Submit</Button>
    </VStack>
  );
  /* Important code end */
};

export default FormWithArray;
