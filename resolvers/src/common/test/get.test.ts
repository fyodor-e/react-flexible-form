import { expect, it } from "@jest/globals";
import get from "../get";

it("should get the right data", () => {
  const test = {
    arr1: [1, 2, 3],
    arr2: [1, 3, { prop1: "test" }],
    obj: { test: { test1: [{ test2: "test2" }] } },
    "obj.test.test1[0].test1": "test",
    "dotted.filled": "content",
    "dotted.empty": "",
  };
  expect(get(test, "arr1")).toEqual([1, 2, 3]);
  expect(get(test, "arr1[0]")).toEqual(1);
  expect(get(test, "arr2[2].prop1")).toEqual("test");
  expect(get(test, "obj.test.test1[0].test2")).toEqual("test2");
  expect(get(test, "obj.test.test1[0].test1")).toEqual("test");
  expect(get(test, "obj.test.test1[0].test3")).toEqual(undefined);
  expect(get(test, "dotted.filled")).toEqual(test["dotted.filled"]);
  expect(get(test, "dotted.empty")).toEqual(test["dotted.empty"]);
  expect(get(test, "dotted.nonexistent", "default")).toEqual("default");
});

it("should get from the flat data", () => {
  const test = {
    prop2: "test",
  };
  expect(get(test, "prop2")).toEqual("test");
});

it("should return undefined when provided with empty path", () => {
  const test = {
    prop2: "test",
  };
  expect(get(test, "")).toEqual(undefined);
  expect(get(test, undefined)).toEqual(undefined);
  expect(get(test, null)).toEqual(undefined);
});
