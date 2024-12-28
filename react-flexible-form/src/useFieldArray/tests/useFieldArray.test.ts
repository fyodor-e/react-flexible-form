/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "../../types";
import { beforeEach, expect, test, jest, describe } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useFieldArray } from "..";

type Values = {
  nestedArray: string[];
};

const formControl: FormControl<Values> = {
  values: { nestedArray: [] },
  touched: {},
  errors: {},
  dirty: {},

  setFieldValue: jest.fn(),
  setFieldTouched: () => {},
  setFieldError: () => {},
  setFieldDirty: () => {},
  submitCount: 0,
  isSubmitting: false,
  setIsSubmitting: () => {},
  isLoading: false,
  setIsLoading: () => {},
  handleSubmit: () => Promise.resolve(),

  isValid: true,
};

const name = "nestedArray";

beforeEach(() => {
  (formControl.setFieldValue as any).mockReset();
});

test("append test", () => {
  const testArray: string[] = ["one", "two", "three"];
  const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
    useFieldArray,
    { initialProps: { formControl, name } },
  );

  result.current.append("four");
  expect(formControl.setFieldValue).toBeCalledTimes(1);
  expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
  const setter = (formControl.setFieldValue as any).mock.calls[0][1];
  expect(setter(testArray)).toEqual(["one", "two", "three", "four"]);
});

test("prepend test", () => {
  const testArray: string[] = ["one", "two", "three"];

  const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
    useFieldArray,
    { initialProps: { formControl, name } },
  );

  result.current.prepend("zero");
  expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
  const setter = (formControl.setFieldValue as any).mock.calls[0][1];
  expect(setter(testArray)).toEqual(["zero", "one", "two", "three"]);
});

describe("insert test", () => {
  test("insert at index 0", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.insert(0, "zero");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["zero", "one", "two", "three"]);
  });

  test("insert at index 2", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.insert(2, "new two");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["one", "two", "new two", "three"]);
  });

  test("insert after at array", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.insert(testArray.length, "four");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["one", "two", "three", "four"]);
  });

  test("insert after array end", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.insert(5, "five");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual([
      "one",
      "two",
      "three",
      undefined,
      undefined,
      "five",
    ]);
  });

  test("insert at negative index", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.insert(-1, "error");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });
});

describe("swap test", () => {
  test("swap at indexes 0, 1", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.swap(0, 1);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["two", "one", "three"]);
  });

  test("swap at indexes 0, 2", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.swap(0, 2);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["three", "two", "one"]);
  });

  test("swap at the middle of long array", () => {
    const testArray: string[] = ["0", "1", "2", "3", "4", "5", "6"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.swap(2, 5);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["0", "1", "5", "3", "4", "2", "6"]);
  });

  test("from is negative", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.swap(-1, 2);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });

  test("to is negative", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.swap(1, -2);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });

  test("from is more than array length", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.swap(3, 1);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });

  test("to is more than array length", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.swap(1, 3);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });
});

describe("move test", () => {
  test("nove at indexes 0, 1", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(0, 1);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["two", "one", "three"]);
  });

  test("move at indexes 0, 2", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(0, 2);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["two", "three", "one"]);
  });

  test("move at the middle of long array", () => {
    const testArray: string[] = ["0", "1", "2", "3", "4", "5", "6"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(2, 5);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["0", "1", "3", "4", "5", "2", "6"]);
  });

  test("move at the middle of long array, to < from", () => {
    const testArray: string[] = ["0", "1", "2", "3", "4", "5", "6"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(5, 2);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["0", "1", "5", "2", "3", "4", "6"]);
  });

  test("from is negative", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(-1, 2);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });

  test("to is negative", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(1, -2);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });

  test("from is more than array length", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(3, 1);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });

  test("to is more than array length", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.move(1, 3);
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });
});

describe("update test", () => {
  test("uppate at index 0", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.update(0, "zero");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["zero", "two", "three"]);
  });

  test("update at index 2", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.update(2, "new two");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(["one", "two", "new two"]);
  });

  test("update at negative index", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.update(-1, "error");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });

  test("update at index >= arr length", () => {
    const testArray: string[] = ["one", "two", "three"];

    const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
      useFieldArray,
      { initialProps: { formControl, name } },
    );

    result.current.update(testArray.length, "error");
    expect(formControl.setFieldValue).toBeCalledTimes(1);
    expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
    const setter = (formControl.setFieldValue as any).mock.calls[0][1];
    expect(setter(testArray)).toEqual(testArray);
  });
});

test("replace test", () => {
  const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
    useFieldArray,
    { initialProps: { formControl, name } },
  );

  result.current.replace(["1", "2", "3"]);
  expect(formControl.setFieldValue).toBeCalledTimes(1);
  expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
  expect((formControl.setFieldValue as any).mock.calls[0][1]).toEqual([
    "1",
    "2",
    "3",
  ]);
});

test("remove test", () => {
  const testArray: string[] = ["0", "1", "2", "3", "4", "5"];

  const { result } = renderHook<ReturnType<typeof useFieldArray>, any>(
    useFieldArray,
    { initialProps: { formControl, name } },
  );

  result.current.remove(0, 1, 3, 5, 10);
  expect(formControl.setFieldValue).toBeCalledTimes(1);
  expect((formControl.setFieldValue as any).mock.calls[0][0]).toEqual(name);
  const setter = (formControl.setFieldValue as any).mock.calls[0][1];
  expect(setter(testArray)).toEqual(["2", "4"]);
});
