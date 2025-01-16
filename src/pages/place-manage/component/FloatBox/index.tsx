import styles from "./index.module.less";
import React, { useState, forwardRef } from "react";
import classNames from "classnames";
import zs from "@/assets/img/place-manage/zs.png";
import store from "../../store/index";
import { observer } from "mobx-react";
import { Button } from "@arco-design/web-react";
import { ResizeBox } from "@arco-design/web-react";
type FloatBoxProps = {
  className?: string;
  title: string | React.ReactNode;
  children?: React.ReactNode;
  /**
   * 宽度
   * @default 320
   **/
  width: number;
  /**
   * 方向
   * @default left
   */
  direction?: "left" | "right";
  /**
   * 辅助
   * @default any
   */
  extra?: React.ReactNode;
  resize?: boolean;
};

const FloatBox: React.ForwardRefExoticComponent<FloatBoxProps> = forwardRef(
  (
    {
      className,
      title,
      children,
      width = 320,
      direction = "left",
      extra,
      resize = false,
    },
    ref
  ) => {
    // const [collapsed, setCollapsed] = useState(false);

    const { leftCollapsed, rightCollapsed } = store;
    const collapsed = direction === "left" ? leftCollapsed : rightCollapsed;
    // const handleClose = () => {
    //   setCollapsed(!collapsed);
    // };
    return (
      <div
        className={classNames(styles["float-box"], className)}
        data-direction={direction}
        data-collapsed={collapsed}
        style={{ width: collapsed ? 0 : width }}
      >
        <div
          className="box-close-icon"
          onClick={() => {
            if (direction === "left") {
              store.toggleLeftCollapsed();
              return;
            }
            store.toggleRightCollapsed();
          }}
        />
        <div className="box-header-bg"></div>
        <div className="box-children-bg"></div>
        <div className="box-footer-bg"></div>
        <div className="box-header">
          <img className="box-header-icon" src={zs} />
          <div className="box-header-title">{title}</div>
        </div>
        {resize && (
          <ResizeBox
            directions={["right"]}
            style={{
              width: 381,
              minWidth: leftCollapsed ? 0 : 381,
              maxWidth: leftCollapsed ? 0 : 1400,
              maxHeight: "100%",
              flex: 1,
            }}
            className={"float-resize-wrap"}
          >
            <div
              className="box-children"
              style={{ width: "auto", height: "100%" }}
            >
              {children}
            </div>
          </ResizeBox>
        )}
        {!resize && <div className="box-children">{children}</div>}
        {extra}
      </div>
    );
  }
);

export default observer(FloatBox);
