import { FormTouched } from "../formTouched";
import { expectType } from "../isTypeEquals";

type TestObject = {
  p1: "p1";
  p2: "p2" | undefined;
  nestedObj: {
    2: "2";
    nestedProp1: string;
  };
  nestedArr: {
    pArr: "123";
  }[];
};

expectType<
  FormTouched<TestObject>,
  {
    p1?: boolean;
    p2?: boolean;
    nestedObj?: {
      2?: boolean;
      nestedProp1?: boolean;
    };
    nestedArr?: {
      pArr?: boolean;
    }[];
  }
>({
  p1: true,
  p2: false,
  nestedObj: {
    2: true,
    nestedProp1: false,
  },
  nestedArr: [
    {
      pArr: undefined,
    },
  ],
});

// Array
expectType<FormTouched<TestObject["nestedArr"]>, { pArr?: boolean }[]>([]);

// Object with undefined

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
};

expectType<
  FormTouched<ObjectWithUndefined>,
  {
    nestedObject?: { prop1?: boolean };
    nestedArray?: {
      prop2?: boolean;
    }[];
    nestedArray2?: {
      prop4?: boolean;
    }[];
  }
>({
  nestedObject: {
    prop1: true,
  },
  nestedArray: [
    {
      prop2: false,
    },
    {
      prop2: undefined,
    },
  ],
  nestedArray2: [
    {
      prop4: true,
    },
    {
      prop4: undefined,
    },
  ],
});

// Other types & any
// eslint-disable-next-line @typescript-eslint/ban-types
expectType<FormTouched<{}>, {}>({});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
expectType<FormTouched<any>, any>(false);
