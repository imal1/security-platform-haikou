import { observer } from "mobx-react";
import { Form, Grid, Input, Modal, Message, Radio, Select } from "@arco-design/web-react";
import Draggable from "react-draggable";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
const { Row, Col } = Grid;
import store from "../store";
import * as webApi from "../store/policeRemarkApi";


import { debounce } from "lodash";
import { IconDown, IconUp } from "@arco-design/web-react/icon";
const RadioGroup = Radio.Group;
interface AddModifyPoliceRemarkProps {
  visible?: boolean;
  data?: Array<any>;
  setVisible: (val) => void;
}
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AddModifyPoliceRemark = (props: AddModifyPoliceRemarkProps) => {
  const { data = [], setVisible, visible = false } = props;
  const { selectedPoliceRemark } = store; // 编辑的时候用到的
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    const values = await form.validate().catch((err) => {
      console.log(err);
      setIsSaving(false);
    });
    if (values) {
      let api = selectedPoliceRemark.id ? webApi.editPoliceRemark : webApi.addPoliceRemark;
      const { position, geometry, planId, venueId, id } = selectedPoliceRemark;
      api({
        ...values,
        position,
        geometry,
        planId,
        venueId,
        id //编辑的时候会保存
      }).then(res => {
        setIsSaving(false);
        Message.success("保存成功");
        // 点击确定则保存警情标注并关闭责任区弹窗、新增警情弹窗、图上责任区范围也清空
        store.homePoliceRemarkVisible = false;
        store.homeSecurityInfoVisible = false;
        // 左侧面板切换为警情标注，列表新增一条警情标注数据，详情描述见下一页。
        store.leftVisible = true;
        //绘制刚才新增的警情标注点
        store.latestSavedPoliceRemark = {
          id: selectedPoliceRemark.id,
          position: selectedPoliceRemark.position
        };
        // 打开警情列表的tab
        store.homeLeftSideActive = "2";
        // 编辑完成之后更新列表数据
        store.policeRemarkRefresh = true;
        // 清掉设备
        store.removeDeviceLayer("toolDevice");
        // store.removeAllFeature();
        store.policeMarkLinkFeatures && store.featureDiagram(store.policeMarkLinkFeatures, false, () => {
          store.policeMarkLinkFeatures = null;
        })
        // if(res === 1){

        // }else{
        //   Message.error("保存失败");
        // }
      }).catch(() => {
        setIsSaving(false);
        Message.error("保存失败");
      })
    }
  };
  // 拿到form的数据 values- {name: '', xxx: ''}
  useEffect(() => {
    if (visible) {
      const { policeRemarkTypeEnum } = store;
      if (!policeRemarkTypeEnum.length) {
        webApi.policeTypeEnum().then(res => {
          if (res) {
            store.policeRemarkTypeEnum = Object.keys(res).map(key => {
              return {
                label: res[key],
                value: key
              }
            }) || [];
          }
        })
      }
    } else {
      store.removeSecurityAreaFeature();
    }
  }, [visible]);
  const oprateRowSimple = (params: { title: string; content: string }) => {
    const { title, content } = params;
    return (
      <Row gutter={[0, 20]} className={"police-row"}>
        <Col flex="105px">
          <div className="person-detail-title">{title}</div>
        </Col>
        <Col style={{ flex: "1", fontWeight: 500 }}>
          <div className="person-detail-content">
            {content}
          </div>
        </Col>
      </Row>
    );
  };


  // 警情类别 value-》label
  const getTypeName = (type) => {
    if (store?.policeRemarkTypeEnum?.length) {
      const obj = store.policeRemarkTypeEnum.find(i => i.value === type);
      return obj?.label || '';
    }
    return '';
  };

  return (
    <Modal
      style={{
        cursor: "move",
        top: store.homeSecurityInfoVisible ? 461 : 100,
        right: 20,
        margin: 0,
        position: "fixed",
        width: "388px"
      }}
      title={selectedPoliceRemark?.id ? (selectedPoliceRemark?.readOnly ? "警情详情" : "编辑警情") : '新增警情'}
      visible={visible}
      onCancel={() => {
        store.homeSecurityInfoVisible = false;
        //  新增取消的时候要清除设备
        !selectedPoliceRemark?.id && store.removeDeviceLayer("toolDevice");
        !isSaving ? setVisible(false) : null;
        // 固定到警情列表
        store.homeLeftSideActive = "2";
        // store.removeAllFeature();
        store.policeMarkLinkFeatures && store.featureDiagram(store.policeMarkLinkFeatures, false, () => {
          store.policeMarkLinkFeatures = null;
        })
      }}
      okText="保存"
      onOk={debounce(handleSave, 600)}
      confirmLoading={isSaving}
      autoFocus={true}
      focusLock={true}
      mask={false}
      afterClose={() => { }}
      className={selectedPoliceRemark?.readOnly ? "add-modify-police-remark hidden-footer" : "add-modify-police-remark"}
      unmountOnExit={true}
      modalRender={(modal) => <Draggable bounds="parent" cancel={".arco-form-item-control-children"}>{modal}</Draggable>}
    >
      {
        selectedPoliceRemark?.readOnly && (
          <div className="security-info-modal-wrap " key={"secu"}>
            <div className="security-info-content public-scrollbar">
              <div className="person-info" >
                <div className="person-detail">
                  {oprateRowSimple({
                    title: "警情名称",
                    content: selectedPoliceRemark.name
                  })}
                  {oprateRowSimple({
                    title: "警情类别",
                    content: getTypeName(selectedPoliceRemark.type) || '-'
                  })}
                  {oprateRowSimple({
                    title: "警情描述",
                    content: selectedPoliceRemark.description || '-'
                  })}
                  {oprateRowSimple({
                    title: "警情发生地",
                    content: selectedPoliceRemark.address || '-'
                  })}
                  {oprateRowSimple({
                    title: "警情发生时间",
                    content: selectedPoliceRemark.createdTime
                  })}
                  {oprateRowSimple({
                    title: "警情处理状态",
                    content: store.policeRemarkStatusNameEnum[selectedPoliceRemark.dealStatus]
                  })}
                  {oprateRowSimple({
                    title: "处理情况描述",
                    content: selectedPoliceRemark.dealDescription || '-'
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      }
      {
        !selectedPoliceRemark?.readOnly && (
          <Form
            className={"attr-from public-scrollbar"}
            initialValues={selectedPoliceRemark}
            form={form}
            labelAlign="left"
            size="large"
            {...formItemLayout}
          >
            <Form.Item
              label={"警情名称"}
              field="name"
              rules={[
                {
                  required: true,
                  maxLength: 30,
                  message: "请输入30个字符以内的警情名称！",
                },
              ]}
            >
              <Input placeholder="请输入警情名称" allowClear />
            </Form.Item>

            <Form.Item
              label={"警情类别"}
              field="type"
            >
              <Select
                placeholder="请选择警情类型"
                showSearch={{ retainInputValue: true }}
                filterOption={(inputValue, option) =>
                  option.props.children.indexOf(inputValue) >= 0
                }
                getPopupContainer={() =>
                  document.querySelector(".attr-from")
                }
                options={store.policeRemarkTypeEnum}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label={"警情描述"}
              field="description"
              rules={[{ maxLength: 200, message: "请输入200个字符以内的警情描述！" }]}
            >
              <Input.TextArea placeholder="请输入" rows={2} allowClear />
            </Form.Item>

            <Form.Item label={"警情发生地"} field="address">
              <div>{selectedPoliceRemark?.address || '-'}</div>
            </Form.Item>

            {/*编辑和查看的时候再呈现*/}
            {selectedPoliceRemark?.id && (
              <Form.Item label={"警情发生时间"} field="createdTime">
                <div>{selectedPoliceRemark?.createdTime}</div>
              </Form.Item>
            )}
            <Form.Item
              label={"警情处理状态"}
              field="dealStatus"
            >
              <RadioGroup >
                {store?.policeRemarkStatusEnum?.map((item, index) => (
                  <Radio key={index} value={item.value}>{item.label}</Radio>
                ))}
              </RadioGroup>
            </Form.Item>
            <Form.Item
              label={"处理情况描述"}
              field="dealDescription"
              rules={[{ maxLength: 200, message: "请输入200个字符以内的处理情况描述！" }]}
            >
              <Input.TextArea placeholder="请输入" rows={2} allowClear />
            </Form.Item>
          </Form>
        )
      }
    </Modal>
  );
};

export default observer(AddModifyPoliceRemark);
