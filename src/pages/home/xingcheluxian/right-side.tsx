import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import indexStore from "../store";
import store from "../store/xclx.store";
import { Grid, Radio, Button } from "@arco-design/web-react";
import DefDeployment from "../souye/def-deployment";
import Title from "../component/title";
import { KMediaUniContent } from "@/components";
import noVideo from "@/assets/img/no-video.png";

const RightSide = () => {
  // const { isPlay } = indexStore;
  const { currentGbid, carDevice } = store;
  // useEffect(() => {
  //   const { routeTrackMap, currentIndex } = store;
  //   const current = routeTrackMap.get(currentIndex);
  //   if (current) {
  //     if (isPlay) {
  //       store.routeTrackEvent(indexStore.follow);
  //     } else {
  //       current.pause();
  //       current.clearLabel();
  //       store.currentIndex = 0;
  //     }
  //     routeTrackMap.get(currentIndex).follow(indexStore.follow);
  //   }
  // }, [isPlay, store.routeTrackMap]);
  useEffect(() => {
    console.log(store.currentGbid, "store.currentGbid");
  }, [store.currentGbid]);
  return (
    <div className="box-con">
      <Title
        title="路线周边视频"
        after={
          <></>
        }
      />
      {!store.isInnerRoute() && <div className="video-box" style={{ minHeight: "178px" }}>
        {carDevice ? (
          <div className="media-box" id="mediaBox">
            <KMediaUniContent devId={carDevice} id="routeMedia" />
          </div>
        ) : (
          <>
            <img src={noVideo} alt="" width={136} />
          </>

        )}
      </div>}
      <div style={{ overflow: "auto" }} className="public-scrollbar">
        {
          store.linkVideoList &&
          store.linkVideoList.map((item: any, key: number) => {
            return (
              <>
                <div className="video-box" style={{ marginTop: 0 }}>
                  {(item && item.gbid) ? (
                    <div className="media-box" id={"mediaBox" + item.id}>
                      <KMediaUniContent devId={item.gbid} id={"routeMedia" + item.id} />
                      <div className="media-tip"><span style={{ color: "#F9DE60" }}>{item.prefix}</span>{(key + 1) + "  " + item.deviceName}</div>
                    </div>
                  ) : (
                    <>
                      <img src={noVideo} alt="" width={136} />
                    </>

                  )}
                </div>
              </>
            )
          })
        }

      </div>


      {/* <Title
        title="车辆经过视频调阅"
        after={
          <Button
            type="secondary"
            size="small"
            onClick={() => {
              indexStore.isPlay = !isPlay;
              if (isPlay) {
                const { routeTrackMap, currentIndex } = store;
                setTimeout(() => {
                  routeTrackMap.get(currentIndex).follow(false);
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
                    duration: 2000,
                  });
                }, 1000);
              }
            }}
          >
            {isPlay ? "结束行驶" : "车辆行驶"}
          </Button>
        }
      />
      <div className="video-box">
        {currentGbid ? (
          <div className="media-box" id="mediaBox">
            <KMediaUniContent devId={currentGbid} id="routeMedia" />
          </div>
        ) : (
          <img src={noVideo} alt="" width={136} />
        )}
      </div>
      <Title title="物防部署" />
      <DefDeployment arrangeValue={"wfbs"} isAllCheck={false} /> */}
    </div>
  );
};
const ObserverRightSide = observer(RightSide);
export default ObserverRightSide;
