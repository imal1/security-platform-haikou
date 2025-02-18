import { Icon } from "@/components";
import { Button } from "@arco-design/web-react";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useEffect } from "react";
import store from "../store";

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
    <div className={classNames("activity-plan-con", "public-scrollbar")}>
      <div className="plan-item">
        <div className="plan-title">6月消博会</div>
        <div className="plan-thumbnail">
          <img src="" alt="" />
        </div>
        <div className="plan-info-wrap">
          <div className="plan-info">
            <div className="plan-info-item">
              <Icon type="anbao-date" />
              <span>2025-05-06 至 2025-05-20</span>
            </div>
          </div>
          <div className="plan-info">
            <div className="plan-info-item">
              <Icon type="anbao-scene" />
              <span>活动场景</span>
            </div>
            <div className="plan-info-item">
              <Icon type="anbao-people" />
              <span>2000人</span>
            </div>
          </div>
        </div>

        <div className="plan-btn">
          <Button type="default" size="small" className={"info-btn mr-[10px]"}>
            方案部署
          </Button>
          <Button type="default" size="small" className={"edit-btn"}>
            活动态势
          </Button>
        </div>
      </div>
    </div>
  );
};

export default observer(List);
