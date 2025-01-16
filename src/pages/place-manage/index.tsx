/**
 * 活动现场管理
 */
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Message, Button } from "@arco-design/web-react";
import { IconClose } from "@arco-design/web-react/icon";
import globalState from "@/globalState";
import appStore from "@/store";
import { UePreview, ChangeView, ComponentFrame } from "@/components";
import store from "./store";
import storeAttr from "./store/attributes-store";
import FloatLeft from "./component/FloatLeft/index";
import AddDevice from "./component/addDevice/index";
import EleStore from "./component/ele-store";
import EleAttributes from "./component/ele-attributes";
import GuideSteps from "./component/GuideNew/index";
import Deploying from "./component/plan/Deploying";
import DeviceDetail from "./component/FloatLeft/DeviceDetail";
import exclamationCircle from "@/assets/img/exclamationCircle.png";
import "./index.less";
import { updateDeviceBuildingInfo, updateLocation } from "./store/webapi";
import { getServerBaseUrl, getServerBaseUrlNoPortal } from "../../kit";
import Correction from "./component/correction";
import OperatComponent from "./component/operat-component";
import PositionCorrect from "../../components/position-correct";
import styles from "./component/FloatLeft/WuFang.module.less";
import { VideoAssess } from "../../components";
const PlaceManage = () => {
  const {
    status,
    actionType,
    editFeature,
    addFeatureStorage,
    isAttributes,
    floatType,
    viewer,
    selectedDevice,
    isView,
    componentFrameVisible,
    currentFrameStyle,
  } = store;
  // const cTUserMngServer =
  //   getServerBaseUrlNoPortal("CT_SERVER_URL") ||
  //   getServerBaseUrl("CTUserMngServer");
  // const [cTUserMngServer, setCTUserMngServer] = useState<string>("");
  const newPageVideo = window.globalConfig["newPageVideo"];
  useEffect(() => {
    if (!appStore.serviceRoutes) return;
    store.changeState({
      cTUserMngServer: getServerBaseUrl("CTUserMngServer"),
    });
  }, [appStore.serviceRoutes]);
  useEffect(() => {
    store.initialData();
    store.getAllPlans();
    storeAttr.componentStore = store;
    storeAttr.gizmoControl = null;
    window.onbeforeunload = function () {
      const point = localStorage.getItem("ue-device-property");
      if (point && store.isCorrect) {
        const geometry = JSON.parse(point);
        const location = [
          {
            ...geometry,
          },
        ];
        console.log(store.cTUserMngServer, "cTUserMngServer");
        updateLocation(store.cTUserMngServer, location).then(() => {
          localStorage.removeItem("ue-device-property");
          saveIsOutDoor(store.cTUserMngServer, location);
        });
        return 1;
      } else {
        localStorage.removeItem("ue-device-property");
      }
    };
    const saveIsOutDoor = (cTUserMngServer, location) => {
      const buildingEvent = new window["KMapUE"].BuildingEvent(viewer);
      const buildingInfo = buildingEvent.getInfo();
      const isOutDoor =
        !buildingInfo ||
        (buildingInfo && buildingInfo.buildingId === "outdoor");
      const param = {
        appName: globalState.get("userInfo").userName,
        serviceName: "device_position_modify",
        esDataEntityList: location.map((i) => {
          return {
            dataId: i.id,
            appName: globalState.get("userInfo").userName,
            serviceName: "device_position_modify",
            keyValueMap: {
              // buildingId不是outdoor的话就是室内
              outdoor: isOutDoor + "",
            },
          };
        }),
      };
      updateDeviceBuildingInfo(cTUserMngServer, param);
    };
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && storeAttr.elementType == "elementModel") {
        storeAttr.setGizmoControlMode();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      storeAttr.modalVisible = false;
    };
  }, []);
  useEffect(() => {
    if (store.selectedFeature || store.isAttributes) {
      store.isView = true;
    } else {
      store.isView = false;
    }
  }, [store.selectedFeature, store.isAttributes]);
  useEffect(() => {
    if (!isAttributes) {
      store.editFeature = null;
    }
  }, [isAttributes]);
  const onLoad = (result) => {
    store.changeState({ viewer: result.ue });
    globalState.set({ globalViewer: result.ue });
  };

  const handleNowCreate = () => {
    store.changeState({ actionType: "create" });
  };

  const handleDeploy = () => {
    store.changeState({ status: "editable" });
    store.rightCollapsed = false;
  };

  const handleExit = () => {
    if (["create", "edit", "copy"].includes(actionType) || isAttributes) {
      Message.error("当前正在编辑中，请先关闭");
    } else if (store.selectedFeature) {
      Message.error("当前正在创建要素中，请先退出");
    } else if (store.isCorrect) {
      Message.error("当前正在纠偏中，请先关闭");
    } else {
      store.changeState({ status: "readonly" });
      store.rightCollapsed = true;
    }
  };

  return (
    <div
      className="page-container place-manage-wrap"
      style={{ backgroundColor: "#008FF4" }}
    >
      <UePreview solution={globalState.get("solution")} onLoad={onLoad} />
      {storeAttr.modalVisible && <AddDevice />}
      <FloatLeft />
      {/* {storeAttr.modalVisible ? <AddDevice /> : <FloatLeft />} */}

      <GuideSteps onCreate={handleNowCreate} />
      {isAttributes ? (
        <EleAttributes
          indexStore={store}
          editFeature={editFeature}
          addFeatureStorage={floatType === "edit" ? null : addFeatureStorage}
        />
      ) : (
        status === "editable" && <EleStore store={store} />
      )}
      <Deploying onDeply={handleDeploy} onExit={handleExit} />
      <OperatComponent />
      {/* {selectedDevice && <DeviceDetail />} */}
      <ChangeView
        viewer={store.viewer}
        visiable={isView}
        geometryObj={store.geometryObj}
        geometryPosition={store.geometryPosition}
        elementType={(store.elementFeature && store.elementFeature.type) || ""}
      />
      {store.isCorrect && (
        <Correction
          coordinate={{
            lng: store.correctLLA.lng.toFixed(8),
            lat: store.correctLLA.lat.toFixed(8),
            alt: store.correctLLA.alt.toFixed(2),
          }}
          confirm={
            store.defenseStatus !== "add_device"
              ? store.correctCofirm
              : store.manualCorrectFunc
          }
          onCancel={store.correctCancel}
          onSave={store.correctOk}
          isRight={!store.rightCollapsed}
          isTop={storeAttr.frameSelectVisible}
        />
      )}
      {/* 物防右击面板 */}
      {store.defenseStatus == "wf" && store.isMenu && (
        <div
          className={styles.menu}
          id="fixMenu"
          style={{
            left: store.menuPoint.x + 10,
            top: store.menuPoint.y + 10,
            border:
              store.status !== "editable" && !store.hasCorrectDetail
                ? "none"
                : "",
          }}
        >
          {store.elementFeature.type !== "model" && store.hasCorrectDetail && (
            <div onClick={store.toWfDetail}>查看详情</div>
          )}
          {store.status == "editable" && (
            <div onClick={store.handleWfEditUe}>编辑要素</div>
          )}
          {store.status == "editable" &&
            store.correctEleData &&
            store.correctEleData.featureType !== "SITE_DRAWING" && (
              <div onClick={store.handleWfCorrect}>位置纠偏</div>
            )}
        </div>
      )}
      {/* 技防右击面板 */}
      {store.defenseStatus == "jf" && store.isMenu && (
        <div
          className={styles.menu}
          id="fixMenu"
          style={{ left: store.menuPoint.x + 10, top: store.menuPoint.y + 10 }}
        >
          <div onClick={store.toJfDetail}>查看详情</div>
          {store.status == "editable" &&
            store.jfCurrent.type == "temporary" &&
            !["BWC", "PAD", "PTT"].includes(store.jfCurrent.deviceType) && (
              <div onClick={store.handleJfCorrect}>位置纠偏</div>
            )}
        </div>
      )}

      {store.defenseStatus == "add_device" && store.isMenu && (
        <div
          className={styles.menu}
          id="fixMenu"
          style={{ left: store.menuPoint.x + 10, top: store.menuPoint.y + 10 }}
        >
          <div onClick={store.handleToDetailFunc}>查看详情</div>
          {store.status == "editable" &&
            !["BWC", "PAD", "PTT"].includes(store.jfCurrent.deviceType) && (
              <div onClick={store.handleCorrectFunc}>位置纠偏</div>
            )}
        </div>
      )}

      {!newPageVideo && (
        <VideoAssess
          data={store.currentDevice}
          visible={store.jfVideoVisible}
          setVisible={(val) => {
            store.changeState({ jfVideoVisible: val });
          }}
        />
      )}

      {/* {store.isCorrect && (
        <PositionCorrect onCancel={store.correctCancel} onOk={store.correctOk} />
      )} */}
      <ComponentFrame
        visible={componentFrameVisible}
        setVisible={(val) => {
          store.componentFrameVisible = val;
        }}
        popFrameStyle={currentFrameStyle}
      />
    </div>
  );
};

export default observer(PlaceManage);
