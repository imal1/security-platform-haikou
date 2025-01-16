import styles from "./index.module.less";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Radio } from "@arco-design/web-react";
import exh_center from "@/assets/img/place-manage/exh-center.png";
import store from "../../store/index";
import FloatBox from "../FloatBox";
import JiFang from "./JiFang";
import WuFang from "./WuFang";
import PlanSelect from "../plan/index";
import PlanCreate from "../plan/PlanCreate";
import PlanDetail from "../plan/PlanDetail";
import PlanCopy from "../plan/PlanCopy";
import classNames from "classnames";
import storeAttr from "../../store/attributes-store";
import globalState from "@/globalState";

const FloatLeft = () => {
  const [curValue, setCurValue] = useState("wf");
  const { selectedPlan, actionType, isAttributes } = store;
  const eventVenueInfo = globalState.get('eventVenueInfo')
  const handleActions = (actionType) => {
    store.changeState({ actionType });
  };

  const handleCancel = () => {
    store.changeState({ actionType: "select" });
  };

  const actionPanel = () => {
    if (isAttributes) return null;
    switch (actionType) {
      case "create":
      case "edit":
        return <PlanCreate onCancel={handleCancel} />;
      case "copy":
        return <PlanCopy onCancel={handleCancel} />;
      case "detail":
        return <PlanDetail onCancel={handleCancel} />;
      default:
        return <PlanSelect onActions={handleActions} />;
    }
  };

  return (
    <FloatBox
      className={classNames(
        styles["float-left"],
        storeAttr.modalVisible && 'place-manage-box-hide'
      )}
      title="活动现场管理"
      width={379}
      direction="left"
      extra={actionPanel()}
    >
      <div className="left-avar">
        <img className="avar-img" src={exh_center} />
        <div className="avar-title">{eventVenueInfo?.eventVO?.placeName||"会展中心"}</div>
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
      {selectedPlan?.id ? (
        <div className="live-show public-scrollbar">
          {/* {curValue === "wf" && <WuFang />} */}
          <div style={{display: curValue === "wf" ? "block" : "none"}}><WuFang /></div>
          <div style={{display: curValue === "jf" ? "block" : "none"}}><JiFang /></div>
          {/* {curValue === "jf" && <JiFang />} */}
        </div>
      ) : (
        <div className="no-data">
          <img src={exh_center} />
          <span>暂无数据</span>
        </div>
      )}
    </FloatBox>
  );
};

export default observer(FloatLeft);
