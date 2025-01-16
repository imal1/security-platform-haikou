import classNames from "classnames";
import styles from "./index.module.less";
import React from "react";
interface TitleBarProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  isNew?: boolean
}

const TitleBar: React.FC<TitleBarProps> = ({ children, style, isNew = false }) => {
  const titleBar = isNew ? (
    <div className={classNames(styles["title-bar-new"], "title-bar-new")} style={style}>
      {children}
    </div>
  ) : (
    <div className={classNames(styles["title-bar"], "title-bar")} style={style}>
      {children}
    </div>)
  return titleBar;
};

export default TitleBar;
