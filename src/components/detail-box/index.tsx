/**
 * 详情弹框
 */
import React from "react";
import "./index.less";
import { IconClose } from "@arco-design/web-react/icon";

interface DetailBoxProps {
  visible: boolean;
  className?: string;
  setVisible: (res) => void;
  closeIcon?: React.ReactElement; //替换关闭按钮
  children?: React.ReactNode | string;
  onClose?: () => void;
}

function DetailBox(props: DetailBoxProps) {
  const { visible, setVisible, children, closeIcon, onClose, className } =
    props;
  return (
    <div
      className={`detail-box-warp ${className ? className : ""} ${
        !visible ? "hide" : ""
      }`}
    >
      <div className="detail-box-con">
        <div
          className="detail-box-close"
          onClick={() => {
            onClose && onClose();
            setVisible(false);
          }}
        >
          {closeIcon ? (
            closeIcon
          ) : (
            <div className="detail-box-close-box">
              <IconClose />
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export default DetailBox;
