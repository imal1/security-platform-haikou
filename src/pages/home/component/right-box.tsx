import React from "react";
import { observer } from "mobx-react";
import store from "../store";

interface RightBoxProps {
  children?: React.ReactNode;
}
const RightBox = (props: RightBoxProps) => {
  const { children = "" } = props;
  const { rightVisible } = store;

  return (
    <div className={`right-box-wrap ${!rightVisible ? "hide" : ""}`}>
      <div
        className="shrink-btn"
        onClick={() => {
          store.rightVisible = !rightVisible;
        }}
      ></div>
      <div className="left-box-header">
        <div className="top1"></div>
        <div className="top2"></div>
        <div className="top3"></div>
      </div>
      <div className="right-box-con">{children}</div>
    </div>
  );
};
const ObserverRightBox = observer(RightBox);
export default ObserverRightBox;
