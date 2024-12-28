/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from ".";

export type DisplayLoading = (props: {
  rffName: string;
  formControl: Omit<FormControl<any>, "handleSubmit">;
}) => boolean;

export type DefaultDisplayLoading = (props: {
  rffName: string;
  formControl: Pick<FormControl<any>, "values">;
}) => boolean;
