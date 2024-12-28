"use client";
import { FC, PropsWithChildren, useContext } from "react";
import { selectedTabContext } from "./tabsContext";

const Tab: FC<PropsWithChildren<{ value: string }>> = ({ children, value }) => {
  const selectedTab = useContext(selectedTabContext);
  return (
    <div style={{ display: selectedTab === value ? "flex" : "none" }}>
      {children}
    </div>
  );
};

export default Tab;
