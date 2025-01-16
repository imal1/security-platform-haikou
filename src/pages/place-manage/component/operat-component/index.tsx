import React, { useEffect, useState } from "react";
import store from "../../store/attributes-store";
import storeFloat from "../../store/index";
import FeatureHelper from "../ele-store/feature-helper/index";
import { SceneLinkageMap } from "../../../../components/index";
// import DeviceFilter from "../ele-store/device-filter/index";
import { observer } from "mobx-react";
import { Menu, Button, Trigger, Switch } from "@arco-design/web-react";
import { IconDown, IconClose } from "@arco-design/web-react/icon";
import settingIcon from "@/assets/img/setting-icon.svg";
import styles from "./index.module.less";
import classNames from "classnames";
import appStore from "@/store";
import DeviceFilter from "./device-filter";

const OperatComponent = () => {
  const [active, setActive] = useState("");
  const [visiable, setVisiable] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visibleMap, setVisibleMap] = useState(false);
  const [visibleHelper, setVisibleHelper] = useState(false);
  useEffect(() => {
    if (!storeFloat.rightCollapsed) {
      setVisiable(false);
      setVisibleMap(false);
      setVisibleHelper(false);
    }
  }, [storeFloat.rightCollapsed]);
  useEffect(() => {}, [
    store.deviceNameVisible,
    store.filterLayerVisible,
    store.filterLayerVisible,
  ]);
  useEffect(() => {
    store.setDevicePerspective(appStore.devicePerspectiveVisible);
  }, [appStore.devicePerspectiveVisible]);
  useEffect(() => {
    return () => {
      store.changeState({
        filterLayerVisible: false,
        deviceNameVisible: false,
        filterDeviceTypeKeys: ["IPC_1", "IPC_3", "BWC", "PTT", "PAD", "MT"],
        filterDeviceStatusKeys: ["0", "1", "2"],
        polymerization: false,
        isCreateLayer: false,
      });
      setVisiable(false);
      setVisibleMap(false);
      setVisibleHelper(false);
    };
  }, []);
  const toolBottomDom = () => {
    return (
      <div className={styles["toolbox-trigger-popup"]}>
        <div className="trigger-header">
          <div className="trigger-title">页面设置</div>
          <div
            className="trigger-close-icon"
            onClick={() => {
              setVisible2(false);
            }}
          >
            <IconClose />
          </div>
        </div>
        <div className="trigger-con public-scrollbar">
          {/* <div className="toolbox-li">
            <label>设备透视</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={appStore.devicePerspectiveVisible}
                onChange={(val) => {
                  appStore.devicePerspectiveVisible = val;
                  store.setDevicePerspective(val);
                  // storeFloat.setDevicePerspective(val);
                }}
              />
              <span style={{ marginLeft: 10 }}>
                {appStore.devicePerspectiveVisible ? "开" : "关"}
              </span>
            </div>
          </div> */}
          <div className="toolbox-li">
            <label>设备名称</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={store.deviceNameVisible}
                onChange={(val) => {
                  store.deviceNameVisible = val;
                  store.isCreateLayer = true;
                }}
              />
              <span style={{ marginLeft: 10 }}>
                {store.deviceNameVisible ? "开" : "关"}
              </span>
            </div>
          </div>
          {store.modalVisible && (
            <div className="toolbox-li">
              <label>设备筛选</label>
              <div className="toolbox-li-right">
                <Switch
                  size="small"
                  checked={store.filterLayerVisible}
                  onChange={(val) => {
                    store.filterLayerVisible = val;
                    val && setVisible2(false);
                    if (val) {
                      storeFloat.rightCollapsed = true;
                    }
                  }}
                />
                <span style={{ marginLeft: 10 }}>
                  {store.filterLayerVisible ? "开" : "关"}
                </span>
              </div>
            </div>
          )}

          <div className="toolbox-li">
            <label>交互引导</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={visibleHelper}
                onChange={(val) => {
                  setVisibleHelper(val);
                  val && setVisible2(false);
                }}
              />
              <span style={{ marginLeft: 10 }}>
                {visibleHelper ? "开" : "关"}
              </span>
            </div>
          </div>
          <div className="toolbox-li">
            <label>鹰眼地图</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={visibleMap}
                onChange={(val) => {
                  setVisibleMap(val);
                  val && setVisible2(false);
                }}
              />
              <span style={{ marginLeft: 10 }}>{visibleMap ? "开" : "关"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Trigger
        popup={() => toolBottomDom()}
        mouseEnterDelay={400}
        mouseLeaveDelay={400}
        position="tr"
        trigger="click"
        popupVisible={visible2}
        onVisibleChange={(visible) => {
          setVisible2(visible);
        }}
        popupAlign={{
          top: [-2, 10],
        }}
      >
        <Button
          type="secondary"
          size="large"
          className={styles["toolbox-setting"]}
          style={{
            right:
              !storeFloat.rightCollapsed && storeFloat.status === "editable"
                ? "420px"
                : "40px",
          }}
        >
          <img src={settingIcon} />
          <span style={{ padding: "0 6px" }}>设置</span>
          <IconDown
            style={{
              color: "#31E2FF",
              transform: visible2 ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </Button>
      </Trigger>
      <SceneLinkageMap
        viewer={store.viewer}
        visible={visibleMap}
        setVisible={setVisibleMap}
        onClose={() => {
          setActive("");
        }}
        onChange={(res) => {
          const { buildingId, showKey, hideKey } = res;
          store.changeState({
            buildingId,
            showKey,
            hideKey,
          });
        }}
        className={styles["tool-map"]}
        style={{
          right:
            !storeFloat.rightCollapsed && storeFloat.status === "editable"
              ? "420px"
              : "40px",
        }}
      />
      <FeatureHelper
        visible={visibleHelper}
        setVisible={setVisibleHelper}
        hidden={() => {
          setVisiable(false);
          setVisibleMap(false);
        }}
      />
      {store.filterLayerVisible && <DeviceFilter onChange={(values) => {}} />}
    </div>
  );
};
export default observer(OperatComponent);
