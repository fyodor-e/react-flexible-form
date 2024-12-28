/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, memo } from "react";

type RendererProps<ComponentProps> = {
  Component: FC<ComponentProps>;
} & ComponentProps;

const Renderer = ({ Component, ...restProps }: RendererProps<any>) => (
  <Component {...restProps} />
);

const MemoizedRenderer = memo(Renderer) as <ComponentProps>(
  props: RendererProps<ComponentProps>,
) => ReactNode;

export default MemoizedRenderer;
