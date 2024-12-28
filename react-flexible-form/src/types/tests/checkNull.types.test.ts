import { CheckNull, CheckUndefined, SetNullUndefined } from "../deepPick";
import { expectType } from "../isTypeEquals";

expectType<CheckNull<{ p: string } | null, false>, true>(true);
expectType<CheckNull<{ p: string }, false>, false>(false);
expectType<CheckNull<{ p: string } | undefined, false>, false>(false);
expectType<CheckNull<{ p: string } | undefined | null, false>, true>(true);
expectType<CheckNull<null, false>, true>(true);
expectType<CheckNull<undefined | null, false>, true>(true);
expectType<CheckNull<{ p: string }, true>, true>(true);

// CheckUndefined w/o IsArray & IsObject
expectType<CheckUndefined<{ p: string } | undefined, false>, true>(true);
expectType<CheckUndefined<{ p: string }, false>, false>(false);
expectType<CheckUndefined<{ p: string } | null, false>, false>(false);
expectType<CheckUndefined<{ p: string } | undefined | null, false>, true>(true);
expectType<CheckUndefined<undefined, false>, true>(true);
expectType<CheckUndefined<undefined | null, false>, true>(true);
expectType<CheckUndefined<{ p: string }, true>, true>(true);

// CheckUndefined with BaseType = Array<any>
expectType<CheckUndefined<{ p: string } | undefined, false>, true>(true);
expectType<CheckUndefined<{ p: string } | string[], false>, true>(true);
expectType<CheckUndefined<{ p: string }[] | null, false>, false>(false);
expectType<CheckUndefined<{ p: string }[] | undefined | null, false>, true>(
  true,
);
expectType<CheckUndefined<{ p: string }[] | string, false>, true>(true);

// CheckUndefined with BaseType = object
expectType<CheckUndefined<{ p: string } | undefined, false>, true>(true);
expectType<CheckUndefined<{ p: string } | string[], false>, true>(true);
expectType<CheckUndefined<{ p: string } | null, false>, false>(false);
expectType<CheckUndefined<{ p: string } | undefined | null, false>, true>(true);
expectType<CheckUndefined<{ p: string } | string, false>, true>(true);

expectType<SetNullUndefined<{ p: "p" }, false, false>, { p: "p" }>({ p: "p" });
expectType<SetNullUndefined<{ p: "p" }, true, false>, { p: "p" } | null>({
  p: "p",
});
expectType<SetNullUndefined<{ p: "p" }, false, true>, { p: "p" } | undefined>({
  p: "p",
});
expectType<
  SetNullUndefined<{ p: "p" }, true, true>,
  { p: "p" } | undefined | null
>({ p: "p" });
