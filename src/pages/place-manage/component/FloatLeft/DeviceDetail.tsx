import styles from "./DeviceDetail.module.less";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Grid } from "@arco-design/web-react";
import store from "../../store/index";
import Container from "../plan/Container";

const { Row, Col } = Grid;

const lineStatus = [
  {
    label: "在线",
    value: "ON",
  },
  {
    label: "离线",
    value: "OFF",
  },
  {
    label: "故障",
    value: "GUZHANG",
  },
];

const DeviceDetail = () => {
  const { selectedDevice } = store;

  const status = useMemo(() => {
    return lineStatus.find((v) => v.value === "ON");
  }, []);

  const onCancel = () => {
    store.changeState({ selectedDevice: null });
  };

  return (
    <Container
      className={styles["device-detail"]}
      title={"设备详情"}
      onClose={onCancel}
    >
      <Row>
        <Col span={5}>设备名称</Col>
        <Col span={18}>{selectedDevice?.deviceName}</Col>
      </Row>
      <Row>
        <Col span={5}>国际ID</Col>
        <Col span={18}>{selectedDevice?.gbid}</Col>
      </Row>
      <Row>
        <Col span={5}>设备类型</Col>
        <Col span={18}>球机</Col>
      </Row>
      <Row>
        <Col span={5}>设备状态</Col>
        <Col span={18}>{status?.label}</Col>
      </Row>
      <Row>
        <Col span={5}>视频调阅</Col>
        <Col span={18} className="player">
          播放
        </Col>
      </Row>
    </Container>
  );
};

export default observer(DeviceDetail);
