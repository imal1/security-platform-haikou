import { Grid, Modal } from "@arco-design/web-react";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useEffect } from "react";
import styles from "../index.module.less";
import store from "../store";
const { Row, Col } = Grid;
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
      <Row className="activity-manage-info-con" gutter={30}>
        <Col span={19}>
          <Row gutter={35}>
            <Col span={12}>
              <div className="item-li">
                <div className="item-label">活动名称</div>
                <div className="item-value">2024海口市国际消费品博览会</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="item-li">
                <div className="item-label">活动举办时间</div>
                <div className="item-value">2025-04-10 ～ 2025-04-18</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="item-li">
                <div className="item-label">活动场景</div>
                <div className="item-value">2024海口市国际消费品博览会</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="item-li">
                <div className="item-label">活动类型</div>
                <div className="item-value">政治性活动</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="item-li">
                <div className="item-label">活动人员规模</div>
                <div className="item-value">30000人以上</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="item-li">
                <div className="item-label">活动所属行政区域</div>
                <div className="item-value">海口市秀英区</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="item-li">
                <div className="item-label">所属辖区责任单位</div>
                <div className="item-value">30000人以上</div>
              </div>
            </Col>

            <Col span={12}>
              <div className="item-li">
                <div className="item-label">活动安保等级</div>
                <div className="item-value">高</div>
              </div>
            </Col>
            <Col span={24}>
              <div className="item-li">
                <div className="item-label">活动描述</div>
                <div className="item-value">2024海口市国际消费品博览会</div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={5}>
          <div className="pic">
            <img src="" alt="" />
          </div>
        </Col>
        <Col span={24}>
          <div className="item-li">
            <div className="item-label">活动举办方信息</div>
            <div className="item-value">
              <div className="organizer-header">
                <div className="organizer-header-th">举办方类型</div>
                <div className="organizer-header-th">是否主责任单位</div>
                <div className="organizer-header-th">举办单位名称</div>
                <div className="organizer-header-th">举办方联系人姓名</div>
                <div className="organizer-header-th">举办方联系电话</div>
              </div>
              <div className="organizer-body">
                <div className="organizer-td">s</div>
                <div className="organizer-td">ew</div>
                <div className="organizer-td">ew</div>
                <div className="organizer-td">ewe</div>
                <div className="organizer-td">ewew</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default observer(Info);
