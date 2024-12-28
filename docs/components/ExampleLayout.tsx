import { FC, PropsWithChildren } from "react";

const ExampleLayout: FC<PropsWithChildren> = ({ children }) => (
  <div
    style={{
      display: "flex",
      padding: "15px",
      flexDirection: "column",
      border: "1px solid rgba(0, 116, 217, 0.1)",
      flex: 1,
    }}
  >
    {children}
  </div>
);

export default ExampleLayout;
