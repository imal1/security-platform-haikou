import { HTMLProps } from "react";

export default function ({ children,...params }: HTMLProps<HTMLSpanElement>) {
  return (
    <span
      className="hover-theme-color"
      {...params}
      style={{
        color: "#1292F9",
        ...params?.style
      }}
    >
      {children}
    </span>
  );
}
