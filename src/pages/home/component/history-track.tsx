import React, { useEffect, useState, useRef, memo } from "react";
import { observer } from "mobx-react";
import store from "../store";
import { FilterModal, TitleBar } from "@/components";
import classNames from "classnames";
import { Button, Select, Slider } from "@arco-design/web-react";
import playUrl from "@/assets/img/home/play.png";
import pauseUrl from "@/assets/img/home/pause.png";
import { debounce } from "lodash";
import { formatDate } from "@/kit"

const seepRateList = [
  {
    label: "0.25倍速",
    value: 0.25,
  },
  {
    label: "0.5倍速",
    value: 0.5,
  },
  {
    label: "0.75倍速",
    value: 0.75,
  },
  {
    label: "正常速度",
    value: 1,
  },
  {
    label: "5倍速",
    value: 5,
  },
  {
    label: "10倍速",
    value: 10,
  },
  {
    label: "20倍速",
    value: 20,
  },
  {
    label: "25倍速",
    value: 25,
  },
  {
    label: "30倍速",
    value: 30,
  },
  {
    label: "40倍速",
    value: 40,
  },
  {
    label: "50倍速",
    value: 50,
  },
  {
    label: "60倍速",
    value: 60,
  },
  {
    label: "70倍速",
    value: 70,
  },
  {
    label: "80倍速",
    value: 80,
  },
  {
    label: "90倍速",
    value: 90,
  },
  {
    label: "100倍速",
    value: 100,
  },
];
const HistoryTrack = () => {
  const [play, setPlay] = useState(false);

  const { startTimestamp,
    endTimestamp,
    totalTime,
    totalTimeStr } = store?.historyTrackTimes;
  const playHistoryTrack = () => {
    store.historytrack &&
      store.historytrack.play()
  }

  const pauseHistoryTrack = () => {
    store.historytrack &&
      store.historytrack.pause()
  }
  return (
    <div
      className="track-box"
      style={{ display: store.trackType != "history" ? "none" : "block" }}
    >
      {store.trackType == "history" && (
        <FilterModal
          title="历史轨迹播放"
          triggerProps={{
            getPopupContainer: () => document.querySelector(".track-box"),
            popupAlign: {
              bottom: [-40, 40],
            },
            clickOutsideToClose: false,
            popupStyle: {
              zIndex: 10000,
            },
          }}
          height={275}
          width={458}
          defaultVisible={true}
          filterDom={
            <div
              className={classNames("oper-btn-wrap")}
              style={{
                right: 43,
              }}
            >
              <div className={classNames("oper-btn-li")} style={{ width: 160 }}>
                <span>历史轨迹回放</span>
              </div>
            </div>
          }
        >
          <TitleBar
            style={{
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label htmlFor="">查看视角</label>
              <div>
                <Button
                  type="secondary"
                  size="small"
                  onClick={() => {
                    store.follow = false;
                    store.historytrack?.unFollowHistoryTrack();
                    store.viewer.flyTo({
                      lng: 108.37581830651949,
                      lat: 22.811910337726445,
                      alt: 1682.496293967291,
                      x: -34908.60654318053,
                      y: 48366.81949823002,
                      z: 168249.62939672908,
                      pitch: -89.9000015258789,
                      heading: 215.21676635742188,
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
                    store.follow = true;
                    store.historytrack?.followHistoryTrack({})
                  }}
                >
                  跟随视角
                </Button>
              </div>
            </div>
          </TitleBar>
          <TitleBar
            style={{
              marginBottom: 14,
            }}
          >
            播放速度
          </TitleBar>
          <Select
            options={seepRateList}
            value={store.speedRate}
            onChange={(val) => {
              store.speedRate = val;
              store.historytrack?.setSpeedRate(val);
            }}
            placeholder="请选择播放速度"
            getPopupContainer={() => document.querySelector(".track-box")}
          />
          <div className="track-play-wrap">
            <div className="track-switch">
              {play && (
                <img
                  src={pauseUrl}
                  onClick={() => {
                    setPlay(false);
                    pauseHistoryTrack();
                  }}
                />
              )}
              {!play && (
                <img
                  src={playUrl}
                  onClick={() => {
                    setPlay(true);
                    playHistoryTrack();
                  }}
                />
              )}
            </div>
            <div className="track-play-con">
              <Slider
                value={store.historyProgress}
                max={totalTime}
                onChange={debounce((val) => {
                  if (val > store.historyProgress) {
                    store.historyProgress = val;
                    store.historytrack?.setProgress(startTimestamp + val);
                  }

                }, 600)}
                // tooltipVisible={true}
                formatTooltip={
                  (value: number) => {
                    return formatDate(value + startTimestamp)
                  }
                }
                getTooltipContainer={() => document.querySelector(".track-box")}
              />
              <div className="play-time start-time">0:00</div>
              <div className="play-time end-time">{store.formatTimestamp(store.historyProgress)}/{totalTimeStr}</div>
            </div>
          </div>
        </FilterModal>
      )}
    </div>
  );
};
export default memo(observer(HistoryTrack));
