import { useState } from "react";
import "./index.less";

interface IProps {
  tabs: {
    label: string;
    onClick: () => void;
    id: string | number;
  }[];
  defaultId?: string | number;
  containerStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  activeItemStyle?: React.CSSProperties;
}
export default function ({
  tabs,
  defaultId,
  containerStyle = {},
  itemStyle = {},
  activeItemStyle = {},
}: IProps) {
  const [activeId, setActiveId] = useState(defaultId ?? tabs?.[0]?.id);
  return (
    <div className="custom-tab-group" style={containerStyle}>
      {tabs.map((tab) => {
        return (
          <div
            className={`tab-item ${activeId === tab.id ? "active" : ""}`}
            key={tab.id}
            onClick={() => {
              setActiveId(tab.id);
              tab.onClick();
            }}
            style={{
              ...itemStyle,
              ...(activeId === tab.id ? activeItemStyle : {}),
            }}
          >
            {tab.label}
          </div>
        );
      })}
    </div>
  );
}
