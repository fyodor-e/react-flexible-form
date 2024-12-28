import { expect, test } from "@jest/globals";
import { prepareName } from "../prepareName";

test("should convert path to dotted notation", () => {
  const name = "abc[1].cde.[2].def.g.5.a";
  const preparedName = prepareName(name);
  expect(preparedName).toBe("abc.1.cde.2.def.g.5.a");
});

test("should work with leading []", () => {
  const name = "[1].cde.[2].def.g.5.a";
  const preparedName = prepareName(name);
  expect(preparedName).toBe("1.cde.2.def.g.5.a");
});

test("edge cases: empty name", () => {
  const name = "";
  const preparedName = prepareName(name);
  expect(preparedName).toBe("");
});

test("edge cases: name w/o dots", () => {
  const name = "str";
  const preparedName = prepareName(name);
  expect(preparedName).toBe("str");
});

test("incorrect name", () => {
  const name = "str[].abc";
  const preparedName = prepareName(name);
  expect(preparedName).toBe("str.abc");
});
