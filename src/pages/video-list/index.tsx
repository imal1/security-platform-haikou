import React, { useState, useEffect } from "react";
import { DevicePalyList, FilterModal, TitleBar, IconBox } from "@/components";
import { Switch, Radio, Tooltip } from "@arco-design/web-react";
import styles from "./index.module.less";
import classNames from "classnames";
import { IconSettings } from "@arco-design/web-react/icon";
import { BroadcastChannel } from "broadcast-channel";
import { projectIdentify, getTypeof } from "@/kit";
import settingIcon from "@/assets/img/setting-icon.svg";
import settingHoverIcon from "@/assets/img/setting-hover-icon.svg";
import appStore from "@/store";
const RadioGroup = Radio.Group;
const list: any = [
  {
    label: "右下至左上",
    value: "0",
  },
  {
    label: "左上至右下",
    value: "1",
  },
];
const winList = [1, 4, 9];
const VideoList = () => {
  const [current, setCurrent] = useState("");
  const [direction, setDirection] = useState("1");
  const [track, setTrack] = useState(true);
  const [hasSet, setHasSet] = useState(false);
  const [count, setCount] = useState(9);
  useEffect(() => {
    window.name = "视频调阅";
    const message = localStorage.getItem(`${projectIdentify}-message`);
    if (message) {
      const row: any = JSON.parse(message);
      if (row?.type == "route") {
        setHasSet(true);
      } else if (!row?.type) {
        setCurrent(row);
      }
      localStorage.setItem(`${projectIdentify}-message`, "");
    }
    if (localStorage.getItem("pageRoute")) {
      setHasSet(true);
    }
    initBroadcastChannel();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      appStore.sendMessage({ direction, track, count, type: "setting" });
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [direction, track, hasSet, count]);
  useEffect(() => {
    setDirection("1");
    setTrack(true);
  }, [hasSet]);
  const initBroadcastChannel = () => {
    const broadcastChannel = new BroadcastChannel("my_channel");
    broadcastChannel.onmessage = (message) => {
      try {
        console.log("Received message:", message);
        localStorage.setItem(`${projectIdentify}-message`, "");
        if (message) {
          if (message?.type == "route") {
            setHasSet(true);
            setCount(4);
          } else if (message?.type == "non-route") {
            setHasSet(false);
          } else if (message?.type != "setting") {
            setCurrent(message);
          }
        }
      } catch (error) {
        console.warn(error);
      }

      // 处理接收到的消息
    };
  };
  const getTip = (val) => {
    switch (val) {
      case 1:
        return '一窗口播放'
        break;
      case 4:
        return '四窗口播放'
      default:
        return '九窗口播放'
        break;
    }
  }
  return (
    <div
      className={classNames("page-container", styles["video-list-wrap"])}
      id="videoListWrap"
    >
      <div className={styles["toolbox-wrap"]}>
        <div className={styles["window-switch"]}>
          {winList.map((item) => (
            <div
              className={classNames(
                styles["window-switch-li"],
                count == item && styles["active"]
              )}
              key={item}
              onClick={() => {
                setCount(item);
              }}
            >
              <Tooltip content={getTip(item)}>
                <div className={styles["window-switch-li-img"]}></div>
              </Tooltip>
            </div>
          ))}
        </div>
        {hasSet && (
          <FilterModal
            title="设置"
            triggerProps={{
              getPopupContainer: () => document.querySelector("#videoListWrap"),
              popupAlign: {
                bottom: [36, 5],
              },
            }}
            height={160}
            filterDom={
              <div className={styles["setting-box"]} onClick={() => { }}>
                <img src={settingIcon} className={styles["pic"]} alt="" />
                <img
                  src={settingHoverIcon}
                  className={styles["pic-hover"]}
                  alt=""
                />
              </div>
            }
          >
            {/* <TitleBar>视频排序方向</TitleBar> */}
            {/* <RadioGroup
              options={list}
              value={direction}
              style={{ margin: "16px 0" }}
              onChange={setDirection}
            /> */}
            <TitleBar style={{ marginBottom: 10 }}>视频追踪模式</TitleBar>
            <Switch size="small" onChange={setTrack} checked={track} />
          </FilterModal>
        )}
      </div>

      <DevicePalyList
        current={current}
        count={count}
        replace={hasSet && track}
      />
    </div>
  );
};
export default VideoList;
