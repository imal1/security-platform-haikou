import { HTMLProps } from "react";

interface IProps extends HTMLProps<HTMLSpanElement> {
  roleCode: string;
  children?: React.ReactNode;
}

const getColor = (roleCode: string) => {
  switch (roleCode) {
    case "super_admin":
      return "#0AEAE8";
    case "admin":
      return "#FF7D00";
    case "developer":
      return "#64C0FF";
    default:
      return "#30D645";
  }
};

export default function ({ roleCode, children, ...params }: IProps) {
  return (
    <span
      {...params}
      style={{
        display: "inline-block",
        color: getColor(roleCode),
        backgroundColor: `${getColor(roleCode)}32`,
        padding: "7px 8px",
        borderRadius: '2px',
        ...params?.style
      }}
    >
      {children}
    </span>
  );
}
