/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, describe } from "@jest/globals";
import { deepDirty } from "../deepDirty";

describe("Array comparison", () => {
  test("Compare two arrays of different lengths", () => {
    const res = deepDirty([1, 2], [3, 4, 5]);
    expect(res).toEqual([true, true, true]);
  });

  test("Compare two arrays of same length and different elems", () => {
    const res = deepDirty([1, 2], [1, 3]);
    expect(res).toEqual([false, true]);
  });

  test("Compare two arrays of same length and same elems", () => {
    const res = deepDirty([1, 2, 3], [1, 2, 3]);
    expect(res).toEqual([false, false, false]);
  });

  test("Compare two arrays of objects", () => {
    const res = deepDirty([{ p: 1 }, { p: 2 }], [{ p: 1 }, { p: 2 }]);
    expect(res).toEqual([{ p: false }, { p: false }]);
  });

  test("Compare two arrays of different objects", () => {
    const res = deepDirty([{ p: 1 }, { p: 33 }], [{ p: 1 }, { p: 2 }]);
    expect(res).toEqual([{ p: false }, { p: true }]);
  });

  test("Compare two arrays conttaining different types of elements", () => {
    const res = deepDirty([{ p: 1 }, 2], [{ p: 1 }, 2]);
    expect(res).toEqual([{ p: false }, false]);
  });

  test("Compare arrays and not an array", () => {
    const res = deepDirty([{ p: 1 }, 2], 2 as any);
    expect(res).toEqual([{ p: true }, true]);
  });
});

describe("Object comparison", () => {
  test("Compare two objects with different number of keys", () => {
    const res = deepDirty({ p1: 1, p2: 2, p3: 3 }, { p1: 1, p2: 2 });
    expect(res).toEqual({ p1: false, p2: false, p3: true });
  });

  test("Compare two objects with different keys", () => {
    const res = deepDirty({ p1: 1, p2: 2, p3: 3 }, { p1: 1, p2: 2, p4: 4 });
    expect(res).toEqual({ p1: false, p2: false, p3: true, p4: true });
  });

  test("Compare two objects with same keys", () => {
    const res = deepDirty({ p1: 1, p2: 2, p3: "3" }, { p1: 1, p2: 2, p3: "3" });
    expect(res).toEqual({ p1: false, p2: false, p3: false });
  });

  test("Compare object with undefined", () => {
    const res = deepDirty({ p1: 1, p2: 2, p3: "3" }, undefined);
    expect(res).toEqual({ p1: true, p2: true, p3: true });
  });
});

describe("Primitive comparison", () => {
  test("Compare two numbers", () => {
    const res = deepDirty<any>(2, 2);
    expect(res).toEqual(false);
  });

  test("Compare two strings", () => {
    const res = deepDirty<any>("str", "str");
    expect(res).toEqual(false);
  });

  test("Compare two booleans", () => {
    const res = deepDirty<any>(false, false);
    expect(res).toEqual(false);
  });

  test("Compare two undefined", () => {
    const res = deepDirty<any>(undefined, undefined);
    expect(res).toEqual(false);
  });

  test("Compare two null", () => {
    const res = deepDirty<any>(null, null);
    expect(res).toEqual(false);
  });
});

test("Compare two same nested objects", () => {
  const res = deepDirty(
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
  expect(res).toEqual({
    p1: false,
    nestedObj: { p2: false },
    nestedArr: [{ p3: false }, { p4: false }],
  });
});

test("Compare two different nested objects", () => {
  const res = deepDirty(
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
  expect(res).toEqual({
    p1: false,
    nestedObj: { p2: false },
    nestedArr: [{ p3: true }, { p4: false }],
  });
});
