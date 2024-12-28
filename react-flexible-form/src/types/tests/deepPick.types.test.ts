/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepPick } from "../deepPick";
import { expectType } from "../isTypeEquals";

// 1. Object
type TestObject = {
  p1: "p1";
  p2: "p2" | undefined;
  nestedObj: {
    2: "2";
    nestedProp1: string;
    nestedArray: {
      aProp1: number;
      objNestedInArr: {
        prop1: string;
      };
    }[];
  };
  nestedArray: { prop4: "prop4" }[];
};

expectType<DeepPick<TestObject, "p1">, TestObject["p1"]>("p1");

expectType<DeepPick<TestObject, "p2">, TestObject["p2"]>(undefined);
expectType<DeepPick<TestObject, "p2">, TestObject["p2"]>("p2");

expectType<DeepPick<TestObject, "nestedObj">, TestObject["nestedObj"]>({
  nestedProp1: "",
  2: "2",
  nestedArray: [{ aProp1: 0, objNestedInArr: { prop1: "" } }],
});

expectType<DeepPick<TestObject, "nestedObj.2">, "2">("2");

// @ts-expect-error erroneous value
expectType<DeepPick<TestObject, "nestedObj.1">, "2">("2");

expectType<DeepPick<TestObject, "nestedObj.nestedProp1">, string>("");

expectType<DeepPick<TestObject, "nestedArray">, TestObject["nestedArray"]>([
  { prop4: "prop4" },
  { prop4: "prop4" },
]);

expectType<
  DeepPick<TestObject, "nestedArray.2">,
  TestObject["nestedArray"][number]
>({ prop4: "prop4" });

expectType<
  DeepPick<TestObject, "nestedArray.2.prop4">,
  TestObject["nestedArray"][number]["prop4"]
>("prop4");

// @ts-expect-error erroneous prop
expectType<DeepPick<TestObject, "nestedArray.2.err">, string>("err");

expectType<
  DeepPick<TestObject, "nestedObj.nestedArray">,
  TestObject["nestedObj"]["nestedArray"]
>([{ aProp1: 0, objNestedInArr: { prop1: "" } }]);

expectType<
  DeepPick<TestObject, "nestedObj.nestedArray.1">,
  TestObject["nestedObj"]["nestedArray"][0]
>({ aProp1: 0, objNestedInArr: { prop1: "" } });

// nested array element prop
expectType<
  DeepPick<TestObject, "nestedObj.nestedArray.0.aProp1">,
  TestObject["nestedObj"]["nestedArray"][number]["aProp1"]
>(0);

// 1.1 Name = '' - root object
expectType<DeepPick<TestObject, "">, TestObject>({
  p1: "p1",
  p2: "p2",
  nestedObj: {
    2: "2",
    nestedProp1: "aaa",
    nestedArray: [],
  },
  nestedArray: [],
});

// 2. Array
type RootArray = {
  prop1: "prop1";
  nestedObject: {
    prop2: 1;
  };
  nestedArray: {
    prop3: true;
  }[];
}[];

expectType<DeepPick<RootArray, "2">, RootArray[0]>({
  prop1: "prop1",
  nestedObject: {
    prop2: 1,
  },
  nestedArray: [
    {
      prop3: true,
    },
  ],
});

// @ts-expect-error erroneous name
expectType<DeepPick<RootArray, ".2">, RootArray[0]>({
  prop1: "prop1",
  nestedObject: {
    prop2: 1,
  },
  nestedArray: [
    {
      prop3: true,
    },
  ],
});

expectType<DeepPick<RootArray, "1.prop1">, RootArray[number]["prop1"]>("prop1");

expectType<DeepPick<RootArray, ".2.prop1">, RootArray[number]["prop1"]>(
  // @ts-expect-error erroneous prop
  "prop1",
);
// @ts-expect-error erroneous prop
expectType<DeepPick<RootArray, "[0].err">, string>("err");

expectType<
  DeepPick<RootArray, "0.nestedArray.2.prop3">,
  RootArray[number]["nestedArray"][number]["prop3"]
>(true);

// 3. Object with undefined
type ObjectWithUndefined = {
  nestedObject:
    | undefined
    | {
        prop1: "prop1";
      };
  nestedArray:
    | undefined
    | {
        prop2: "prop2";
      }[];
  nestedArray2: (
    | undefined
    | {
        prop4: "prop4";
      }
  )[];
  nullObjects: null | {
    prop3: "prop3";
  };
  nullUndefinedObject:
    | null
    | undefined
    | {
        prop4: "prop4";
      };
  deeplyNestedNull: null | {
    nestedObject: {
      prop5: "prop5";
    };
  };
};

expectType<
  DeepPick<ObjectWithUndefined, "nestedObject">,
  ObjectWithUndefined["nestedObject"]
>({ prop1: "prop1" });
expectType<
  DeepPick<ObjectWithUndefined, "nestedObject">,
  ObjectWithUndefined["nestedObject"]
>(undefined);

expectType<
  DeepPick<ObjectWithUndefined, "nestedObject.prop1">,
  "prop1" | undefined
>("prop1");
expectType<
  DeepPick<ObjectWithUndefined, "nestedObject.prop1">,
  "prop1" | undefined
>(undefined);

expectType<
  DeepPick<ObjectWithUndefined, "nestedArray.0.prop2">,
  "prop2" | undefined
>(undefined);

expectType<DeepPick<ObjectWithUndefined, "nullObjects.prop3">, "prop3" | null>(
  "prop3",
);

expectType<
  DeepPick<ObjectWithUndefined, "nullUndefinedObject.prop4">,
  "prop4" | null | undefined
>("prop4");

expectType<
  DeepPick<ObjectWithUndefined, "deeplyNestedNull.nestedObject.prop5">,
  "prop5" | null
>("prop5");

expectType<
  DeepPick<ObjectWithUndefined, "nestedObject.prop1">,
  NonNullable<ObjectWithUndefined["nestedObject"]>["prop1"]
  // @ts-expect-error error
>(null);

// 4. Object with unions
type ObjectWithUnions = {
  nestedObject:
    | string
    | {
        prop1: "prop1";
      }
    | { arrayProp2: "arrayProp2" }[];
};

expectType<
  DeepPick<ObjectWithUnions, "nestedObject">,
  ObjectWithUnions["nestedObject"]
>({ prop1: "prop1" });
expectType<
  DeepPick<ObjectWithUnions, "nestedObject">,
  ObjectWithUnions["nestedObject"]
>("");

expectType<
  DeepPick<ObjectWithUnions, "nestedObject.prop1">,
  "prop1" | undefined
>("prop1");

expectType<
  DeepPick<ObjectWithUnions, "nestedObject.errorProp1">,
  "errorProp1" | undefined
  // @ts-expect-error error prop name
>("errorProp1");

expectType<
  DeepPick<ObjectWithUnions, "nestedObject.2">,
  { arrayProp2: "arrayProp2" } | undefined
>({ arrayProp2: "arrayProp2" });

expectType<
  DeepPick<ObjectWithUnions, "nestedObject.2.arrayProp2">,
  "arrayProp2" | undefined
>("arrayProp2");

expectType<
  DeepPick<ObjectWithUnions, "nestedObject.2.errorArrayProp2">,
  "errorArrayProp2" | undefined
  // @ts-expect-error error prop name
>("errorArrayProp2");

// 5. Array with unions
type ArrayWithUnions = {
  nestedObject:
    | string[]
    | {
        prop1: "prop1";
      }[];
};

expectType<
  DeepPick<ArrayWithUnions, "nestedObject">,
  ArrayWithUnions["nestedObject"]
>([{ prop1: "prop1" }]);

expectType<
  DeepPick<ArrayWithUnions, "nestedObject.1">,
  ArrayWithUnions["nestedObject"]["1"] | undefined
  // @ts-expect-error erroneous prop
>({ prop1: "prop1" });

// 6. Object with any
type ObjectWithAny = {
  nestedObject: {
    prop1: any;
  };
};

expectType<
  DeepPick<ObjectWithAny, "nestedObject">,
  ObjectWithAny["nestedObject"]
>({ prop1: "any" });

expectType<
  DeepPick<ObjectWithAny, "nestedObject.prop1">,
  ObjectWithAny["nestedObject"]["prop1"]
>("any");

expectType<DeepPick<ObjectWithAny, "nestedObject.prop1.nonExitingProp">, any>(
  "any",
);

expectType<DeepPick<ObjectWithAny, any>, any>("any");

type RecursiveObject = {
  prop1: "12";
  r: RecursiveObject;
};

expectType<DeepPick<RecursiveObject, "r.r.r.r.r.r.r">, RecursiveObject>({
  prop1: "12",
  r: { prop1: "12", r: "any" as any },
});

expectType<DeepPick<RecursiveObject, "r.r.r.r.r.r.r.r">, RecursiveObject>(
  // @ts-expect-error recursion too deep
  unknown,
);
