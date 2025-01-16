import waterDroplet from "@/assets/img/position.svg";
import { CSSProperties } from "react";

interface IProps {
  text?: string | number;
  size?: number;
  styles?: CSSProperties;
}
export default function ({ text, size = 28, styles }: IProps) {
  return (
    <section
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        color: "#fff",
        ...styles,
      }}
    >
      {text && (
        <div
          style={{
            zIndex: 2,
            fontSize: "14px",
            position: "relative",
            bottom: "4px",
            opacity: 1,
            color: "white!important",
            transform: "scale(1)",
            paddingRight: '1px'
          }}
        >
          {text}
        </div>
      )}
      <img
        style={{
          opacity: 0.8,
          width: "100%",
          height: "100%",
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "0",
        }}
        src={waterDroplet}
      />
    </section>
  );
}
