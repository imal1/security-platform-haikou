import endUrl from "@/assets/img/activity-manage/end.png";
import noStartUrl from "@/assets/img/activity-manage/no-start.png";
import startUrl from "@/assets/img/activity-manage/start.png";
import { Icon } from "@/components";
import { Button, Modal } from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useEffect } from "react";
import store from "../store";
// import styles from "../index.module.less";

const List = () => {
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    try {
    } catch (error) {}
  };
  const onDel = async (row) => {
    if (row.activityStatus == "进行中") {
      Modal.info({
        title: "提示",
        content: "活动正在进行中，不可删除！",
        closable: true,
      });
    } else {
      Modal.confirm({
        title: "确定删除该条活动数据？",
        content: "删除后数据不可恢复，活动下的方案数据将同步被清除。",
        closable: true,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          await store.deleteActivity(row.id);
        },
      });
    }
  };
  const { dataSource, isCopy } = store;
  return (
    <div className={classNames("activity-con", "public-scrollbar")}>
      {dataSource.map((item) => (
        <div className="activity-item" key={item.id}>
          <div className="activity-thumbnail">
            <img
              src={`${window.globalConfig["BASE_URL"]}${item.activityThumbnail}`}
              alt=""
            />
          </div>
          <div className="activity-right">
            <div className="activity-title">{item.activityName}</div>
            <Button
              type="default"
              icon={<IconDelete />}
              className={"activity-del"}
              size="small"
              onClick={() => {
                onDel(item);
              }}
            >
              删除
            </Button>
            <div className="activity-item-con">
              <div className="activity-info-wrap">
                <div className="activity-info-list">
                  <div className="activity-info-li">
                    <div className="info-label">
                      <Icon type="anbao-scene" />
                      活动场景
                    </div>
                    <div className="info-value">{item.sceneName}</div>
                  </div>
                  <div className="activity-info-li">
                    <div className="info-label">
                      <Icon type="anbao-type" />
                      活动类型
                    </div>
                    <div className="info-value">{item.activityTypeName}</div>
                  </div>
                </div>
                <div className="activity-info-list">
                  <div className="activity-info-li">
                    <div className="info-label">
                      <Icon type="anbao-date" />
                      举办时间
                    </div>
                    <div className="info-value">
                      {item.startDayStr}至{item.finishDayStr}
                    </div>
                  </div>
                  <div className="activity-info-li">
                    <div className="info-label">
                      <Icon type="anbao-unit" />
                      举办单位
                    </div>
                    <div className="info-value">
                      {item?.organizerList?.length > 0
                        ? item.organizerList
                            .map((child) => child.organizerName)
                            .join()
                        : "-"}
                    </div>
                  </div>
                </div>
                <div className="activity-info-list">
                  <div className="activity-info-li">
                    <div className="info-label" style={{ width: 110 }}>
                      <Icon type="anbao-grade" />
                      活动安保等级
                    </div>
                    <div className="info-value">
                      {item.securityLevelName == "高" && (
                        <div className="level height">高</div>
                      )}
                      {item.securityLevelName == "中" && (
                        <div className="level middle">中</div>
                      )}
                      {item.securityLevelName == "低" && (
                        <div className="level low">低</div>
                      )}
                    </div>
                  </div>
                  <div className="activity-info-li">
                    <div className="info-label" style={{ width: 110 }}>
                      <Icon type="anbao-state" />
                      活动状态
                    </div>
                    <div className="info-value">
                      {item.activityStatus == "未开始" && (
                        <div className="status noStart">
                          <img src={noStartUrl} />
                          <span>未开始</span>
                        </div>
                      )}
                      {item.activityStatus == "进行中" && (
                        <div className="status inProgress">
                          <img src={startUrl} />
                          <span>进行中</span>
                        </div>
                      )}
                      {item.activityStatus == "已结束" && (
                        <div className="status end">
                          <img src={endUrl} />
                          <span>已结束</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="activity-btn-wrap">
                <Button
                  type="default"
                  onClick={async () => {
                    await store.getActivityInfo(item.id);
                    store.changeState({
                      modalInfoVisible: true,
                    });
                  }}
                  className={"info-btn"}
                >
                  查看详情
                </Button>
                <Button
                  type="primary"
                  className={"edit-btn"}
                  style={{ marginLeft: 15 }}
                  onClick={async () => {
                    await store.getActivityInfo(item.id);
                    store.changeState({
                      modalVisible: true,
                    });
                  }}
                >
                  编辑活动
                </Button>
                <Button
                  type="default"
                  className={"copy-btn"}
                  style={{ marginLeft: 15 }}
                  onClick={async () => {
                    await store.getActivityInfo(item.id);
                    store.changeState({
                      isCopy: true,
                      modalVisible: true,
                    });
                  }}
                >
                  复制活动
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default observer(List);
