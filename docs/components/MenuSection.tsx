import { FC, HTMLAttributes } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
} & HTMLAttributes<HTMLSpanElement>;

const MenuSection: FC<Props> = ({ children, style, ...rest }) => (
  <span
    style={{
      fontSize: "18px",
      color: "#3C3C43",
      margin: "20px 0",
      fontWeight: "700",
      ...(style ?? {}),
    }}
    {...rest}
  >
    {children}
  </span>
);

export default MenuSection;
