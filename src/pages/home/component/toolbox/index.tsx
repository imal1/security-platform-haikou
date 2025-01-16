import React, { memo, useEffect, useState } from "react";
import styles from "./index.module.less";
import { observer } from "mobx-react";
import store from "../../store";
import { SceneLinkageMap } from "@/components";
import { IconDown, IconClose } from "@arco-design/web-react/icon";
import { Menu, Button, Trigger, Switch, Modal } from "@arco-design/web-react";
import FrameSelectDevice from "./frame-select-device";
import DeviceFilter from "./device-filter";
import jqbz from "@/assets/img/jqbz.svg";
import jqbzActive from "@/assets/img/jqbz-active.svg";
import tskx from "@/assets/img/tskx.svg";
import sprh from "@/assets/img/icon-ronghe.svg";
import sprhActive from "@/assets/img/icon-ronghe-hover.svg";
import tskxActive from "@/assets/img/tskx-active.svg";
import classNames from "classnames";
import settingIcon from "@/assets/img/setting-icon.svg";
import appStore from "@/store";
import { deep } from "@/kit";
import { useNavigate } from "react-router";
import { getRouteUrl } from "../../../../kit";
const toolList = [
  {
    label: "警情标注",
    value: "policeRemark",
    imgUrl: jqbz,
    imgHoverUrl: jqbzActive,
  },
  {
    label: "图上框选",
    value: "frameSelect",
    imgUrl: tskx,
    imgHoverUrl: tskxActive,
  },
  {
    label: "视频融合",
    value: "videoFusion",
    imgUrl: sprh,
    imgHoverUrl: sprhActive,
  },
];
const list = [
  {
    label: "设备图层",
    value: "deviceLayer",
  },
  {
    label: "鹰眼地图",
    value: "viewChange",
  },
];
const setLinkMapVisible = (visible: boolean) => {
  store.changeState({
    linkMapVisible: visible,
  });
};

const Toolbox = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const navigateTo = useNavigate();
  useEffect(() => { }, [
    appStore.devicePerspectiveVisible,
    store.deviceNameVisible,
  ]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      if (store.allDeviceVisible) {
        store.addDeviceLayer([], [], "devices");
      } else {
        store.removeDeviceLayer("devices");
      }
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    store.polymerization,
    store.filterDeviceStatusKeys,
    store.filterDeviceTypeKeys,
    store.deviceNameVisible,
    store.allDeviceVisible,
    store.allGbid,
    store.allDeviceData,
  ]);
  const toolDom = () => {
    return (
      <div className={classNames(styles["tool-top-popup"], "dropdown-wrap")}>
        {toolList.map((item) => (
          <div
            className={styles["tool-top-popup-li"]}
            key={item.value}
            onClick={() => {
              store.verifyFrame(() => {
                store.location = null;
                if (item.value == "frameSelect") {
                  store.frameSelectVisible = true;
                }
                if (item.value === "policeRemark") {
                  store.toolPoliceRemarkClickTime = String(
                    new Date().getTime()
                  );
                }
                if (item.value === "videoFusion") {
                  // navigateTo("/video_fusion");
                  // 使用 window.open 在新标签页中打开新路由
                  const newTabUrl = getRouteUrl() + "#/video_fusion"; // 构建完整的URL
                  window.open(newTabUrl, "_blank"); // _blank 表示在新标签页打开
                }
                store.toolActive = item.value;
                setVisible(false);
              }, "toolbox");
            }}
          >
            <img src={item.imgUrl} className={styles["pic"]} alt="" />
            <img
              src={item.imgHoverUrl}
              className={styles["pic-hover"]}
              alt=""
            />
            {item.label}
          </div>
        ))}
      </div>
    );
  };
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
          <div className="toolbox-li">
            <label>全量设备</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={store.allDeviceVisible}
                onChange={(val) => {
                  store.allDeviceVisible = val;
                  store.filterLayerVisible = val;
                  store.navPanelVisible = !val;
                  if (val) {
                    store.filterDeviceTypeKeys = [];
                  } else {
                    store.filterDeviceTypeKeys = deep(store.deviceTypesTemp);
                  }
                }}
              />
              <span style={{ marginLeft: 10 }}>
                {store.allDeviceVisible ? "开" : "关"}
              </span>
            </div>
          </div>
          {/* <div className="toolbox-li">
            <label>设备透视</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={appStore.devicePerspectiveVisible}
                onChange={(val) => {
                  appStore.devicePerspectiveVisible = val;
                  store.setDevicePerspective(val);
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
          <div className="toolbox-li">
            <label>设备筛选</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={store.filterLayerVisible}
                onChange={(val) => {
                  store.filterLayerVisible = val;
                  store.navPanelVisible = !val;
                }}
              />
              <span style={{ marginLeft: 10 }}>
                {store.filterLayerVisible ? "开" : "关"}
              </span>
            </div>
          </div>
          <div
            className="toolbox-li"
            style={{ display: store.linkMapDisable ? "none" : "flex" }}
          >
            <label>鹰眼地图</label>
            <div className="toolbox-li-right">
              <Switch
                size="small"
                checked={store.linkMapVisible}
                onChange={(val) => {
                  store.linkMapVisible = val;
                }}
              />
              <span style={{ marginLeft: 10 }}>
                {store.linkMapVisible ? "开" : "关"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {!store.linkMapDisable && store.tab == "sy" && (
        <Trigger
          popup={() => toolDom()}
          mouseEnterDelay={400}
          mouseLeaveDelay={400}
          position="left"
          trigger="click"
          popupVisible={visible}
          onVisibleChange={(visible) => {
            setVisible(visible);
          }}
          popupAlign={{
            left: [10, 30],
          }}
        >
          <div
            className={classNames(
              styles["tool-top-wrap"],
              visible && styles["active"]
            )}
          >
            工具
          </div>
        </Trigger>
      )}
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
          style={{ width: 130, display: "flex", alignItems: "center" }}
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
        visible={store.linkMapVisible}
        setVisible={setLinkMapVisible}
        onClose={() => {
          store.toolActive = "viewChange";
        }}
        onChange={(res) => {
          const { buildingId, showKey, hideKey } = res;
          store.changeState({
            buildingId,
            showKey,
            hideKey,
          });
        }}
        className={styles["home-scene-linkage-map"]}
      />
      {store.frameSelectVisible && store.tab == "sy" && (
        <FrameSelectDevice
          onClose={() => {
            store.toolActive = "";
          }}
        />
      )}
      {store.filterLayerVisible && <DeviceFilter onChange={(values) => { }} />}
    </div>
  );
};
export default memo(observer(Toolbox));
