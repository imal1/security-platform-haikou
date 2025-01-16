import { observer } from "mobx-react";
import UePreview from "../../components/kmapue-content/ue-preview";
import globalState from "../../globalState";
import store, { pointsInfo } from "./store";
import LeftBox from "./component/left-box";
import "./index.less";
import LeftSide from "./component/left-side";
import classNames from "classnames";
import LeftSideUp from "./component/left-side-up";
import Axios from "axios";
import { getMediaConfig, getNodeConfig } from "./store/webapi";
import { deep } from "../../kit";
import { useEffect } from "react";

const tabList = [
  {
    label: "融合点位",
    value: "0",
  },
  {
    label: "漫游路线",
    value: "1",
  },
];

const VideoFusion = () => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      store.stopAllVideoFusion(store.allPoints);
      store.hideVideoFusion(store.allPoints);
      return 1;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    if (store.homeLeftSideActive == "1") {
      // 漫游路线
      // 清空所有面板
      // store.hideVideoFusion(store.activePoints);
      // 加载路线上的前两个面板
      store.showVideoFusionByIndex(0);
    } else {
      // 融合点位
      // 清空所有面板

      store.hideVideoFusion(store.allPoints);
    }
    store.stopAllVideoFusion(store.allPoints);
  }, [store.homeLeftSideActive]);
  const onLoad = async (result) => {
    // console.log("result", result);
    store.changeState({
      viewer: result.ue,
      routePointsInfo: deep(pointsInfo),
    });
    await store.initVideoFusion();
  };
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
              if (store.isWandering) {
                return;
              }
              store.homeLeftSideActive = item.value;
              store.leftVisible = true;
              store.flyToView(globalState.get("mainView"));
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <div className="page-container video-fusion-wrap">
        <UePreview
          solution={globalState.get("solution1") || globalState.get("solution")}
          onLoad={onLoad}
        />

        <LeftBox tab={getTabDom()}>
          {store.homeLeftSideActive == "0" && <LeftSideUp />}
          {store.homeLeftSideActive == "1" && <LeftSide />}
        </LeftBox>
      </div>
    </>
  );
};

export default observer(VideoFusion);
