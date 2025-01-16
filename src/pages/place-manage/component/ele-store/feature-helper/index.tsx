import styles from "./index.module.less";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Trigger, Carousel } from "@arco-design/web-react";
import store from "../../../store/index";
import TitleBar from "../../title-bar";
import PicBlock from "@/assets/img/place-manage/fangan-box/top-block.png";
import helper1 from "@/assets/img/place-manage/help1.png";
import helper2 from "@/assets/img/place-manage/help2.png";

interface helpProps {
  setVisible: (val) => void;
  hidden: () => void;
  visible: boolean;
}
const FeatureHelper = (props: helpProps) => {
  const { setVisible, visible } = props;
  useEffect(() => {
    if (!store.rightCollapsed) {
      setVisible(false);
    } else {
      // setVisiable(true);
    }
  }, [store.rightCollapsed]);

  return (
    <div
      className={styles["feature-helper-content"]}
      style={{
        display: visible ? "block" : "none",
        right:
          !store.rightCollapsed && store.status === "editable"
            ? "420px"
            : "40px",
      }}
    >
      <div className="header">
        <img className="block" src={PicBlock} />
        <div className="title">快捷小助手</div>
        <div className="close" onClick={() => setVisible(false)} />
      </div>
      <div className="children">
        <Carousel
          autoPlay={{ interval: 3000, hoverToPause: true }}
          indicatorType={"line"}
          indicatorPosition={"bottom"}
          showArrow="never"
          animation="fade"
          style={{ height: 230 }}
        >
          <div key={1}>
            <TitleBar content="飞行导航" />
            <div className="help1">
              <img src={helper1} />
            </div>
          </div>
          <div key={2}>
            <TitleBar content="鼠标操作指导" />
            <div className="help2">
              <img src={helper2} />
            </div>
          </div>
        </Carousel>
      </div>
      <div className="footer" />
    </div>
  );
};

export default observer(FeatureHelper);
