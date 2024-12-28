/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, jest, describe, beforeEach } from "@jest/globals";
import { getIn } from "../getIn";
import { prepareName } from "../prepareName";

jest.mock("../prepareName", () => ({
  // prepareName will have stub
  prepareName: jest.fn(),
}));

beforeEach(() => {
  (prepareName as any).mockReset();
});

test("should get a value of the object", () => {
  const values = { a: "12", b: "other" };
  const name = "a";
  (prepareName as any).mockReturnValueOnce(name);
  const value = getIn({
    values,
    name,
  });

  expect(value).toBe(values.a);
});

test("should get nested value of the object", () => {
  const values = { b: "other", nested: { a: "124", b: "some" } };
  const name = "nested.a";
  (prepareName as any).mockReturnValueOnce(name);
  const value = getIn({
    values,
    name,
  });

  expect(value).toBe(values.nested.a);
});

test("should get nested values of the array", () => {
  const values = { b: "other", nestedArr: [12, 15] };
  const name = "nestedArr.0";
  (prepareName as any).mockReturnValueOnce(name);
  const value = getIn({
    values,
    name,
  });

  expect(value).toBe(values.nestedArr[0]);
});

test("should get nested values of the array of objects", () => {
  const values = { b: "other", nestedArr: [{ a: "14" }, { b: "12" }] };
  const name = "nestedArr.0";
  (prepareName as any).mockReturnValueOnce(name);
  const value = getIn({
    values,
    name,
  });

  expect(value).toBe(values.nestedArr[0]);
});

test("should get nested values of the array of objects", () => {
  const values = { b: "other", nestedArr: [{ a: "14" }, { b: "12" }] };
  const name = "nestedArr.0.a" as any;
  (prepareName as any).mockReturnValueOnce(name);
  const value = getIn({
    values,
    name,
  });

  expect(value).toBe(values.nestedArr[0].a);
});

describe("Edge Cases", () => {
  test("should return values if path is empty", () => {
    const values = { b: "other" };
    const name = "" as any;
    (prepareName as any).mockReturnValueOnce(name);
    const value = getIn({
      values,
      name,
    });

    expect(value).toBe(values);
  });

  test("should return undefined for non existing path", () => {
    const values = { b: "other" };
    const name = "nestedObj.d" as any;
    (prepareName as any).mockReturnValueOnce(name);
    const value = getIn({
      values,
      name,
    });

    expect(value).toBe(undefined);
  });

  test("should return undefined for priviously non existing array", () => {
    const values = { b: "other" };
    const name = "nestedArr.0.d" as any;
    (prepareName as any).mockReturnValueOnce(name);
    const value = getIn({
      values,
      name,
    });

    expect(value).toBe(undefined);
  });

  test("erroneous situation: array index is not a number", () => {
    const values = { arr: [1, 2, 3] };
    const name: any = "arr.error";
    (prepareName as any).mockReturnValueOnce(name);
    const value = getIn({
      values,
      name,
    });

    expect(value).toBe(undefined);
  });
});
