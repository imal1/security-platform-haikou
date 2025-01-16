import styles from "./DeviceFilter.module.less";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import {
  Input,
  Tree,
  Radio,
  Space,
  TreeProps,
  Checkbox,
  Tooltip,
  Popover,
  Button,
} from "@arco-design/web-react";
import store from "../../store";
import filterUrl from "@/assets/img/filter.png";
import filterHoverUrl from "@/assets/img/filter-hover.png";
import TitleBar from "../title-bar";
import PicBlock from "@/assets/img/place-manage/fangan-box/top-block.png";

interface DeviceFilterProps {
  onFilter?: (params: any) => void;
  right?: string;
}

const DeviceFilter = (props: DeviceFilterProps) => {
  const { onFilter, right } = props;

  const [deviceTypes, setDeviceTypes] = useState([
    "IPC_3",
    "IPC_1",
    "BWC",
    "TOLLGATE",
  ]);
  const [deviceStatus, setDeviceStatus] = useState(["0", "1", "2"]);
  const [popupVisible, setPopupVisible] = useState(false);
  useEffect(() => {
    store.getDeviceTypes();
  }, []);
  
  useEffect(() => {
    setDeviceTypes(store.deviceTypeKeys)
  }, [store.deviceTypeKeys]);
  const handleTypeChange = (values) => {
    setDeviceTypes(values);
    onFilter?.({
      types: values,
      status: deviceStatus,
    });
  };

  const handleStatusChange = (values) => {
    setDeviceStatus(values);
    onFilter?.({
      types: deviceTypes,
      status: values,
    });
  };
  const wzqstyles = {
    styleOne: {
      right: right + "px",
      left: "auto",
    },
  };

  return (
    <div className={styles["device-filter"]}>
      <Popover
        style={right ? wzqstyles.styleOne : null}
        className={styles["device-filter-popover"]}
        popupVisible={popupVisible}
        content={
          <div className={styles["device-filter-content"]}>
            <div className="header">
              <img className="block" src={PicBlock} />
              <div className="title">{"设备筛选"}</div>
              <div className="close" onClick={() => setPopupVisible(false)} />
            </div>
            <div className="children">
              <TitleBar content="设备类型" />
              <Checkbox.Group
                options={store.deviceTypes}
                value={deviceTypes}
                onChange={handleTypeChange}
              />
              <TitleBar content="设备状态" />
              <Checkbox.Group
                options={[
                  { label: "在线", value: "0" },
                  { label: "离线", value: "1" },
                  { label: "故障", value: "2" },
                ]}
                value={deviceStatus}
                onChange={handleStatusChange}
              />
            </div>
            <div className="footer" />
          </div>
        }
        trigger={"click"}
        position="bl"
      >
        <div
          className="device-filter-img"
          onClick={() => setPopupVisible(true)}
        >
          <img src={filterUrl} className="pic" />
          <img src={filterHoverUrl} className="pic-hover" />
        </div>
      </Popover>
    </div>
  );
};

export default observer(DeviceFilter);
