import React, { memo, useEffect, useState } from "react";
import { observer } from "mobx-react";
import store from "@/pages/home/store";
import styles from "./index.module.less";
import { IconClose } from "@arco-design/web-react/icon";
import classNames from "classnames";
import { Switch, Form, Checkbox } from "@arco-design/web-react";
import IPC_3Url from "@/assets/img/home/IPC_3.png";
import IPC_1Url from "@/assets/img/home/IPC_1.png";
import BWCUrl from "@/assets/img/home/BWC.png";
// import TOLLGATEUrl from "@/assets/img/home/TOLLGATE.png";
import PTTUrl from "@/assets/img/home/PTT.png";
import PADUrl from "@/assets/img/home/PAD.png";
import MTUrl from "@/assets/img/home/MT.png";
import allUrl from "@/assets/img/home/all.png";
import checkUrl from "@/assets/img/place-manage/checked.png";
import lineUrl from "@/assets/img/home/line.png";
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const statusList = [
  { label: "在线", value: "0" },
  { label: "离线", value: "1" },
];
let deviceTypeList = [
  {
    label: "球机",
    img: IPC_1Url,
    value: "IPC_1",
  },
  {
    label: "枪机",
    img: IPC_3Url,
    value: "IPC_3",
  },
  {
    label: "会议终端",
    img: MTUrl,
    value: "MT",
  },
  {
    label: "警务通",
    img: PADUrl,
    value: "PAD",
  },
  {
    label: "执法记录仪",
    img: BWCUrl,
    value: "BWC",
  },
  {
    label: "对讲机",
    img: PTTUrl,
    value: "PTT",
  },
];
const DeviceFilter = (props) => {
  const [isAll, setIsAll] = useState(true);
  const { polymerization, filterDeviceStatusKeys, filterDeviceTypeKeys } =
    store;
  useEffect(() => {
    return () => {
      if (!store.allDeviceVisible) {
        setIsAll(true);
        const ids = deviceTypeList.map((item) => item.value);
        store.filterDeviceTypeKeys = ids;
      } else {
        setIsAll(false);
        store.filterDeviceTypeKeys = [];
      }
      store.filterDeviceStatusKeys = ["0", "1", "2"];
      store.polymerization = false;
    };
  }, []);
  useEffect(() => {
    if (deviceTypeList.length == store.filterDeviceTypeKeys.length) {
      setIsAll(true);
    } else {
      setIsAll(false);
    }
  }, [store.filterDeviceTypeKeys]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      const values = {
        filterDeviceTypeKeys,
        filterDeviceStatusKeys,
        polymerization,
      };
      props.onChange && props.onChange(values);
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [filterDeviceTypeKeys, filterDeviceStatusKeys, polymerization]);
  return (
    <div className={classNames(styles["device-filter"])}>
      <div
        className={styles["device-filter-close"]}
        onClick={() => {
          store.filterLayerVisible = false;
          store.navPanelVisible = true;
        }}
      >
        <IconClose />
      </div>
      <div
        className={classNames("device-type-all", isAll && "active")}
        onClick={() => {
          if (isAll) {
            store.filterDeviceTypeKeys = [];
          } else {
            const ids = deviceTypeList.map((item) => item.value);
            store.filterDeviceTypeKeys = ids;
          }
          setIsAll(!isAll);
        }}
      >
        <div className="device-type-pic">
          {isAll && <img src={checkUrl} alt="" className="checkbox-status" />}
          <img src={allUrl} />
        </div>
        <p>{isAll ? "取消全选" : "全选"}</p>
      </div>
      <img src={lineUrl} alt="" height={60} />
      <div className={"device-type-select"}>
        <Checkbox.Group
          value={filterDeviceTypeKeys}
          onChange={(val) => {
            store.filterDeviceTypeKeys = val;
            if (deviceTypeList.length == store.filterDeviceTypeKeys.length) {
              setIsAll(true);
            } else {
              setIsAll(false);
            }
          }}
        >
          {deviceTypeList.map((item) => {
            return (
              <Checkbox key={item.value} value={item.value}>
                {({ checked }) => {
                  return (
                    <div
                      className={`device-checkbox-card ${
                        checked ? "device-checkbox-card-checked" : ""
                      }`}
                    >
                      <div className="device-checkbox-pic">
                        <img src={item.img} />
                        {checked && (
                          <img
                            src={checkUrl}
                            alt=""
                            className="checkbox-status"
                          />
                        )}
                      </div>
                      <div className="device-checkbox-label">{item.label}</div>
                    </div>
                  );
                }}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </div>
      <img src={lineUrl} alt="" height={60} />
      <CheckboxGroup
        value={filterDeviceStatusKeys}
        onChange={(val) => {
          store.filterDeviceStatusKeys = val;
        }}
        className={"device-status-wrap"}
      >
        {statusList.map((item) => (
          <Checkbox key={item.value} value={item.value}>
            <span
              className={classNames(
                "check-item",
                item.value === "1" && "offline",
                item.value === "2" && "fault"
              )}
            >
              <span>{item.label}</span>
            </span>
          </Checkbox>
        ))}
      </CheckboxGroup>
      <div className={styles.switchWp}>
        <Switch
          checked={polymerization}
          size="small"
          onChange={(val) => {
            store.polymerization = val;
            store.isCreateLayer = true;
          }}
        />
        <span style={{ fontSize: 16 }}>聚合</span>
      </div>
    </div>
  );
};
export default memo(observer(DeviceFilter));
