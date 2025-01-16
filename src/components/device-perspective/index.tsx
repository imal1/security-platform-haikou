//设备透视
import React, { useState, useEffect, memo } from "react";
import { Switch } from "@arco-design/web-react";
import classNames from "classnames";
import styles from "./index.module.less";
import appStore from "@/store";
import { observer } from "mobx-react";

interface DevicePerspectivePorps {
  className?: string;
  style?: React.CSSProperties;
  viewer?: any;
  onChange?: (val) => void;
}
const DevicePerspective = (props: DevicePerspectivePorps) => {
  const { className, style, onChange, viewer } = props;
  return (
    <div
      className={classNames(styles["device-perspective-wrap"], className)}
      style={style}
    >
      <div className="device-perspective-label">设备透视</div>
      <Switch
        checked={appStore.devicePerspectiveVisible}
        // size="small"
        checkedText="开"
        uncheckedText="关"
        onChange={(val) => {
          appStore.devicePerspectiveVisible = val;
          onChange && onChange(val);
        }}
        style={{
          transform: "scale(0.8)",
          marginLeft: -4,
        }}
      />
    </div>
  );
};
export default memo(observer(DevicePerspective));
