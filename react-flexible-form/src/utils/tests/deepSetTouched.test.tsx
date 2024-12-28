import { expect, test } from "@jest/globals";
import { deepSetTouched } from "../deepSetTouched";

test("should set a value of the object", () => {
  const obj = { a: "12", b: "other" };
  const newValue = deepSetTouched(obj);

  expect(newValue).toEqual({ a: true, b: true });
});

test("should set value of the nested object", () => {
  const obj = { b: "other", nested: { a: "124", b: true } };
  const newValue = deepSetTouched(obj);

  expect(newValue).toEqual({ b: true, nested: { a: true, b: true } });
});

test("should set values of the nested array", () => {
  const obj = { b: "other", nestedArr: [12, 15] };
  const newValue = deepSetTouched(obj);

  expect(newValue).toEqual({ b: true, nestedArr: [true, true] });
});

test("should get nested obj of the array of objects", () => {
  const obj = { b: "other", nestedArr: [{ a: "14" }, { b: "12" }] };
  const newValue = deepSetTouched(obj);

  expect(newValue).toEqual({
    b: true,
    nestedArr: [{ a: true }, { b: true }],
  });
});
