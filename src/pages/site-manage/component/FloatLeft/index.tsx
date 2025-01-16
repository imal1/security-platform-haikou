import styles from "./index.module.less";
import { useState } from "react";
import { observer } from "mobx-react";
import { Radio } from "@arco-design/web-react";
import exh_center from "@/assets/img/place-manage/exh-center.png";
import store from "../../store/index";
import FloatBox from "../../../place-manage/component/FloatBox";
import JiFang from "./JiFang";
import WuFang from "./WuFang";
import classNames from "classnames";
import storeAttr from "@/pages/place-manage/store/attributes-store";
import globalState from "@/globalState";

const FloatLeft = () => {
  const [curValue, setCurValue] = useState("wf");
  const { selectedPlan } = store;
  const eventVenueInfo = globalState.get("eventVenueInfo");
  return (
    <FloatBox
      className={classNames(
        styles["float-left"],
        storeAttr.modalVisible && "place-manage-box-hide"
      )}
      title={"场所设施管理"}
      width={379}
      direction="left"
    >
      <div className="left-avar">
        <img className="avar-img" src={exh_center} />
        <div className="avar-title">
          {eventVenueInfo?.venueVO?.placeName || "会展中心"}
        </div>
      </div>
      <Radio.Group
        className="radio-group-buttons"
        options={[
          { label: "物防", value: "wf" },
          { label: "技防", value: "jf" },
        ]}
        value={curValue}
        onChange={setCurValue}
        type="button"
      />
      {/* {selectedPlan?.id ? ( */}
      <div className="live-show public-scrollbar">
        {/* {curValue === "wf" && <WuFang />}
        {curValue === "jf" && <JiFang />} */}
        <div style={{display: curValue === "wf" ? "block" : "none"}}><WuFang /></div>
        <div style={{display: curValue === "jf" ? "block" : "none"}}><JiFang /></div>
      </div>
      {/* ) : (
        <div className="no-data">
          <img src={exh_center} />
          <span>暂无数据</span>
        </div>
      )} */}
    </FloatBox>
  );
};

export default observer(FloatLeft);
