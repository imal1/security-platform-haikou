import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import store from "../store";
import { Modal } from "@arco-design/web-react";
import styles from "../index.module.less";
import { formatDate } from "kit";
import classNames from "classnames";

const Info = () => {
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    try {
    } catch (error) {}
  };
  const onCancel = () => {
    store.modalInfoVisible = false;
  };
  const { modalInfoVisible, current } = store;
  return (
    <Modal
      title={"活动详情"}
      visible={modalInfoVisible}
      className={classNames("security-modal", styles["activity-manage-modal"])}
      onCancel={onCancel}
      autoFocus={false}
      focusLock={false}
      footer={null}
    >
      <div className="activity-manage-info-con">
        {current?.camera_list?.map((item, index) => (
          <div className="item-li" key={index}>
            <div className="item-label">设备国标ID</div>
            <div className="item-value">{item.deviceID}</div>
          </div>
        ))}
        <div className="item-li">
          <div className="item-label">预调时段</div>
          <div className="item-value">
            {formatDate(current?.start_time, "yyyy-MM-dd hh:mm")} ~{" "}
            {formatDate(current?.end_time, "yyyy-MM-dd hh:mm")}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default observer(Info);
