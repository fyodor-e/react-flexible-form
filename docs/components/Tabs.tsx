"use client";
import { FC, PropsWithChildren, useState } from "react";
import { Provider } from "./tabsContext";

type Props = {
  tabs: string[];
  defaultSelected: string;
};

const Tabs: FC<PropsWithChildren<Props>> = ({
  children,
  tabs,
  defaultSelected,
}) => {
  const [selected, onSelect] = useState<string>(defaultSelected);
  return (
    <div
      style={{
        display: "flex",
        marginTop: "15px",
        marginBottom: "15px",
        flexDirection: "column",
      }}
    >
      <Provider value={selected}>
        <div style={{ display: "flex" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              style={{
                backgroundColor: "transparent",
                color: selected === tab ? "#0074D9" : undefined,
                fontWeight: 600,
                padding: "5px",
                border: "1px solid rgba(0, 116, 217, 0.1)",
                borderBottom: 0,
              }}
              onClick={() => onSelect(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {children}
      </Provider>
    </div>
  );
};

export default Tabs;
