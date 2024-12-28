import * as Yup from "yup";
import { yupResolver } from "react-flexible-form-resolvers";
import { expect, test } from "@jest/globals";

const schema = Yup.object({
  prop1: Yup.string().required("Required").min(2, "Min 2"),
  obj: Yup.object({
    objProp: Yup.string().required("Required"),
  }),
  objArr: Yup.array().of(
    Yup.object({
      arrObjProp: Yup.string().required("Required"),
    }),
  ),
  arr: Yup.array().of(Yup.string().required("Required")),
  // Even if arr2 is array, resulting error may be an object
  arr2: Yup.array().min(2, "Min 2").of(Yup.string().required("Required")),
});

const resolver = yupResolver(schema);

const values = {
  prop1: "",
  obj: {
    objProp: "",
  },
  objArr: [
    {
      arrObjProp: "",
    },
    {
      arrObjProp: "value",
    },
    {
      arrObjProp: "",
    },
  ],
  arr: ["", "value", ""],
  arr2: [""],
};

test("should return correct error object", async () => {
  const { errors } = await resolver(values, undefined, {
    criteriaMode: "all",
    fields: {},
  });

  expect(errors).toEqual({
    prop1: expect.objectContaining({
      message: "Required",
      types: { min: "Min 2", required: "Required" },
    }),
    obj: {
      objProp: expect.objectContaining({ message: "Required" }),
    },
    objArr: [
      {
        arrObjProp: expect.objectContaining({ message: "Required" }),
      },
      undefined,
      {
        arrObjProp: expect.objectContaining({ message: "Required" }),
      },
    ],
    arr: [
      expect.objectContaining({ message: "Required" }),
      undefined,
      expect.objectContaining({ message: "Required" }),
    ],
    arr2: expect.objectContaining({ message: "Min 2" }),
  });
});
