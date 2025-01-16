import { Modal, Grid } from "@arco-design/web-react";
import { ReactNode, useEffect, useState } from "react";
import { TitleBar } from "../../../components";
import {
  IconLocation,
  IconPhone,
  IconPlayCircle,
} from "@arco-design/web-react/icon";
import "./index.less";
import DefaultPolice from "@/assets/img/home/police.png";
import { observer } from "mobx-react";
import store from "../store";
import appStore from "@/store";
import { imgOnError } from "@/kit";
const { Row, Col } = Grid;

interface ResponseModalProps {
  visible: boolean;
  data: Array<any>;
  setVisible: (val) => void;
}
const ResponseModal = (props: ResponseModalProps) => {
  const { data = [], setVisible, visible = false } = props;
  const oprateRow = (params: {
    title: string;
    content: string;
    flag?: boolean;
    oprateIcon?: ReactNode;
    oprateLabel?: string;
    oprateFunc?: any;
  }) => {
    const { title, content, flag, oprateIcon, oprateLabel, oprateFunc } =
      params;
    return (
      <Row gutter={[14, 20]}>
        <Col flex="90px">
          <div className="person-detail-title">{title}</div>
        </Col>
        <Col style={{ flex: "1" }}>
          <div className="police-info">
            <Row gutter={20}>
              <Col style={{ flex: "1" }}>
                <div title={content}>{content}</div>
              </Col>
              <Col flex="100px">
                {
                  <div
                    className="control-button"
                    onClick={(evt) => {
                      // TODO: 调阅画面
                      // deviceInfo(store.policeInfo);
                      evt.stopPropagation();
                      oprateFunc && oprateFunc();
                    }}
                  >
                    <Row style={{ cursor: "pointer" }}>
                      <Col flex="30px">
                        {/* <IconPhone className="control-icon" /> */}
                        {oprateIcon}
                      </Col>
                      <Col style={{ flex: "1" }}>
                        <span className="control-label">{oprateLabel}</span>
                      </Col>
                    </Row>
                  </div>
                }
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  };

  const oprateRowSimple = (params: { title: string; content: string }) => {
    const { title, content } = params;
    return (
      <Row gutter={[14, 20]} className={"police-row"}>
        <Col flex="90px">
          <div className="person-detail-title">{title}</div>
        </Col>
        <Col style={{ flex: "1" }}>{content}</Col>
      </Row>
    );
  };

  return (
    <>
      <Modal
        title="责任区信息"
        style={{ height: "auto", maxHeight: "641px" }}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        mask={false}
        footer={null}
      >
        <div className="modal-content-wrap public-scrollbar">
          {data?.length > 0 && (
            <>
              <TitleBar>人员信息</TitleBar>
              {data.map((item) => (
                <div className="person-info" key={item.id}>
                  <div className="response-wrap">
                    <img
                      className="response-police"
                      src={item.picUrl || DefaultPolice}
                      width={158}
                      height={206}
                      onError={(e) => imgOnError(e, DefaultPolice)}
                    />
                    <div className="response-frame"></div>
                  </div>
                  <div className="person-detail">
                    {oprateRowSimple({
                      title: "责任单位",
                      content: item.orgCodeName || "-",
                    })}
                    {oprateRow({
                      title: "组长",
                      content: item.groupLeaderName || "-",
                      oprateLabel: item.gbid ? "通话" : "",
                      oprateIcon: item.gbid ? (
                        <IconPhone className="control-icon" />
                      ) : (
                        ""
                      ),
                      oprateFunc: () => {
                        store.callVisible = true;
                        store.addOrInvite = 0;
                        store.callTitle = "通话组会";
                        store.selectedMembers = [
                          { ...item, type: item.deviceType },
                        ];
                      },
                    })}
                    {oprateRowSimple({
                      title: "岗位",
                      content: item.situation || "-",
                    })}
                    {oprateRow({
                      title: "对讲机",
                      content: item.devicePttName || "无",
                      oprateLabel: item.devicePttName ? "定位" : "",
                      oprateIcon: item.devicePttName ? (
                        <IconLocation className="control-icon" />
                      ) : (
                        ""
                      ),
                      oprateFunc: () => {
                        appStore.getLayerServiceQuery(
                          item.devicePttCode,
                          store.viewer
                        );
                      },
                    })}
                    {oprateRow({
                      title: "执法仪",
                      content: item.deviceBwcName || "无",
                      oprateLabel: item.deviceBwcName ? "调阅" : "",
                      oprateIcon: item.deviceBwcName ? (
                        <IconPlayCircle className="control-icon" />
                      ) : (
                        ""
                      ),
                      oprateFunc: () => {
                        store.changeState({
                          deviceVisible: true,
                          deviceCurrent: { gbid: item.deviceBwcCode },
                          onlyPlay: true,
                        });
                      },
                    })}
                    {oprateRowSimple({
                      title: "警务通",
                      content: item.devicePadName || "无",
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
          {data?.some((item) => item.taskContent) && (
            <>
              <TitleBar>任务内容</TitleBar>
              {data
                .filter((item) => item.taskContent)
                .map((row) => (
                  <div className="modal-content">{row.taskContent}</div>
                ))}
            </>
          )}

          {data?.some((item) => item.mainJob) && (
            <>
              <TitleBar>工作职责</TitleBar>
              {data
                .filter((item) => item.mainJob)
                .map((item) => (
                  <div className="modal-content">{item.mainJob}</div>
                ))}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default observer(ResponseModal);
