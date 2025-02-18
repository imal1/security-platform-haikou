import React from "react";
import "@/assets/iconfont/index.js";
import componentJson from "@/assets/iconfont/anbao.json";
import "./index.less"

interface IconProps {
  style?: object;
  className?: string;
  type: string;
  svg?: boolean;
  onClick?: (e?: any) => void;
}
/**
 * 获取SVG样式名称
 *
 * @private
 * @memberof Icon
 */
const getSvgClassName = (className) => {
  let realClassName = "iconsvg";
  if (className) realClassName += ` ${className}`;

  return realClassName;
};

/**
 * 获取Font样式名称
 *
 * @private
 * @memberof Icon
 */
const getFontClassName = (type, className) => {
  let realClassName = componentJson.font_family;
  if (type) realClassName += ` ${type}`;
  if (className) realClassName += ` ${className}`;

  return realClassName;
};

const Icon = (props: IconProps) => {
  const { style, className, type, svg, onClick, ...other } = props;
  return (
    <span className="anticon" onClick={onClick} {...other}>
      {svg ? (
        <svg
          style={style}
          className={getSvgClassName(className)}
          aria-hidden="true"
        >
          <use xlinkHref={type ? `#${type}` : ""} />
        </svg>
      ) : (
        <i style={style} className={getFontClassName(type, className)} />
      )}
    </span>
  );
};
export default Icon;
