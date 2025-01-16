//设备播放列表
import React, { useState, useEffect, memo } from "react";
import { Grid } from "@arco-design/web-react";
import { IconClose } from "@arco-design/web-react/icon";
import { KMediaUniContent } from "@/components";
import classNames from "classnames";
import styles from "./index.module.less";
import { deep } from "@/kit";
const { Row, Col } = Grid;

let currentIndex = 0;
let currentActive = null;
interface DevicePalyListPorps {
  className?: string;
  style?: React.CSSProperties;
  onChange?: (val) => void;
  count?: number;
  current?: any;
  replace?: boolean;
}
const DevicePalyList = (props: DevicePalyListPorps) => {
  const { className, style, onChange, count = 4, replace = false } = props;
  const [data, setData] = useState(Array(count).fill({}));
  const [active, setActive] = useState(null);
  const gutter = count == 4 ? 14 : count == 1 ? 0 : 18;
  const newPageVideo = window.globalConfig["newPageVideo"];
  useEffect(() => {
    const list = Array(count).fill({});
    const newData = list.slice(0, count);
    const num = data.length > count ? count : data.length;
    newData.splice(0, num, ...data.slice(0, num));
    setData(newData);
  }, [count]);
  useEffect(() => {
    if (props.current) {
      if (replace) {
        const list = deep(props.current);
        const dataCopy = deep(data);
        const num = list.length > count ? count : list.length;
        dataCopy.splice(0, num, ...list.slice(0, num));
        setData(dataCopy);
        return;
      } else {
        const list = deep(data);
        if (Array.isArray(props.current)) {
          for (let index = 0; index < props.current.length; index++) {
            const item = props.current[index];
            addVideo(item, list);
          }
        } else {
          addVideo(props.current, list);
        }
        setData(list);
      }
    }
  }, [props.current]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const wrap = document.getElementById("devicePalyListWrap");
      if (wrap && !wrap.contains(event.target)) {
        setActive(null); // 点击外部时重置active状态
        currentActive = null;
      }
    };
    const dom = newPageVideo
      ? document
      : document.querySelector(".video-assess-modal");
    dom.addEventListener("mousedown", handleClickOutside);
    return () => {
      dom.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const addVideo = (current, list) => {
    if (currentActive) {
      list[currentActive] = current;
      setActive(null);
      currentActive = null;
      return;
    }
    if (!current?.gbid) return;
    // const cIndex = list.findIndex((item) => item.gbid == current.gbid);
    // if (cIndex > -1) return;
    const index = list.findIndex((item) => !item.gbid);
    if (index > -1) {
      list[index] = current;
      currentIndex = 0;
    } else {
      list[currentIndex] = current;
      if (currentIndex + 1 >= count) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
    }
  };
  const onClose = (index) => {
    const list = deep(data);
    list[index] = "";
    setData(list);
  };
  return (
    <Row
      className={classNames(styles["device-paly-list-wrap"], className)}
      style={style}
      gutter={[gutter, gutter]}
      id="devicePalyListWrap"
    >
      {data.map((item, index) => (
        <Col
          span={count == 4 ? 12 : count == 1 ? 24 : 8}
          style={{
            height: count == 4 ? "50%" : count == 1 ? "100%" : "33.333%",
          }}
          key={index}
        >
          <div
            className={classNames(
              "device-paly-li",
              active == index && "active"
            )}
            onClick={() => {
              setActive(index);
              currentActive = index;
            }}
          >
            {!item.gbid && (item.deviceName || item.name || item.title) && (
              <>
                <div className="device-header text-overflow">
                  <span style={{color: "#F9DE60"}}>{item.prefix}</span>{item.deviceName || item.name || item.title}
                </div>
                <div
                  className="device-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(index);
                  }}
                >
                  <IconClose />
                  <div className="box-border"></div>
                </div>
              </>
            )}
            {item.gbid && (
              <>
                <div className="device-header text-overflow">
                  <span style={{color: "#F9DE60"}}>{item.prefix}</span>{item.deviceName || item.name || item.title}
                </div>
                <div
                  className="device-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(index);
                  }}
                >
                  <IconClose />
                  <div className="box-border"></div>
                </div>
                <KMediaUniContent
                  devId={item.gbid}
                  id={`videoRetrieval-${item.gbid}-${index}`}
                />
              </>
            )}
          </div>
        </Col>
      ))}
    </Row>
  );
};
export default memo(DevicePalyList);
