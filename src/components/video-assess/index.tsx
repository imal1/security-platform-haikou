import React from "react";
import { Modal, Button } from "@arco-design/web-react";
import styles from "./index.module.less";
import { tryGet } from "@/kit";
import Draggable from "react-draggable";
import { DevicePalyList } from "@/components";
import classNames from "classnames";

interface VideoAssessProps {
  data: any;
  visible: boolean;
  title?: string;
  setVisible: (val) => void;
  onClose?: () => void;
}
const VideoAssess = (props: VideoAssessProps) => {
  const { data, visible, setVisible, title = "视频调阅", onClose } = props;
  const oncancel = () => {
    onClose && onClose();
    setVisible(false);
  };
  return (
    <Modal
      className={classNames(styles["device-detail-modal"],'video-assess-modal')}
      title={title}
      visible={visible}
      onCancel={oncancel}
      autoFocus={false}
      focusLock={false}
      footer={null}
      mask={false}
      style={{
        width: 608,
        zIndex: 999,
      }}
      //   getPopupContainer={() => document.querySelector(".device-detail-wrap")}
      modalRender={(modal) => <Draggable bounds="parent">{modal}</Draggable>}
    >
      <div className="device-detail-list">
        {visible && <DevicePalyList current={data} />}
      </div>
    </Modal>
  );
};
export default VideoAssess;
