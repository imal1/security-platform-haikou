import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import store from "../store";
import { Grid, Empty } from "@arco-design/web-react";
import { formatDate } from "@/kit";
import totalPeople from "@/assets/img/home/total-people.png";
import mfjIcon from "@/assets/img/home/mfj.png";
import wjIcon from "@/assets/img/home/wj.png";
import jjIcon from "@/assets/img/home/jj.png";
import ctllIcon from "@/assets/img/home/ctll.png";
import noDataUrl from "@/assets/img/no-data/no-data.png";
import typeLine from "@/assets/img/home/type-line.png";
import fjUrl from "@/assets/img/home/right-fj.png";
import rsUrl from "@/assets/img/home/right-rs.png";
import timeUrl from "@/assets/img/home/right-time.png";
import IPC_1URL from "@/assets/img/home/left-box/IPC_1.png";
import IPC_3URL from "@/assets/img/home/left-box/IPC_3.png";
import PADURL from "@/assets/img/home/left-box/PAD.png";
import PTTURL from "@/assets/img/home/left-box/PTT.png";
import BWCURL from "@/assets/img/home/left-box/BWC.png";
import Title from "../component/title";
const { Row, Col } = Grid;

interface LeftBoxProps {
  style?: React.CSSProperties;
}
const LeftSide = (props:LeftBoxProps) => {
  const {style} = props;
  const devicePIcObj = {
    IPC_1: IPC_1URL,
    IPC_3: IPC_3URL,
    PAD: PADURL,
    PTT: PTTURL,
    BWC: BWCURL,
  };
  const [peopleTypeList, setPeopleTypeList] = useState([
    { label: "民警", value: "民警", num: "540", icon: mfjIcon },
    { label: "辅警", value: "辅警", num: "540", icon: mfjIcon },
    { label: "特警", value: "特警", num: "233", icon: ctllIcon },
    { label: "交警", value: "交警", num: "105", icon: jjIcon },
    { label: "武警", value: "武警", num: "233", icon: wjIcon },
  ]);
  const deviceTotal = useMemo(() => {
    const nums = store.deviceAtatisticsData.map((item) => item.count);
    const count = nums.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return count;
  }, [store.deviceAtatisticsData]);
  const {
    icons,
    wfStatisticsData,
    deviceAtatisticsData,
    drawCodes,
    activeData,
    workGroupData,
  } = store;
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
      <Title title="警力部署" style={{ marginTop: 14 }} />
      {workGroupData["总人数"] === 0 && (
        <>
          <div style={{ height: 200 }}>
            <Empty
              className={"no-data-jingli"}
              imgSrc={noDataUrl}
              description="暂无警力部署"
            />
          </div>
        </>
      )}

      {workGroupData["总人数"] > 0 && (
        <>
          <div className="total-people-wrap">
            <img src={totalPeople} alt="" />
            <div className="people-count">
              <span>
                {workGroupData["总人数"]}
                {/* <label>名</label> */}
              </span>
              <label htmlFor="">总人数</label>
            </div>
          </div>
          <Row gutter={8} style={{ paddingLeft: 6, maxWidth: "100%" }}>
            {peopleTypeList.map((item) => (
              <Col
                span={8}
                className="people-type-item"
                key={item.value}
                style={{ display: workGroupData[item.value] ? "flex" : "none" }}
              >
                <img src={item.icon} alt="" className="pic" />
                <div className="con">
                  <div className="name">{item.label}</div>
                  <img src={typeLine} alt="" />
                  <div className="count">
                    {workGroupData[item.value] || 0}
                    <span>名</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Title title="物防部署" style={{ marginBottom: 14, marginTop: 10 }} />
      <Row
        gutter={16}
        className={"public-scrollbar"}
        style={{
          paddingLeft: 6,
          paddingRight: 10,
          maxWidth: "100%",
          flex: 1,
          overflowY: "auto",
          alignContent: "start",
        }}
      >
        {wfStatisticsData.map((item) => (
          <Col span={12} key={item.featureCode}>
            <div className="wf-type-item">
              <div className="pic">
                <img
                  src={icons[item.featureCode]}
                  alt=""
                  style={{
                    width: drawCodes.includes(item.featureCode) ? 30 : 38,
                  }}
                />
              </div>

              <div className="con">
                <div className="name">{item.featureName}</div>
                <div className="line"></div>
                <div className="count">{item.count}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Title
        title="感知设备"
        style={{ marginTop: 5 }}
        after={
          <div className="tit-num">
            <span>{deviceTotal}</span>台
          </div>
        }
      />
      <div className="gzsb-wrap public-scrollbar">
        {deviceAtatisticsData.map((item) => (
          <div className="gzsb-item" key={item.deviceType}>
            <div className="gzsb-item-num">{item.count}</div>
            <div className="gzsb-item-con">
              <img src={devicePIcObj[item.deviceType]} />
            </div>
            <div className="gzsb-item-label">{item.deviceTypeName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
const ObserverLeftSide = observer(LeftSide);
export default ObserverLeftSide;
