import { expect, test } from "@jest/globals";
import { FormErrors } from "../../types";
import { getInErrors } from "../getInErrors";

type Values = {
  prop1: string;
  obj: {
    embeddedProp: "obj";
  };
  objArr: {
    arrObjProp: "arrObj";
  }[];
  arr: string[];
  arr2: number[];
};

const errors: FormErrors<Values> = {
  prop1: {
    message: "Required",
    types: { min: "Min 2", required: "Required" },
  },
  obj: {
    embeddedProp: {
      message: "Required",
    },
  },
  objArr: [
    {
      arrObjProp: {
        message: "Required",
      },
    },
    undefined,
    {
      arrObjProp: {
        message: "Required",
      },
    },
  ],
  arr: [
    {
      message: "Required",
    },
  ],
  arr2: [
    {
      message: "Required",
    },
  ],
};

test("getInError should extract error from prop1", async () => {
  expect(getInErrors({ errors, name: "prop1" }).sort()).toEqual(
    ["Required", "Min 2"].sort(),
  );

  expect(getInErrors({ errors, name: "obj" })).toEqual([]);
  expect(getInErrors({ errors, name: "obj.embeddedProp" })).toEqual([
    "Required",
  ]);

  expect(getInErrors({ errors, name: "objArr" })).toEqual([]);
  expect(getInErrors({ errors, name: "objArr.0" })).toEqual([]);
  expect(getInErrors({ errors, name: "objArr.0.arrObjProp" })).toEqual([
    "Required",
  ]);
  expect(getInErrors({ errors, name: "objArr.1" })).toEqual([]);
  expect(getInErrors({ errors, name: "objArr.2" })).toEqual([]);
  expect(getInErrors({ errors, name: "objArr.2.arrObjProp" })).toEqual([
    "Required",
  ]);

  expect(getInErrors({ errors, name: "arr" })).toEqual([]);
  expect(getInErrors({ errors, name: "arr.0" })).toEqual(["Required"]);
  expect(getInErrors({ errors, name: "arr.1" })).toEqual([]);

  expect(getInErrors({ errors, name: "arr2" })).toEqual([]);
  expect(getInErrors({ errors, name: "arr2.0" })).toEqual(["Required"]);
  expect(getInErrors({ errors, name: "arr2.1" })).toEqual([]);
});
