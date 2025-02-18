import { Button } from "@arco-design/web-react";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useEffect } from "react";
import store from "../store";
import styles from "./index.module.less";

const List = () => {
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    try {
      await store.initialData();
    } catch (error) {}
  };
  return (
    <div
      className={classNames(styles["activity-plan-con"], "public-scrollbar")}
    >
      <div className="plan-item">
        <div className="plan-title">6月消博会</div>
        <div className="plan-thumbnail">
          <img src="" alt="" />
        </div>
        <div className="plan-info"></div>
        <div className="plan-info">
          <div className="plan-info-item"></div>
          <div className="plan-info-item"></div>
        </div>
        <div className="plan-btn">
          <Button type="default">方案部署</Button>
          <Button type="default">活动态势</Button>
        </div>
      </div>
    </div>
  );
};

export default observer(List);
