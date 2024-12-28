import { FieldError } from "../resolver";
import { toNestErrors } from "../toNestErrors";
import { expect, test } from "@jest/globals";

test("transforms flat object to nested object", () => {
  const flatObject: Record<string, FieldError> = {
    name: { type: "min", message: "message 1" },
    "test.0.name": { type: "max", message: "message 2" },
  };

  expect(toNestErrors(flatObject)).toEqual({
    name: {
      message: "message 1",
      type: "min",
    },
    test: [
      {
        name: {
          message: "message 2",
          type: "max",
        },
      },
    ],
  });
});

test("transforms flat object to nested object with root error for field array", () => {
  const result = toNestErrors({
    username: { type: "username", message: "username is required" },
    "fieldArrayWithRootError.0.name": {
      type: "first",
      message: "message 1",
    },
    "fieldArrayWithRootError.0.nestFieldArrayWithoutRootError.0.title": {
      type: "title",
      message: "title",
    },
    "fieldArrayWithRootError.0.nestFieldArrayWithRootError": {
      type: "nested-root-title",
      message: "nested root errors",
    },
    "fieldArrayWithRootError.0.nestFieldArrayWithRootError.0.title": {
      type: "nestFieldArrayWithRootError-title",
      message: "nestFieldArrayWithRootError-title",
    },
    "fieldArrayWithRootError.1.name": {
      type: "second",
      message: "second message",
    },
    fieldArrayWithRootError: { type: "root-error", message: "root message" },
    "fieldArrayWithoutRootError.0.name": {
      type: "first",
      message: "first message",
    },
    "fieldArrayWithoutRootError.1.name": {
      type: "second",
      message: "second message",
    },
  });

  expect(result).toEqual({
    username: {
      type: "username",
      message: "username is required",
    },
    fieldArrayWithRootError: {
      "0": {
        name: {
          type: "first",
          message: "message 1",
        },
        nestFieldArrayWithoutRootError: [
          {
            title: {
              type: "title",
              message: "title",
            },
          },
        ],
        nestFieldArrayWithRootError: {
          "0": {
            title: {
              type: "nestFieldArrayWithRootError-title",
              message: "nestFieldArrayWithRootError-title",
            },
          },
          root: {
            type: "nested-root-title",
            message: "nested root errors",
          },
        },
      },
      "1": {
        name: {
          type: "second",
          message: "second message",
        },
      },
      root: {
        type: "root-error",
        message: "root message",
      },
    },
    fieldArrayWithoutRootError: [
      {
        name: {
          type: "first",
          message: "first message",
        },
      },
      {
        name: {
          type: "second",
          message: "second message",
        },
      },
    ],
  });
});

test("ensures consistent ordering when a field array has a root error and an error in the non-first element", () => {
  const result = toNestErrors({
    "fieldArrayWithRootError.1.name": {
      type: "second",
      message: "second message",
    },
    fieldArrayWithRootError: { type: "root-error", message: "root message" },
  });

  expect(result).toEqual({
    fieldArrayWithRootError: {
      "1": {
        name: {
          type: "second",
          message: "second message",
        },
      },
      root: {
        type: "root-error",
        message: "root message",
      },
    },
  });
});
