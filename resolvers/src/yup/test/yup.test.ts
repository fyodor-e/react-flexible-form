/* eslint-disable no-console, @typescript-eslint/ban-ts-comment */
import * as yup from "yup";
import { yupResolver } from "../yup";
import { expect, it, jest } from "@jest/globals";

export const schema = yup.object({
  username: yup.string().matches(/^\w+$/).min(3).max(30).required(),
  password: yup
    .string()
    .matches(new RegExp(".*[A-Z].*"), "One uppercase character")
    .matches(new RegExp(".*[a-z].*"), "One lowercase character")
    .matches(new RegExp(".*\\d.*"), "One number")
    .matches(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character",
    )
    .min(8, "Must be at least 8 characters in length")
    .required("New Password is required"),
  repeatPassword: yup.ref("password"),
  accessToken: yup.string(),
  birthYear: yup.number().min(1900).max(2013),
  email: yup.string().email(),
  tags: yup.array(yup.string()),
  enabled: yup.boolean(),
  like: yup.array().of(
    yup.object({
      id: yup.number().required(),
      name: yup.string().length(4).required(),
    }),
  ),
});

export const validData = {
  username: "Doe",
  password: "Password123_",
  repeatPassword: "Password123_",
  birthYear: 2000,
  email: "john@doe.com",
  tags: ["tag1", "tag2"],
  enabled: true,
  accessToken: "accessToken",
  like: [
    {
      id: 1,
      name: "name",
    },
  ],
} satisfies yup.InferType<typeof schema>;

it("mode = async, should return empty errors", async () => {
  const result = await yupResolver(schema)(validData, undefined, {});

  expect(result).toEqual({ errors: {} });
});

it("mode = sync, should return empty errors", async () => {
  const result = await yupResolver(schema, undefined, {
    mode: "sync",
  })(validData, undefined, {});

  expect(result).toEqual({ errors: {} });
});

const invalidData = {
  password: "___",
  email: "",
  birthYear: "birthYear",
  like: [{ id: "z" }],
  // Must be set to "unknown", otherwise typescript knows that it is invalid
} as unknown as Required<yup.InferType<typeof schema>>;

it("should return a single error from yupResolver when validation fails", async () => {
  const result = await yupResolver(schema)(invalidData, undefined, {});

  expect(result).toMatchSnapshot();
});

it("should return a single error from yupResolver with `mode: sync` when validation fails", async () => {
  const result = await yupResolver(schema, undefined, {
    mode: "sync",
  })(invalidData, undefined, {});

  expect(result).toMatchSnapshot();
});

it("should return all the errors from yupResolver when validation fails with `validateAllFieldCriteria` set to true", async () => {
  const result = await yupResolver(schema)(invalidData, undefined, {
    criteriaMode: "all",
  });

  expect(result).toMatchSnapshot();
});

it("should return all the errors from yupResolver when validation fails with `validateAllFieldCriteria` set to true and `mode: sync`", async () => {
  const result = await yupResolver(schema, undefined, { mode: "sync" })(
    invalidData,
    undefined,
    {
      criteriaMode: "all",
    },
  );

  expect(result).toMatchSnapshot();
});

it("should return an error from yupResolver when validation fails and pass down the yup context", async () => {
  const data = { name: "eric" };
  const context = { min: true };
  const schemaWithContext = yup.object({
    name: yup
      .string()
      .required()
      .when("$min", ([min], schema) => {
        return min ? schema.min(6) : schema;
      }),
  });

  const result = await yupResolver(schemaWithContext)(data, context, {});

  expect(result).toMatchSnapshot();
});

it("should return correct error message with using yup.test", async () => {
  const result = await yupResolver(
    yup
      .object({
        name: yup.string(),
        email: yup.string(),
      })
      .test(
        "name",
        "Email or name are required",
        (value) => !!(value && (value.name || value.email)),
      ),
  )({ name: "", email: "" }, undefined, {});

  expect(result).toMatchSnapshot();
});

it("should merge default yup resolver options with yup's options", async () => {
  const validateSpy = jest.spyOn(schema, "validate");

  await yupResolver(schema, { stripUnknown: true })(invalidData, undefined, {});

  expect(validateSpy.mock.calls[0][1]).toEqual(
    expect.objectContaining({ stripUnknown: true, abortEarly: false }),
  );
});

it("should throw an error without inner property", async () => {
  const schemaWithWhen = yup.object({
    name: yup.string().required(),
    value: yup.string().when("name", ([name], schema) => {
      return name === "test" ? yup.number().required() : schema;
    }),
  });

  const result = await yupResolver(schemaWithWhen)(
    { name: "test", value: "" },
    undefined,
    {},
  );

  expect(result).toMatchSnapshot();
});

it("should throw any error unrelated to Yup", async () => {
  const schemaWithCustomError = schema.transform(() => {
    throw Error("custom error");
  });
  const promise = yupResolver(schemaWithCustomError)(validData, undefined, {});

  await expect(promise).rejects.toThrow("custom error");
});

it("should return values from yupResolver when validation pass & raw=true", async () => {
  const schemaSpy = jest.spyOn(schema, "validate").mockReset();
  const schemaSyncSpy = jest.spyOn(schema, "validateSync");

  const result = await yupResolver(schema, undefined, { raw: true })(
    validData,
    undefined,
    {},
  );

  expect(schemaSpy).toHaveBeenCalledTimes(1);
  expect(schemaSyncSpy).not.toHaveBeenCalled();
  expect(result).toEqual({ errors: {} });
});

it("shoud validate a lazy schema with success", async () => {
  const lazySchema = yup.lazy(() =>
    yup.object().shape({ firstName: yup.string().optional() }),
  );

  const schemaSpy = jest.spyOn(lazySchema, "validate");
  const schemaSyncSpy = jest.spyOn(lazySchema, "validateSync");

  const result = await yupResolver(lazySchema, undefined)(
    { firstName: "resolver" },
    undefined,
    {
      fields: {
        firstName: {
          ref: { name: "firstName" },
          name: "firstName",
        },
      },
    },
  );

  expect(schemaSpy).toHaveBeenCalledTimes(1);
  expect(schemaSyncSpy).not.toHaveBeenCalled();
  expect(result).toEqual({ errors: {} });
});
