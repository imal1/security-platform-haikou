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
      await store.initialData();
    } catch (error) {}
  };
  const onDel = async (row) => {
    // Modal.info({
    //   title: "提示",
    //   content: "活动正在进行中，不可删除！",
    // });
    Modal.confirm({
      title: "确定删除该条活动数据？",
      content: "删除后数据不可恢复，活动下的方案数据将同步被清除。",
      closable: true,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        // await store.deleteVideoFusion(row.id);
        // store.clearPager();
        // await getList();
      },
    });
  };

  return (
    <div className={classNames("activity-con", "public-scrollbar")}>
      <div className="activity-item">
        <div className="activity-thumbnail">
          <img src="" alt="" />
        </div>
        <div className="activity-right">
          <div className="activity-title">6月消博会</div>
          <Button
            type="default"
            icon={<IconDelete />}
            className={"activity-del"}
            size="small"
            onClick={() => {
              onDel({});
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
                  <div className="info-value">会展中心</div>
                </div>
                <div className="activity-info-li">
                  <div className="info-label">
                    <Icon type="anbao-type" />
                    活动类型
                  </div>
                  <div className="info-value">会展中心</div>
                </div>
              </div>
              <div className="activity-info-list">
                <div className="activity-info-li">
                  <div className="info-label">
                    <Icon type="anbao-date" />
                    举办时间
                  </div>
                  <div className="info-value">会展中心</div>
                </div>
                <div className="activity-info-li">
                  <div className="info-label">
                    <Icon type="anbao-unit" />
                    举办单位
                  </div>
                  <div className="info-value">会展中心</div>
                </div>
              </div>
              <div className="activity-info-list">
                <div className="activity-info-li">
                  <div className="info-label" style={{ width: 110 }}>
                    <Icon type="anbao-grade" />
                    活动安保等级
                  </div>
                  <div className="info-value">
                    <div className="level height">高</div>
                    {/* <div className="level middle">中</div> */}
                    {/* <div className="level low">低</div> */}
                  </div>
                </div>
                <div className="activity-info-li">
                  <div className="info-label" style={{ width: 110 }}>
                    <Icon type="anbao-state" />
                    活动状态
                  </div>
                  <div className="info-value">
                    <div className="status inProgress">
                      <img src={startUrl} />
                      <span>进行中</span>
                    </div>
                    {false && (
                      <>
                        <div className="status end">
                          <img src={endUrl} />
                          <span>已结束</span>
                        </div>
                        <div className="status noStart">
                          <img src={noStartUrl} />
                          <span>未开始</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="activity-btn-wrap">
              <Button
                type="default"
                onClick={() => {
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
              >
                编辑活动
              </Button>
              <Button
                type="default"
                className={"copy-btn"}
                style={{ marginLeft: 15 }}
              >
                复制活动
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(List);
