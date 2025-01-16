import styles from "./index.module.less";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Trigger, Carousel, Checkbox, Switch } from "@arco-design/web-react";
import store from "../../../store/index";
import classNames from "classnames";
import { FilterModal, TitleBar } from "@/components";
import { IconClose } from "@arco-design/web-react/icon";
import IPC_3Url from "@/assets/img/home/IPC_3.png";
import IPC_1Url from "@/assets/img/home/IPC_1.png";
import BWCUrl from "@/assets/img/home/BWC.png";
// import TOLLGATEUrl from "@/assets/img/home/TOLLGATE.png";
import PTTUrl from "@/assets/img/home/PTT.png";
import PADUrl from "@/assets/img/home/PAD.png";

import checkUrl from "@/assets/img/place-manage/checked.png";

const CheckboxGroup = Checkbox.Group;
interface FeatureHelperProps {
  close?: () => void;
  onChange?: (val) => void;
  className?: string;
}
function FeatureHelper(props: FeatureHelperProps) {
  const { close, onChange, className } = props;
  const { deviceTypeKeys, deviceTypes, deviceFilterKeys, deviceStatusList } =
    store;
  const [popupVisible, setPopupVisible] = useState(false);
  const [list, setList] = useState([]);
  useEffect(() => {
    let arr = [
      {
        title: "球机",
        img: IPC_1Url,
        value: "IPC_1",
      },
      {
        title: "枪机",
        img: IPC_3Url,
        value: "IPC_3",
      },
      {
        title: "警务通",
        img: PADUrl,
        value: "PAD",
      },
      {
        title: "执法记录仪",
        img: BWCUrl,
        value: "BWC",
      },
      {
        title: "对讲机",
        img: PTTUrl,
        value: "PTT",
      },
    ];
    setList(arr);
    setChecked(arr);
  }, []);

  const [checked, setChecked] = useState([]);

  useEffect(() => {
    store.deviceLayerType = checked.map((i) => i.value).join(",");
    console.log("----");

    // const params = {
    //   deviceFilterKeys: store.deviceFilterKeys,
    //   clustered: store.deviceJuhe,
    //   deviceTypeKeys: checked.map((item) => item.value),
    // };
    // onChange && onChange(params);
  }, [checked]);

  const itemClickHandle = (item) => {
    const index = checked.findIndex((values) => {
      return item == values;
    });

    if (index === -1) {
      setChecked([...checked, item]);
      store.setCheckedList(checked);
    } else {
      // checked.splice(index, 1);
      setChecked(checked.filter((x, i) => i !== index));
      store.setCheckedList(checked);
    }
  };
  return (
    <div className={classNames(styles["wraper"], className)}>
      <div
        className={styles.del}
        onClick={() => {
          close();
        }}
      >
        <IconClose />
      </div>
      <div className={styles["header"]}>
        <CheckboxGroup
          value={store.deviceLayerStatusKeys}
          // options={deviceStatusList}
          onChange={(val) => {
            store.deviceLayerStatusKeys = val;
          }}
          className={"def-checkGroup2"}
        >
          {deviceStatusList.map((item) => (
            <Checkbox key={item.value} value={item.value}>
              <span
                className={classNames(
                  "check-item",
                  item.value === "1" && "offline",
                  item.value === "2" && "fault"
                )}
                style={{ color: item.value == "0" ? "#00ffc0" : "#bababa" }}
              >
                <span>{item.label}</span>
              </span>
            </Checkbox>
          ))}
        </CheckboxGroup>

        <div className={styles.switchWp}>
          {/* <div
            className={classNames(styles.switch, {
              [styles.checked]: store.deviceLayerIsJuhe,
            })}
            onClick={() => {
              store.deviceLayerIsJuhe = !store.deviceLayerIsJuhe;
            }}
          /> */}
          <Switch
            checked={store.deviceLayerIsJuhe}
            size="small"
            onChange={(val) => {
              store.deviceLayerIsJuhe = val;
            }}
          />
          <span style={{ fontSize: 16 }}>聚合</span>
        </div>
      </div>
      <div className={styles["children"]}>
        <TitleBar>设备类型</TitleBar>
        <div className={styles.listWraper}>
          {list.map((item, index) => (
            <div
              className={styles.listItem}
              key={index}
              onClick={() => itemClickHandle(item)}
            >
              <div className={styles.devicePic}>
                <img src={item.img} />
                {checked.includes(item) && (
                  <img className={styles.selected} src={checkUrl} alt="" />
                )}
              </div>
              <p>{item.title}</p>
            </div>

            // <div className={classNames(styles.deviceTypeItem)} key={item.id}>
            //   <div className={styles.devicePic}>
            //     <img src={item.img} />
            //   </div>
            //   <div className="device-con">
            //     <span>{item.title}</span>
            //   </div>
            // </div>
            //   <Checkbox.Group className={"device-type-wrap"}>
            //   {shebeiData.device.map((item) => {
            //     return (
            //     );
            //   })}
            // </Checkbox.Group>
          ))}
        </div>
      </div>
      <div className={styles["footer"]}></div>
    </div>
  );
}

export default observer(FeatureHelper);
