/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, describe } from "@jest/globals";
import { isChanged } from "../isChanged";

describe("Array comparison", () => {
  test("Compare two arrays of different lengths", () => {
    const res = isChanged([1, 2], [3, 4, 5]);
    expect(res).toEqual(true);
  });

  test("Compare two arrays of same length and different elems", () => {
    const res = isChanged([1, 2], [1, 3]);
    expect(res).toEqual(true);
  });

  test("Compare two arrays of same length and same elems", () => {
    const res = isChanged([1, 2, 3], [1, 2, 3]);
    expect(res).toEqual(false);
  });

  test("Compare two arrays of objects", () => {
    const res = isChanged([{ p: 1 }, { p: 2 }], [{ p: 1 }, { p: 2 }]);
    expect(res).toEqual(false);
  });

  test("Compare two arrays of different objects", () => {
    const res = isChanged([{ p: 1 }, { p: 33 }], [{ p: 1 }, { p: 2 }]);
    expect(res).toEqual(true);
  });

  test("Compare two arrays conttaining different types of elements", () => {
    const res = isChanged([{ p: 1 }, 2], [{ p: 1 }, 2]);
    expect(res).toEqual(false);
  });

  test("Compare arrays and not an array", () => {
    const res = isChanged([{ p: 1 }, 2], 2 as any);
    expect(res).toEqual(true);
  });
});

describe("Object comparison", () => {
  test("Compare two objects with different number of keys", () => {
    const res = isChanged({ p1: 1, p2: 2, p3: 3 }, { p1: 1, p2: 2 });
    expect(res).toEqual(true);
  });

  test("Compare two objects with different keys", () => {
    const res = isChanged({ p1: 1, p2: 2, p3: 3 }, { p1: 1, p2: 2, p4: 4 });
    expect(res).toEqual(true);
  });

  test("Compare two objects with same keys", () => {
    const res = isChanged({ p1: 1, p2: 2, p3: "3" }, { p1: 1, p2: 2, p3: "3" });
    expect(res).toEqual(false);
  });
});

describe("Primitive comparison", () => {
  test("Compare two numbers", () => {
    const res = isChanged<any>(2, 2);
    expect(res).toEqual(false);
  });

  test("Compare two strings", () => {
    const res = isChanged<any>("str", "str");
    expect(res).toEqual(false);
  });

  test("Compare two booleans", () => {
    const res = isChanged<any>(true, true);
    expect(res).toEqual(false);
  });

  test("Compare two undefined", () => {
    const res = isChanged<any>(undefined, undefined);
    expect(res).toEqual(false);
  });

  test("Compare two null", () => {
    const res = isChanged<any>(null, null);
    expect(res).toEqual(false);
  });
});

test("Compare two same nested objects", () => {
  const res = isChanged(
    {
      p1: "p1",
      nestedObj: { p2: "2" },
      nestedArr: [{ p3: "other" }, { p4: "p4" }],
    },
    {
      p1: "p1",
      nestedObj: { p2: "2" },
      nestedArr: [{ p3: "other" }, { p4: "p4" }],
    },
  );
  expect(res).toEqual(false);
});

test("Compare two different nested objects", () => {
  const res = isChanged(
    {
      p1: "p1",
      nestedObj: { p2: "2" },
      nestedArr: [{ p3: "other" }, { p4: "p4" }],
    },
    {
      p1: "p1",
      nestedObj: { p2: "2" },
      nestedArr: [{ p3: "----" }, { p4: "p4" }],
    },
  );
  expect(res).toEqual(true);
});
