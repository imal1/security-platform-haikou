import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Modal } from "@arco-design/web-react";
import store from "../store";
import LeftBox from "../component/left-box";
import LeftSide from "./left-side";
import RightSide from "./right-side";
import PoliceRemark from "./police-remark";
import FrameSelect from "./frame-select";
import DeviceList from "./device-list";
import classNames from "classnames";
import globalState from "@/globalState";
const tabList = [
  {
    label: "活动概况",
    value: "0",
  },
  {
    label: "安保部署",
    value: "1",
  },
  {
    label: "警情标注",
    value: "2",
  },
  {
    label: "图上框选",
    value: "3",
  },
  {
    label: "设备列表",
    value: "4",
  },
];
const SouYe = () => {
  useEffect(() => {
    return () => {
      store.location = null;
    };
  }, []);
  useEffect(() => {
    if (store.viewer) {
      const mainView = globalState.get("mainView");
      store.viewer.flyTo(mainView);
    }
  }, [store.viewer]);
  const getTabDom = () => {
    return (
      <div className="homeTab">
        {tabList.map((item) => (
          <div
            className={classNames(
              "tab-li",
              item.value === store.homeLeftSideActive && "active"
            )}
            key={item.value}
            onClick={() => {
              store.verifyFrame(() => {
                store.homeLeftSideActive = item.value;
                store.leftVisible = true;
              }, "sy");
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="souye-wrap">
      <LeftBox tab={getTabDom()}>
        <LeftSide
          style={{
            display: store.homeLeftSideActive === "0" ? "flex" : "none",
            flex: 1,
          }}
        />
        <RightSide
          style={{
            display: store.homeLeftSideActive === "1" ? "flex" : "none",
            flex: 1,
          }}
        />

        <PoliceRemark
          style={{
            display: store.homeLeftSideActive === "2" ? "flex" : "none",
            flex: 1,
          }}
        />
        <FrameSelect
          style={{
            display: store.homeLeftSideActive === "3" ? "flex" : "none",
            flex: 1,
          }}
        />
        <DeviceList
          style={{
            display: store.homeLeftSideActive === "4" ? "flex" : "none",
            flex: 1,
          }}
        />
      </LeftBox>
    </div>
  );
};
const ObserverSouYe = observer(SouYe);
export default ObserverSouYe;
