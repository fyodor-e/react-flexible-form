import { FC } from "react";
import HeaderLink from "./HeaderLink";

const Header: FC = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "16px 27px",
        gap: "5px",
      }}
    >
      <HeaderLink href="/">React Flexible Form</HeaderLink>

      <HeaderLink
        style={{ marginLeft: "auto" }}
        href="/getting-started/overview"
      >
        Docs
      </HeaderLink>

      <HeaderLink href="/examples/simpleForm">Examples</HeaderLink>

      <HeaderLink href="https://github.com/fyodor-e/react-flexible-form">
        GitHub
      </HeaderLink>
    </div>
  );
};

export default Header;
