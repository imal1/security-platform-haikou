import { Icon } from "@/components";
import appStroe from "@/store";
import { Button } from "@arco-design/web-react";
import classNames from "classnames";
import { imgOnError, microAppHistory } from "kit";
import { observer } from "mobx-react";
import store from "../store";
import sceceImg from "@/assets/img/scene-img.png"

const List = () => {
  const { dataSource } = store;
  return (
    <div className={classNames("activity-plan-con", "public-scrollbar")}>
      {dataSource.map((item) => (
        <div className="plan-item" key={item.id}>
          <div className="plan-title">{item.activityName}</div>
          <div className="plan-thumbnail">
            <img
              src={`${window.globalConfig["BASE_URL"]}${item.activityThumbnail}`}
              onError={(e) => imgOnError(e,sceceImg)}
              alt=""
            />
          </div>
          <div className="plan-info-wrap">
            <div className="plan-info">
              <div className="plan-info-item">
                <Icon type="anbao-date" />
                <span>
                  {item.startDayStr}至{item.finishDayStr}
                </span>
              </div>
            </div>
            <div className="plan-info">
              <div className="plan-info-item">
                <Icon type="anbao-scene" />
                <span>{item.sceneName}</span>
              </div>
              <div className="plan-info-item">
                <Icon type="anbao-people" />
                <span>{item.personSizeName}</span>
              </div>
            </div>
          </div>

          <div className="plan-btn">
            <Button
              type="default"
              size="small"
              className={"info-btn mr-[10px]"}
              onClick={() => {
                appStroe.setActivityInfo({
                  eventId: item.id,
                  venueId: item.sceneId,
                  solution: item.sceneServiceCode,
                });
                microAppHistory.push("/place_manage");
              }}
            >
              方案部署
            </Button>
            <Button
              type="default"
              size="small"
              className={"edit-btn"}
              onClick={() => {
                appStroe.setActivityInfo({
                  eventId: item.id,
                  venueId: item.sceneId,
                  solution: item.sceneServiceCode,
                });
                microAppHistory.push("/security_platform");
              }}
            >
              活动态势
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default observer(List);
