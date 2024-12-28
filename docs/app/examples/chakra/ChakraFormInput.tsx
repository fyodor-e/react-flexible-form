"use client";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  error: string | undefined;
  touched: boolean;
  label: string;
  value: string | number | undefined;
  onChange: (arg: { target: { value: string | number } }) => void;
  onBlur: () => void;
} & Omit<InputProps, "value" | "onChange" | "onBlur">;

const ChakraFormInput: FC<Props> = ({ touched, error, label, ...rest }) => {
  const isInvalid = !!(error && touched);
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <Input {...rest} />
      {isInvalid ? (
        <FormHelperText color="red">{error}</FormHelperText>
      ) : (
        <FormHelperText whiteSpace="pre"> </FormHelperText>
      )}
    </FormControl>
  );
};

export default ChakraFormInput;
