import React, { memo, useState } from "react";
import { Modal } from "@arco-design/web-react";
import Draggable from "react-draggable";
import styles from "./index.module.less";
import classNames from "classnames";

interface ComponentFrameProps {
  popFrameStyle: any;
  visible: boolean;
  setVisible: (val) => void;
  className?: string;
}
const ComponentFrame = (props: ComponentFrameProps) => {
  const { visible, setVisible, popFrameStyle = {}, className } = props;
  const {
    content = [],
    popFrameName,
    styleType = "horizontal",
  } = popFrameStyle || { content: [] };

  const onCancel = () => {
    setVisible(false);
  };
  return (
    <Modal
      style={{
        cursor: "move",
        top: 20,
        right: 20,
        margin: 0,
        position: "fixed",
      }}
      title={popFrameName}
      visible={visible}
      onCancel={onCancel}
      autoFocus={false}
      focusLock={false}
      mask={false}
      afterClose={() => {}}
      footer={null}
      className={styles["component-frame-modal"]}
      unmountOnExit={true}
      modalRender={(modal) => <Draggable bounds="parent">{modal}</Draggable>}
    >
      <div
        className={classNames(
          "component-frame-wrap",
          styleType == "horizontal"
            ? "component-frame-horizontal"
            : "component-frame-vertical",
          className
        )}
      >
        {content.map((item, index) => (
          <div className="component-frame-li" key={index}>
            <div className="component-frame-li-label">{item.key||'字段名称'}</div>
            <div className="component-frame-li-value">{item.value||'字段值'}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
export default memo(ComponentFrame);
