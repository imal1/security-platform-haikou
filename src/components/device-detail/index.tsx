import React from "react";
import { Modal, Button } from "@arco-design/web-react";
import { KMediaUniContent } from "@/components";
import "./index.less";
import { tryGet } from "@/kit";
import Draggable from "react-draggable";
export const deviceTypeObj = {
  TOLLGATE: "卡口",
  BWC: "执法记录仪",
  IPC_1: "球机",
  IPC_3: "枪机",
  PTT: "对讲机",
  PAD: "警务通",
};

interface DeviceDetailProps {
  data: any;
  visible: boolean;
  title?: string;
  onlyPlay?: boolean;
  setVisible: (val) => void;
  deviceChildren?: React.ReactNode;
  onClose?: () => void;
}
const DeviceDetail = (props: DeviceDetailProps) => {
  const {
    data,
    visible,
    setVisible,
    title = "设备详情",
    onlyPlay = false,
    deviceChildren = "",
    onClose,
  } = props;
  const oncancel = () => {
    onClose && onClose();
    setVisible(false);
  };
  const getDeviceTypeName = (val) => {
    if (val === "IPC") {
      const cameraForm = tryGet(data, "deviceAttr.ipc.cameraForm");
      const deviceType = ["1", "2"].includes(cameraForm) ? "IPC_1" : "IPC_3";
      return deviceTypeObj[deviceType];
    } else {
      return deviceTypeObj[val];
    }
  };
  return (
    <div className="device-detail-wrap" style={{ zIndex: 999999 }}>
      <Modal
        className={"device-detail-modal"}
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
        getPopupContainer={() => document.querySelector(".device-detail-wrap")}
        modalRender={(modal) => <Draggable bounds="parent">{modal}</Draggable>}
      >
        <div className="device-detail-list">
          {!onlyPlay && (
            <>
              <div className="device-li">
                <div className="device-label">设备名称</div>
                <div className="device-value">{data.deviceName || "-"}</div>
              </div>
              <div className="device-li">
                <div className="device-label">国际ID</div>
                <div className="device-value">{data.gbid || "-"}</div>
              </div>
              <div className="device-li">
                <div className="device-label">设备类型</div>
                <div className="device-value">
                  {getDeviceTypeName(data.deviceType)}
                </div>
              </div>
              <div className="device-li">
                <div className="device-label">设备状态</div>
                <div className="device-value">
                  {data.status == 0 && (
                    <span style={{ color: "#00ffc0" }}>在线</span>
                  )}
                  {data.status == 1 && (
                    <span style={{ color: "#bababa" }}>离线</span>
                  )}
                  {data.status == 2 && (
                    <span style={{ color: "#ff4f2b" }}>故障</span>
                  )}
                </div>
              </div>
              <div className="device-li">
                <div className="device-label">视频调阅</div>
              </div>
            </>
          )}
          <div
            className="video-retrieval-box"
            style={{ marginTop: onlyPlay ? 0 : 20 }}
          >
            <KMediaUniContent devId={data.gbid} id="videoRetrieval" />
            {deviceChildren}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default DeviceDetail;
