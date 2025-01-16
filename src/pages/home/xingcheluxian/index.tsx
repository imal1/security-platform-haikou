import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../store/xclx.store";
import indexStore from "../store";
import LeftBox from "../component/left-box";
import RightBox from "../component/right-box";
import LeftSide from "./left-side";
import RightSide from "./right-side";
import TrackControl from "../component/track-control";
import appStore from "@/store";
import { BroadcastChannel } from "broadcast-channel";
import { Button } from "@arco-design/web-react";
import classNames from "classnames";
import RealTrackPanel from "./real-track-panel";
import { deep } from "@/kit";
import { Modal, Select } from "@arco-design/web-react";
const XingCheLuXian = () => {
  const { viewer } = indexStore;

  useEffect(() => {
    return () => {
      appStore.sendMessage(Array(store.videoCount).fill({}));
      appStore.sendMessage({ type: "non-route" });
      localStorage.removeItem("pageRoute");
      store.resetSplitBuildGroup();
    };
  }, [indexStore.childTab]);

  useEffect(() => {
    window.onbeforeunload = function () {
      appStore.sendMessage({ type: "non-route" });
      localStorage.removeItem("pageRoute");
    };
    return () => {
      indexStore.track = false;
      appStore.sendMessage(Array(store.videoCount).fill({}));
      localStorage.removeItem("pageRoute");
      store.realTrack && store.realTrack.remove();
      store.realRouteTrack && store.realRouteTrack.remove();
    };
  }, []);
  useEffect(() => {
    appStore.sendMessage({ type: "route" });
    localStorage.setItem("pageRoute", "route");
    initBroadcastChannel();
    indexStore.changeState({
      leftVisible: false,
      rightVisible: false,
    });
    store.viewer = indexStore.viewer;
    init(indexStore.childTab);
    console.log(indexStore.childTab);
    store.linkVideoList = [];
    return () => {
      indexStore.follow = false;
      indexStore.isPlay = false;
      store.remove();
      store.initialVariable();
    };
  }, [indexStore.viewer, indexStore.childTab]);
  useEffect(() => {
    if (store.isReserveMode) {
      const { routeTrackMap, currentIndex } = store;
      const current = routeTrackMap.get(currentIndex);
      if (current) {
        current.follow(indexStore.follow);
      }
      store.follow = indexStore.follow;
    } else {
      store.realTrack && store.realTrack.follow(!indexStore.follow);
      store.realRouteTrack && store.realRouteTrack.follow(indexStore.follow);
    }

    if (indexStore.follow) {
      indexStore.leftVisible = false;
    }
  }, [indexStore.follow]);
  const init = async (id: any) => {
    await store.getLeadershipRoute(id);
    store.flyToRouteView();
    // const { switchAnimation, visualAngle } = store.currentRoute;
    // if (switchAnimation && visualAngle) {
    //   const duration =
    //     switchAnimation.animationType != "0"
    //       ? switchAnimation.animationTime * 1000
    //       : 0;
    //   const rotation = visualAngle.rotation;
    //   store.viewer.flyTo({ ...rotation, duration });
    // }
    // store.viewer && store.viewer.flyTo({
    //   lng: 108.37876383814013,
    //   lat: 22.816159150464543,
    //   alt: 255.64391462068983,
    //   x: -2119.0985304709234,
    //   y: -2944.9604158572874,
    //   z: 25564.391462068983,
    //   pitch: -25.085721969604492,
    //   heading: 207.6167449951172,
    //   roll: 0,
    //   duration: 2000
    // });
  };
  useEffect(() => {
    if (store.linkVideoList?.length == 0) return;
    if (store.videoDirection == "1") {
      // 正序
      const msgData: any = [];
      if (store.currentRoute?.carType == 9) {
        // 室内路线
      } else {
        // 室外路线
        msgData.push({ gbid: store.carDevice, deviceName: "车载设备" });
      }
      store.linkVideoList.map((item) => {
        const { gbid, status, title, name, deviceType, deviceName, prefix } =
          item;
        msgData.push({
          gbid,
          status,
          title,
          deviceType,
          name,
          deviceName,
          prefix,
        });
      });
      console.log("222linkVideoList", msgData);
      appStore.sendMessage(msgData);
    }
    // else {
    //   // 倒序
    //   const msgData: any = [];
    //   if(store.currentRoute?.carType != 9) {
    //     msgData.push({ gbid: store.carDevice, deviceName: "车载设备" });
    //   }
    //   const videoListCopy = deep(store.linkVideoList);
    //   videoListCopy.reverse().map((item) => {
    //     const { gbid, status, title, name, deviceType, deviceName, prefix } = item;
    //     msgData.push({
    //       gbid,
    //       status,
    //       title,
    //       deviceType,
    //       name,
    //       deviceName,
    //       prefix
    //     });
    //   })
    //   console.log("333linkVideoList", msgData);
    //   appStore.sendMessage(msgData);
    // }
  }, [store.videoCount]);
  //监听9宫格设置
  const initBroadcastChannel = () => {
    const broadcastChannel = new BroadcastChannel("my_channel");
    broadcastChannel.onmessage = (message) => {
      try {
        console.log("Received message:", message);
        if (message && message?.type == "setting") {
          console.log({ message });
          const { track, direction, count } = message;
          store.changeState({
            videoTrack: track,
            videoDirection: direction,
            videoCount: count,
          });
          indexStore.track = track;
        }
      } catch (error) {
        console.warn(error);
      }

      // 处理接收到的消息
    };
  };
  const onCancel = () => {
    store.carDeviceVisible = false;
  };
  const onOk = () => {
    store.carDevice = store.carDeviceTemp;
    onCancel();
  };
  return (
    <div className="xingcheluxian-wrap">
      <LeftBox>
        <LeftSide />
      </LeftBox>
      {!window.globalConfig["newPageVideo"] && (
        <RightBox>
          <RightSide />
        </RightBox>
      )}
      {!store.isReserveMode && store.currentRoute?.carType == 9 && (
        <TrackControl
          track={store.routeTrackMap.get(0)}
          isRight={!indexStore.rightVisible && !indexStore.linkMapVisible}
        />
      )}
      {store.currentRoute?.carType !== 9 &&
        (indexStore.isPlay || indexStore.isReal) && (
          <div
            className={classNames(
              "view-change-wrap",
              indexStore.navPanelCollapse ? "wrap-bottom" : ""
            )}
          >
            <Button
              type="secondary"
              size="small"
              onClick={() => {
                indexStore.follow = false;
                store.viewer.flyTo({
                  lng: 108.37876383814013,
                  lat: 22.816159150464543,
                  alt: 255.64391462068983,
                  x: -2119.0985304709234,
                  y: -2944.9604158572874,
                  z: 25564.391462068983,
                  pitch: -25.085721969604492,
                  heading: 207.6167449951172,
                  roll: 0,
                  duration: 0,
                });
              }}
            >
              上帝视角
            </Button>
            <Button
              type="primary"
              size="small"
              style={{ marginLeft: 12 }}
              onClick={() => {
                indexStore.follow = true;
              }}
            >
              跟随视角
            </Button>
          </div>
        )}
      {store.realTackPanelVisble && window.globalConfig["realRoutePanel"] && (
        <RealTrackPanel
          total={store.realRouteTotal}
          progress={store.realRouteProgress}
          speed={store.realRouteSpeed}
          isRigth={indexStore.rightVisible}
        />
      )}
      <Modal
        title="提示"
        visible={store.carDeviceVisible}
        onOk={onOk}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={true}
        style={{ width: 400 }}
        maskStyle={{ opacity: 0 }}
      >
        <p style={{ marginBottom: 10 }}>请确认当前路线追踪订阅的车载设备:</p>
        <Select
          options={store.carDeviceMap}
          value={store.carDeviceTemp}
          onChange={(val) => {
            store.carDeviceTemp = val;
          }}
          placeholder="请选择车载设备"
        />
      </Modal>
    </div>
  );
};
const ObserverXingCheLuXian = observer(XingCheLuXian);
export default ObserverXingCheLuXian;
