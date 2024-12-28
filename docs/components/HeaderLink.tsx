import Link, { LinkProps } from "next/link";
import { FC, PropsWithChildren } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
} & LinkProps;

const HeaderLink: FC<PropsWithChildren<Props>> = ({
  children,
  style,
  ...rest
}) => (
  <Link
    style={{
      textDecorationLine: "none",
      fontSize: "18px",
      color: "rgb(0, 116, 217)",
      ...(style ?? {}),
    }}
    className="menuLink"
    {...rest}
  >
    {children}
  </Link>
);

export default HeaderLink;
