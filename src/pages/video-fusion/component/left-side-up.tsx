import { observer } from "mobx-react";
import Title from "../../home/component/title";
import { Checkbox } from "@arco-design/web-react";
import React, { useState } from "react";

import store, { pointsInfo } from "../store";
import classNames from "classnames";

// const options = pointsInfo;

const LeftSideUp = () => {
  const [active, setActive] = useState("");
  return (
    <>
      <Title title="融合点位" style={{ marginBottom: 4 }} />
      {/* <Checkbox
        className={"video-item"}
        checked
        onClick={() => {
          store.handlePointClick(0);
        }}
      >
        会展中心会标背后山坡
      </Checkbox> */}
      {store.routePointsInfo?.map((item) => {
        return (
          <div
            style={{ position: "relative", width: "100%" }}
            className={classNames(
              "video-item-li",
              active == item.value && "active"
            )}
            onClick={() => {
              setActive(item.value);
              console.log(store.allPoints, "store.allPoints");

              store.stopAllVideoFusion(store.allPoints);
              store.handlePointClick(item);
            }}
          >
            <div className={"video-item"}>{item.label}</div>
            {/* {item.label && (
              <Checkbox
                className={"video-item"}
                onChange={(e) => {
                  
                  store.handleCheckClick(e, item);
                }}
                defaultChecked={true}
              >
                {item.label}
              </Checkbox>
            )} */}
          </div>
        );
      })}
    </>
  );
};

export default observer(LeftSideUp);
