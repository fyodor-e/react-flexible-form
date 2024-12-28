/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, jest, describe, beforeEach } from "@jest/globals";
import { setIn } from "../setIn";
import { getIn } from "../getIn";
import { prepareName } from "../prepareName";

jest.mock("../getIn", () => ({
  // getIn to always return value that will not be equal to passed
  getIn: jest.fn(),
}));

jest.mock("../prepareName", () => ({
  // prepareName will have stub
  prepareName: jest.fn(),
}));

beforeEach(() => {
  (getIn as any).mockReset();
  (prepareName as any).mockReset();
});

test("should set whole object if name is empty string", () => {
  const values = { a: "12", b: "other" };
  const newValues = { a: "14", b: "15" };
  const name = "";
  (prepareName as any).mockReturnValueOnce(name);
  const updatedValues = setIn({
    values,
    name,
    value: newValues,
  });

  expect(updatedValues).toEqual(newValues);
  // Should not mutate source object
  expect(updatedValues).not.toBe(values);
});

test("should set value of the object", () => {
  const values = { a: "12", b: "other" };
  const value = "14";
  const name = "a";
  (prepareName as any).mockReturnValueOnce(name);
  const updatedValues = setIn({
    values,
    name,
    value,
  });

  expect(updatedValues).toEqual({ ...values, a: value });
  // Should not mutate source object
  expect(updatedValues).not.toBe(values);
});

test("should set nested values of the object", () => {
  const values = { b: "other", nested: { a: "124", b: "some" } };
  const value = "14";
  const name = "nested.a";
  (prepareName as any).mockReturnValueOnce(name);
  const updatedValues = setIn({
    values,
    name,
    value,
  });

  expect(updatedValues).toEqual({
    ...values,
    nested: { ...values.nested, a: value },
  });
  // Should not mutate source object
  expect(updatedValues).not.toBe(values);
});

test("should set nested values of the array", () => {
  const values = { b: "other", nestedArr: [12, 15] };
  const value = 14;
  const name = "nestedArr.0";
  (prepareName as any).mockReturnValueOnce(name);
  const updatedValues = setIn({
    values,
    name,
    value,
  });

  expect(updatedValues).toEqual({
    ...values,
    nestedArr: [value, values.nestedArr[1]],
  });
  // Should not mutate source object
  expect(updatedValues).not.toBe(values);
});

test("should set nested values of the array of objects", () => {
  const values = { b: "other", nestedArr: [{ a: "14" }, { b: "12" }] };
  const value = { a: "14" };
  const name = "nestedArr.0";
  (prepareName as any).mockReturnValueOnce(name);
  const updatedValues = setIn({
    values,
    name,
    value,
  });

  expect(updatedValues).toEqual({
    ...values,
    nestedArr: [value, values.nestedArr[1]],
  });
  // Should not mutate source object
  expect(updatedValues).not.toBe(values);
});

test("should set nested values of the array of objects", () => {
  const values: any = { b: "other", nestedArr: [{ a: "14" }, { b: "12" }] };
  const value = "14";
  const name = "nestedArr.0.a";
  (prepareName as any).mockReturnValueOnce(name);
  const updatedValues = setIn({
    values,
    name,
    value,
  });

  expect(updatedValues).toEqual({
    ...values,
    nestedArr: [{ a: value }, values.nestedArr[1]],
  });
  // Should not mutate source object
  expect(updatedValues).not.toBe(values);
});

describe("Edge Cases", () => {
  test("should return a value if path is empty", () => {
    const values = { b: "other" };
    const value = { d: "some" };
    const name = "" as any;
    (prepareName as any).mockReturnValueOnce(name);
    const updatedValues = setIn({
      values,
      name,
      value,
    });

    expect(updatedValues).toEqual(value);
  });

  test("should extend object with previously non existing path", () => {
    const values = { b: "other" };
    const value = "18";
    const name = "nestedObj.d" as any;
    (prepareName as any).mockReturnValueOnce(name);
    const updatedValues = setIn({
      values,
      name,
      value,
    });

    expect(updatedValues).toEqual({ ...values, nestedObj: { d: value } });
  });

  test("should add priviously non existing array", () => {
    const values = { b: "other" };
    const value = "18";
    const name = "nestedArr.0.d" as any;
    (prepareName as any).mockReturnValueOnce(name);
    const updatedValues = setIn({
      values,
      name,
      value,
    });

    expect(updatedValues).toEqual({ ...values, nestedArr: [{ d: value }] });
  });

  test("should replace primitive value with object", () => {
    const values = { b: "other" };
    const value = "18";
    const name = "b.c" as any;
    (prepareName as any).mockReturnValueOnce(name);
    const updatedValues = setIn({
      values,
      name,
      value,
    });

    expect(updatedValues).toEqual({ b: { c: value } });
  });

  test("getIn return same value as passed", () => {
    const values = { b: "other" };
    const value = "other";
    const name = "b";
    (getIn as any).mockReturnValueOnce(value);
    (prepareName as any).mockReturnValueOnce(name);
    const updatedValues = setIn({
      values,
      name,
      value,
    });

    expect(updatedValues).toEqual(values);
  });

  test("erroneous situation: array index is not a number", () => {
    const values = { arr: [1, 2, 3] };
    const value = 18;
    const name: any = "arr.error";
    (prepareName as any).mockReturnValueOnce(name);
    const updatedValues = setIn({
      values,
      name,
      value,
    });

    expect(updatedValues).toEqual(values);
  });
});
