"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "react-flexible-form-resolvers";
import {
  OnSubmit,
  useForm,
  Field,
  setIn,
  getIn,
  SetField,
  getInErrors,
} from "react-flexible-form";
import { useCallback } from "react";
import * as Yup from "yup";
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

// store.ts file
type Values = {
  orderNo: string;
  orderedItem: string;
  quantity: number | undefined;
  price: number | undefined;
  total: number | undefined;
};

const initialState: Values = {
  orderNo: "",
  orderedItem: "",
  quantity: undefined,
  price: undefined,
  total: undefined,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFieldValueAction: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: any; value: any }>,
    ) => {
      return setIn({ values: state, name, value });
    },
    calcTotal: (state) => {
      state.total =
        state.price && state.quantity && state.price * state.quantity;
    },
  },
});

const { setFieldValueAction, calcTotal } = ordersSlice.actions;

const store = configureStore({
  reducer: {
    ordersReducer: ordersSlice.reducer,
  },
});

const setFieldValue: SetField<Values> = (name, valueOrFunction) => {
  let value = valueOrFunction;
  if (typeof valueOrFunction === "function") {
    const prev = getIn({ name, values: store.getState().ordersReducer });
    value = valueOrFunction(prev);
  }
  store.dispatch(setFieldValueAction({ name, value }));
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// index.tsx file
const FormStateInReduxRoot = () => (
  <Provider store={store}>
    <FormStateInRedux />
  </Provider>
);

// form.tsx file
const resolver: any = yupResolver(
  Yup.object({
    orderNo: Yup.string().required("Required"),
    orderedItem: Yup.string().required("Required"),
    quantity: Yup.number().required("Required"),
    price: Yup.number().required("Required"),
  }),
);

const valuesSelector = (state: RootState) => state.ordersReducer;

const FormStateInRedux = () => {
  const onSubmit = useCallback<OnSubmit<Values>>(
    ({ formControl: { values } }) => {
      alert(`Form values: \n ${JSON.stringify(values)}`);
    },
    [],
  );

  const values = useSelector(valuesSelector);
  const dispatch = useDispatch<AppDispatch>();

  const handleCalcTotol = useCallback(() => {
    dispatch(calcTotal());
  }, [dispatch]);

  const formControl = useForm<Values>({
    values,
    setFieldValue,
    onSubmit,
    resolver,
  });

  return (
    <div
      style={{
        gap: "7px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label>Order #</label>
      <Field
        rffFormControl={formControl}
        rffName="orderNo"
        rffComponent="input"
      />
      <div style={{ color: "red", whiteSpace: "pre" }}>
        {getInErrors({ errors: formControl.errors, name: "orderNo" }).join(
          ", ",
        ) || " "}
      </div>
      <label>Ordered Item</label>
      <Field
        rffFormControl={formControl}
        rffName="orderedItem"
        rffComponent="input"
      />
      <div style={{ color: "red", whiteSpace: "pre" }}>
        {getInErrors({ errors: formControl.errors, name: "orderedItem" }).join(
          ", ",
        ) || " "}
      </div>
      <label>Quantity</label>
      <Field
        rffFormControl={formControl}
        rffName="quantity"
        rffComponent="input"
      />
      <div style={{ color: "red", whiteSpace: "pre" }}>
        {getInErrors({ errors: formControl.errors, name: "quantity" }).join(
          ", ",
        ) || " "}
      </div>
      <label>Price</label>
      <Field
        rffFormControl={formControl}
        rffName="price"
        rffComponent="input"
      />
      <div style={{ color: "red", whiteSpace: "pre" }}>
        {getInErrors({ errors: formControl.errors, name: "price" }).join(
          ", ",
        ) || " "}
      </div>
      <button onClick={formControl.handleSubmit}>Submit</button>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        Total:
        <span>{values.total}</span>
        <button onClick={handleCalcTotol}>Calculate Total</button>
      </div>
    </div>
  );
};

export default FormStateInReduxRoot;
