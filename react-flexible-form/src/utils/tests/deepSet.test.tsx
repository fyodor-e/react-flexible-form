import { expect, test, describe } from "@jest/globals";
import { deepSet } from "../deepSet";

describe("promitive values", () => {
  test("boolean", () => {
    const newValue = deepSet(true, false);
    expect(newValue).toEqual(false);
  });

  test("number", () => {
    const newValue = deepSet(12, 15);
    expect(newValue).toEqual(15);
  });

  test("string", () => {
    const newValue = deepSet("Hello", "Buy");
    expect(newValue).toEqual("Buy");
  });

  test("null", () => {
    const newValue = deepSet(12, null);
    expect(newValue).toEqual(null);
  });

  test("undefined", () => {
    const newValue = deepSet(12, undefined);
    expect(newValue).toEqual(undefined);
  });
});

describe("objects & arrays", () => {
  test("one-level object", () => {
    const newValue = deepSet({ a: 12, b: "str" }, { a: 15, c: "str1" });
    expect(newValue).toEqual({ a: 15, b: "str", c: "str1" });
  });

  test("two-level object", () => {
    const newValue = deepSet(
      { a: 12, embedded: { prop: "str", prop2: false } },
      { embedded: { prop: "eee" }, embedded2: { tt: "eee" } },
    );
    expect(newValue).toEqual({
      a: 12,
      embedded: { prop: "eee", prop2: false },
      embedded2: { tt: "eee" },
    });
  });

  test("object with embedded array", () => {
    const newValue = deepSet(
      {
        a: 12,
        embeddedArr: [
          { prop: "str", prop2: false },
          { prop: "rr", prop2: true },
        ],
      },
      { embeddedArr: [{ prop: "rrr" }] },
    );
    expect(newValue).toEqual({
      a: 12,
      embeddedArr: [
        { prop: "rrr", prop2: false },
        { prop: "rr", prop2: true },
      ],
    });
  });

  test("array replace object", () => {
    const newValue = deepSet(
      {
        a: 12,
        embeddedArr: "str",
      },
      { embeddedArr: [{ prop: "rrr" }] },
    );
    expect(newValue).toEqual({
      a: 12,
      embeddedArr: [{ prop: "rrr" }],
    });
  });

  test("null/undefined", () => {
    const newValue = deepSet(
      {
        a: undefined,
        b: null,
        embeddedObj: { prop1: "str", prop2: 33 },
      },
      { a: 12, b: [], embeddedObj: { prop1: null, prop2: undefined } },
    );
    expect(newValue).toEqual({
      a: 12,
      b: [],
      embeddedObj: { prop1: null, prop2: undefined },
    });
  });
});
