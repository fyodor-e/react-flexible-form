import { describe, expect, it } from "@jest/globals";
import { appendErrors } from "../appendErrors";

describe("validateAllFieldCriteria = false", () => {
  it("should return empty", () => {
    const errors = {
      test: {
        type: "required",
        message: "test",
      },
    };
    expect(
      appendErrors({
        name: "test",
        validateAllFieldCriteria: false,
        errors,
        type: "min",
        message: "test",
      }),
    ).toEqual({});
  });
});

describe("validateAllFieldCriteria = true", () => {
  const errors = {
    test: {
      type: "required",
      message: "test",
      types: {},
    },
  };

  it("should return error object", () => {
    expect(
      appendErrors({
        name: "test",
        validateAllFieldCriteria: true,
        errors,
        type: "required",
        message: "test",
      }),
    ).toEqual({
      message: "test",
      type: "required",
      types: {
        required: "test",
      },
    });
  });

  it("should return correct types", () => {
    errors.test.types = { required: "test" };
    expect(
      appendErrors({
        name: "test",
        validateAllFieldCriteria: true,
        errors,
        type: "min",
        message: "test",
      }),
    ).toEqual({
      message: "test",
      type: "required",
      types: {
        ...errors.test.types,
        min: "test",
      },
    });
  });

  it("type is undefined", () => {
    errors.test.types = { required: "test", min: "test", max: "test" };
    expect(
      appendErrors({
        name: "test",
        validateAllFieldCriteria: true,
        errors,
        type: "undefined",
        message: undefined,
      }),
    ).toEqual({
      message: "test",
      type: "required",
      types: {
        ...errors.test.types,
        undefined: true,
      },
    });
  });
});
