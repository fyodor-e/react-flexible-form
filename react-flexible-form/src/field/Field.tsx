/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultBaseProps, KeyPaths, FieldProps } from "../types";
import Renderer from "./Renderer";
import { defaultUseConvert } from "./defaultUseConvert";

export const Field = <
  Values extends object,
  ComponentProps extends { value?: any },
  BaseProps extends { value?: any } = DefaultBaseProps,
  LoadingComponentProps extends { [K in keyof BaseProps]?: any } = BaseProps,
  Name extends KeyPaths<Values> = KeyPaths<Values>,
>({
  rffUseConvert = defaultUseConvert as any,
  rffLoadingComponent,
  rffFormControl,
  rffName,
  rffComponent: Component,
  ...restProps
}: FieldProps<
  Values,
  ComponentProps,
  BaseProps,
  LoadingComponentProps,
  Name
>) => {
  const generatedProps = rffUseConvert({
    rffName,
    formControl: rffFormControl,
  });

  if (rffFormControl.isLoading && rffLoadingComponent) {
    const L: any = rffLoadingComponent;
    return <L {...generatedProps} />;
  }

  // restProps as any is not ideal solution.
  //   - typeof generatedProps === BaseProps
  //   - typeof restProps == Omit<ComponentProps, keyof BaseProps>
  //     ComponentProps extends BaseProps
  // The problem.
  // Say BaseProps = { p: { c: string } }
  //     ComponentProps = { p: { c: string, b: number }, other: string }
  // Omit<ComponentProps, keyof BaseProps> will produce { other: string }
  // and BaseProps & Omit<ComponentProps, keyof BaseProps> will produce
  // { p: { c: string }, other: string } which is not ComponentProps
  // In most situation neted props with the same name are not passed in both
  // BaseProps and ComponentProps, so code below will work
  return (
    <Renderer
      Component={Component}
      {...generatedProps}
      {...(restProps as any)}
    />
  );
};
