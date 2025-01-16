/**
 * 场景管理
 */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import globalState from "@/globalState";
import { UePreview, ChangeView, ComponentFrame } from "@/components";
import store from "./store";
import storeAttr from "../place-manage/store/attributes-store";
import placeStore from "../place-manage/store";
import FloatLeft from "./component/FloatLeft/index";
import AddDevice from "../place-manage/component/addDevice";
import EleStore from "../place-manage/component/ele-store";
import EleAttributes from "../place-manage/component/ele-attributes";
import FeatureRegion from "../place-manage/component/ele-store/feature-region";
import OperatComponent from "../place-manage/component/operat-component";
import { getServerBaseUrl, getServerBaseUrlNoPortal } from "../../kit";
import {
  updateLocation,
  updateDeviceBuildingInfo,
} from "../place-manage/store/webapi";
import Correction from "../place-manage/component/correction";
import PositionCorrect from "../../components/position-correct";
import styles from "../place-manage/component/FloatLeft/WuFang.module.less";
import appStore from "@/store";
import { VideoAssess } from "../../components";

const SiteManage = () => {
  const {
    status,
    selectedFeature,
    editFeature,
    addFeatureStorage,
    isAttributes,
    isView,
  } = store;
  const newPageVideo = window.globalConfig["newPageVideo"];
  const { componentFrameVisible, currentFrameStyle } = placeStore;
  const [cTUserMngServer, setCTUserMngServer] = useState<string>("");
  useEffect(() => {
    if (!appStore.serviceRoutes) return;
    store.changeState({
      cTUserMngServer: getServerBaseUrl("CTUserMngServer"),
    });
    // setCTUserMngServer(getServerBaseUrl("CTUserMngServer"));
  }, [appStore.serviceRoutes]);
  useEffect(() => {
    // store.getAllPlans();
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
        console.log(cTUserMngServer, "cTUserMngServer");
        updateLocation(store.cTUserMngServer, location).then(() => {
          localStorage.removeItem("ue-device-property");
          saveIsOutDoor(store.cTUserMngServer, location);
        });
        return 1;
      } else {
        localStorage.removeItem("ue-device-property");
      }
    };
    // 位置纠偏保存室内室外
    const saveIsOutDoor = (cTUserMngServer, location) => {
      const buildingEvent = new window["KMapUE"].BuildingEvent(store.viewer);
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
      updateDeviceBuildingInfo(store.cTUserMngServer, param);
    };
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && storeAttr.elementType == "elementModel") {
        storeAttr.setGizmoControlMode();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      storeAttr.modalVisible = false;
      document.removeEventListener("keydown", handleKeyDown);
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
    placeStore.viewer = result.ue;
  };

  const handleFeatureClose = () => {
    store.changeState({ selectedFeature: null });
  };

  return (
    <div className="page-container" style={{ backgroundColor: "#008FF4" }}>
      <UePreview solution={globalState.get("solution")} onLoad={onLoad} />
      {storeAttr.modalVisible && <AddDevice />}
      <FloatLeft />
      {/* {storeAttr.modalVisible ? <AddDevice /> : <FloatLeft />} */}
      {isAttributes ? (
        <EleAttributes
          indexStore={store}
          editFeature={editFeature}
          addFeatureStorage={addFeatureStorage}
        />
      ) : (
        status === "editable" && <EleStore store={store} />
      )}
      <OperatComponent />
      {(selectedFeature?.featureCode === "AREA" ||
        selectedFeature?.featureCode === "AOR") && (
        <FeatureRegion store={store} onClose={handleFeatureClose} />
      )}
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
          confirm={store.correctCofirm}
          onCancel={store.correctCancel}
          onSave={store.correctOk}
          isRight={!placeStore.rightCollapsed}
        />
      )}

      {/* 物防右击面板 */}
      {store.defenseStatus == "wf" && store.isMenu && (
        <div
          className={styles.menu}
          id="fixMenu"
          style={{ left: store.menuPoint.x + 10, top: store.menuPoint.y + 10 }}
        >
          {store.elementFeature &&
            store.elementFeature.type !== "model" &&
            store.hasCorrectDetail && (
              <div onClick={store.toWfDetail}>查看详情</div>
            )}
          <div onClick={store.handleWfEditUe}>编辑要素</div>
          {store.correctEleData &&
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
            !["BWC", "PAD", "PTT"].includes(store.jfCurrent.deviceType) && (
              <div onClick={store.handleJfCorrect}>位置纠偏</div>
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
          placeStore.componentFrameVisible = val;
        }}
        popFrameStyle={currentFrameStyle}
      />
    </div>
  );
};

export default observer(SiteManage);
