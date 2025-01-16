import React from "react";
import { observer } from "mobx-react";
import store from "../store";
interface LeftBoxProps {
    children?: React.ReactNode;
    tab?: React.ReactNode;
}
const LeftBox = (props: LeftBoxProps) => {
    const { children = "", tab = "" } = props;

    return (
        <div className={`left-box-wrap ${!store.leftVisible ? "hide" : ""}`} style={{ display: store.leftPanelVisible ? "block" : "none" }}>
            <div
                className="shrink-btn"
                onClick={() => {
                    store.leftVisible = !store.leftVisible;
                    console.log("store.leftVisible: ", store.leftVisible);
                }}
            ></div>
            {tab}
            <div className="left-box-header">
                <div className="top1"></div>
                <div className="top2"></div>
                <div className="top3"></div>
            </div>
            <div className="left-box-con">{children}</div>
        </div>
    );
};
const ObserverleftBox = observer(LeftBox);
export default ObserverleftBox;
