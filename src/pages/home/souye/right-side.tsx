import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import store from "../store";
import { Grid, Radio } from "@arco-design/web-react";
import fjUrl from "@/assets/img/home/right-fj.png";
import rsUrl from "@/assets/img/home/right-rs.png";
import timeUrl from "@/assets/img/home/right-time.png";
import PoliceDeployment from "./police-deployment";
import DefDeployment from "./def-deployment";
import PerceptionDevice from "./perception-device";
import Title from "../component/title";
import { deviceActivity } from "../store/webapi";
import { formatDate } from "@/kit";

const { Row, Col } = Grid;
const RadioGroup = Radio.Group;
const abList = ["安保勤务", "进行中", "已关联场所"];
const arrangeList = [
  {
    label: "警力部署",
    value: "jlbs",
  },
  {
    label: "物防部署",
    value: "wfbs",
  },
  {
    label: "感知设备",
    value: "gzsb",
  },
];
interface RightBoxProps {
  style?: React.CSSProperties;
}
const RightSide = (props: RightBoxProps) => {
  const { style } = props;
  const [arrangeValue, setArrangeValue] = useState("jlbs");
  const { activeData } = store;
  return (
    <div className="box-con" style={style}>
      <Title
        title={
          <span style={{ fontSize: 24 }}>
            {activeData?.activityName || "-"}
          </span>
        }
        after={<div className="progress-in">进行中</div>}
        textLength={activeData?.activityName?.length}
      />
      <div className="info-list-wrap">
        <div className="info-item">
          <img src={timeUrl} alt="" />
          <span>
            {formatDate(new Date(activeData?.startTime || 0), "yyyy-MM-dd")} 至{" "}
            {formatDate(new Date(activeData?.endTime || 0), "yyyy-MM-dd")}
          </span>
        </div>
        <div className="info-item">
          <div className="info-item-li">
            <img src={fjUrl} alt="" />
            <span>{activeData?.mainDeptName || "-"}</span>
          </div>
          <div className="info-item-li" style={{ marginLeft: 40 }}>
            <img src={rsUrl} alt="" />
            <span>
              <label>{activeData?.personNumber || 0}</label>人
            </span>
          </div>
        </div>
      </div>
      <div className="arrange-wrap">
        <RadioGroup
          type="button"
          name="lang"
          className={"home-radio-group"}
          value={arrangeValue}
          options={arrangeList}
          onChange={setArrangeValue}
          style={{ marginBottom: 2, marginTop: 5 }}
        ></RadioGroup>
        <PoliceDeployment arrangeValue={arrangeValue} />
        <DefDeployment arrangeValue={arrangeValue} />
        <PerceptionDevice arrangeValue={arrangeValue} />
      </div>
    </div>
  );
};
const ObserverRightSide = observer(RightSide);
export default ObserverRightSide;
