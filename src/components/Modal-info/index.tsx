/**
 * 详情弹框
 */
import React, { ReactElement } from "react";
import { Modal, ModalProps, Button } from "@arco-design/web-react";
import { downLoadFile } from "@/kit";
import "./index.less";

interface ModalInfoProps extends ModalProps {
  className?: string;
  visible: boolean;
  setVisible: (val) => void;
  footerShow?: boolean;
  content: ReactElement;
  okText?: string;
  cancelText?: string;
  logTitle?: string;
}

const ModalInfo = (props: ModalInfoProps) => {
  const {
    className,
    visible,
    setVisible,
    footerShow,
    content,
    okText = "下载",
    cancelText = "取消",
    logTitle="日志详情",
    ...otherProps
  } = props;
  const downLoad = (text) => {
    downLoadFile(text, logTitle, "txt");
  };
  return (
    <Modal
      className={`kgis-modal modal-info-wrap ${className || ""}`}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      {...otherProps}
    >
      <div className="modal-info-con public-scrollbar">{content}</div>
      {footerShow && (
        <div className="modal-footer">
          <Button
            type="secondary"
            size="small"
            onClick={() => {
              setVisible(false);
            }}
          >
            {cancelText || "取消"}
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              downLoad(content);
            }}
          >
            {okText || "下载"}
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalInfo;
