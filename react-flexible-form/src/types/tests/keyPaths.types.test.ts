/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expectType } from "../isTypeEquals";
import { KeyPaths } from "../keyPaths";

type TestObject = {
  p1: string;
  nestedObj: {
    nestedProp1: string;
    nestedArray: {
      aProp1: number;
      objNestedInArr: {
        prop1: string;
      };
    }[];
  };
  nestedArray: number[];
};

type Keys = KeyPaths<TestObject>;

const root: Keys = "";
const p1: Keys = "p1";

// @ts-expect-error key path is erroneous key path is erroneous
const p1err3: Keys = "p1.2";
// @ts-expect-error key path is erroneous
const p1err4: Keys = "p1.2.";

// @ts-expect-error key path is erroneous
const nonExisting: Keys = "nonExisting";

const nestedArray: Keys = "nestedArray";
const nestedArray1: Keys = "nestedArray.1";

// @ts-expect-error key path is erroneous
const nestedArrayErr1: Keys = "nestedArray.err";

const nestedObjProp1: Keys = "nestedObj.nestedProp1";

const nestedObjNestetArr: Keys = "nestedObj.nestedArray";
const nestedObjNestetArr0: Keys = "nestedObj.nestedArray.0";

// @ts-expect-error key path is erroneous
const nestedObjErr: Keys = "nestedObj.errProp";
// @ts-expect-error key path is erroneous
const nestedObjErr3: Keys = "nestedObj.2";

const nestedObjNestetArr2Prop1: Keys = "nestedObj.nestedArray.2.aProp1";

// @ts-expect-error key path is erroneous
const nestedObjNestetArr2Err: Keys = "nestedObj.nestedArray.2.err";

const nestedObjNestetArr2ObjNestedInArr: Keys =
  "nestedObj.nestedArray.2.objNestedInArr";

const nestedObjNestetArr2ObjNestedInArrProp1: Keys =
  "nestedObj.nestedArray.2.objNestedInArr.prop1";

// @ts-expect-error key path is erroneous
const nestedObjNestetArr2ObjNestedInArrErr: Keys =
  "nestedObj.nestedArray.2.objNestedInArr.err";

type TestArray = {
  p1: string;
  nestedObj: {
    nestedProp1: string;
  };
  nestedArray: number[];
}[];

type ArrayKeys = KeyPaths<TestArray>;

const rootArray0: ArrayKeys = "0";

const root0NestedObj: ArrayKeys = "0.nestedObj";

const root0NestedObjNestedProp1: ArrayKeys = "0.nestedObj.nestedProp1";

const root0NestedArray: ArrayKeys = "0.nestedArray";

const root0NestedArray0: ArrayKeys = "0.nestedArray.0";

// Union object

type UnionObject = {
  nestedObj:
    | string
    | {
        nestedProp1: string;
      }
    | {
        nestedProp2: string;
      }
    | string[]
    | {
        aProp1: number;
      }[];
};

type UnionObjectKeys = KeyPaths<UnionObject>;

const unionObjectKeys: UnionObjectKeys = "nestedObj";
const unionObjectKeys21: UnionObjectKeys = "nestedObj.nestedProp1";
const unionObjectKeys22: UnionObjectKeys = "nestedObj.nestedProp2";
const unionObjectKeys3: UnionObjectKeys = `nestedObj.1`;
const unionObjectKeys6: UnionObjectKeys = `nestedObj.1.aProp1`;

// @ts-expect-error key path is erroneous
const unionObjectErr2: UnionObjectKeys = "1";
// @ts-expect-error key path is erroneous
const unionObjectErr3: UnionObjectKeys = ".2";
// @ts-expect-error key path is erroneous
const unionObjectErr6: UnionObjectKeys = "nestedObj.nestedProp1.2";

expectType<KeyPaths<any>, string>("any string");

type RecursiveObject = {
  prop1: "1";
  r: RecursiveObject;
};

type RecursiveKeyPath = KeyPaths<RecursiveObject>;

expectType<
  RecursiveKeyPath,
  // This unison should include all possible paths of the RecursiveObject
  | ""
  | "prop1"
  | "r"
  | "r.prop1"
  | "r.r"
  | "r.r.prop1"
  | "r.r.r"
  | "r.r.r.prop1"
  | "r.r.r.r"
  | "r.r.r.r.prop1"
  | "r.r.r.r.r"
  | "r.r.r.r.r.prop1"
  | "r.r.r.r.r.r"
  | "r.r.r.r.r.r.prop1"
  | "r.r.r.r.r.r.r"
>("r");
