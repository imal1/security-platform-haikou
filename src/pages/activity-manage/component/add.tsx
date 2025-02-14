import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Grid,
  Input,
  Message,
  Modal,
  Select,
  TreeSelect,
  Upload,
} from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import classNames from "classnames";
import dayjs from "dayjs";
import { regExp } from "kit";
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import styles from "../index.module.less";
import store from "../store";
const { RangePicker } = DatePicker;
const { Row, Col } = Grid;

const FormItem = Form.Item;
const treeData = [
  {
    title: "Trunk 0-0",
    value: "Trunk 0-0",
    key: "0-0",
    children: [
      {
        title: "Branch 0-0-1",
        value: "Branch 0-0-1",
        key: "0-0-1",
        children: [
          {
            title: "Leaf 0-0-1-1",
            value: "Leaf 0-0-1-1",
            key: "0-0-1-1",
          },
          {
            title: "Leaf 0-0-1-2",
            value: "Leaf 0-0-1-2",
            key: "0-0-1-2",
          },
        ],
      },
    ],
  },
  {
    title: "Trunk 0-1",
    value: "Trunk 0-1",
    key: "0-1",
    children: [
      {
        title: "Branch 0-1-1",
        value: "Branch 0-1-1",
        key: "0-1-1",
        children: [
          {
            title: "Leaf 0-1-1-0",
            value: "Leaf 0-1-1-0",
            key: "0-1-1-0",
          },
        ],
      },
      {
        title: "Branch 0-1-2",
        value: "Branch 0-1-2",
        key: "0-1-2",
        children: [
          {
            title: "Leaf 0-1-2-0",
            value: "Leaf 0-1-2-0",
            key: "0-1-2-0",
          },
        ],
      },
    ],
  },
];
const Add = () => {
  const { modalVisible } = store;
  const [form] = Form.useForm();
  const onCancle = () => {
    store.changeState({
      modalVisible: false,
    });
  };
  const onOk = async () => {
    try {
      let values = await form.validate();

      onCancle();
    } catch (error) {
      console.log(error);
    }
  };
  const filterTreeNode = (inputText, node) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  };
  const beforeUpload = (file, fileList) => {
    const limit = file.size / 1024 / 1024 < 10;
    if (!limit) {
      Message.error("文件大小不能超过10MB!");
      return false;
    } else {
      return true;
    }
  };
  return (
    <Modal
      title={"新增活动"}
      visible={modalVisible}
      className={classNames("security-modal", styles["activity-manage-modal"])}
      //   onOk={onOk}
      footer={null}
      onCancel={onCancle}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form form={form} className="add-form public-scrollbar" layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem
              label="活动名称"
              field="activityName"
              rules={[{ required: true, message: "请输入活动名称" }]}
            >
              <Input placeholder="请输入活动名称" maxLength={30} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="活动封面"
              field="upload"
              triggerPropName="fileList"
              initialValue={[
                {
                  uid: "-1",
                  url: "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp",
                  name: "20200717",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                name="files"
                action="/"
                accept={".jpg,.jpeg,.png"}
                limit={1}
                beforeUpload={beforeUpload}
                onPreview={(file) => {
                  Modal.info({
                    title: "Preview",
                    content: (
                      <img
                        src={file.url || URL.createObjectURL(file.originFile)}
                        style={{
                          maxWidth: "100%",
                        }}
                      ></img>
                    ),
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="活动场景"
              field="activityScene"
              rules={[{ required: true, message: "请选择活动场景" }]}
            >
              <Select
                placeholder="请选择活动场景"
                options={[
                  { label: "会展中心", value: "0" },
                  { label: "会展中心1", value: "1" },
                ]}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="举办时间"
              field="date"
              rules={[{ required: true, message: "请选择举办时间" }]}
              normalize={(value) => {
                return {
                  startDate: value && value[0],
                  endDate: value && value[1],
                };
              }}
              formatter={(value) => {
                return value && value.startDate
                  ? [value.startDate, value.endDate]
                  : [];
              }}
            >
              <RangePicker
                disabledDate={(current) => current.isBefore(dayjs())}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="活动类型"
              field="activityType"
              rules={[{ required: true, message: "请选择活动类型" }]}
            >
              <Select
                placeholder="请选择活动类型"
                options={[
                  { label: "会展中心", value: "0" },
                  { label: "会展中心1", value: "1" },
                ]}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="活动人员规模"
              field="activityPeopleNum"
              rules={[{ required: true, message: "请选择活动人员规模" }]}
            >
              <Select
                placeholder="请选择活动人员规模"
                options={[
                  { label: "5000人以下", value: "0" },
                  { label: "5000~10000人", value: "1" },
                  { label: "10000~30000人", value: "3" },
                  { label: "30000人以上", value: "4" },
                ]}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="活动所属行政区域"
              field="activityArea"
              rules={[{ required: true, message: "请选择活动所属行政区域" }]}
            >
              <TreeSelect
                showSearch={true}
                placeholder="请选择活动所属行政区域"
                allowClear={true}
                treeProps={{
                  onSelect: (v, n) => {
                    console.log(n);
                  },
                }}
                treeData={treeData}
                filterTreeNode={filterTreeNode}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="所属辖区责任单位"
              field="unit"
              rules={[{ required: true, message: "请选择所属辖区责任单位" }]}
            >
              <TreeSelect
                showSearch={true}
                placeholder="请选择所属辖区责任单位"
                multiple
                allowClear={true}
                treeProps={{
                  onSelect: (v, n) => {
                    console.log(n);
                  },
                }}
                treeData={treeData}
                filterTreeNode={filterTreeNode}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="活动安保等级"
              field="securityLevel"
              rules={[{ required: true, message: "请选择活动安保等级" }]}
            >
              <Select
                placeholder="请选择活动安保等级"
                options={[
                  { label: "高", value: "0" },
                  { label: "中", value: "1" },
                  { label: "低", value: "2" },
                ]}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="活动描述" field="activityDesc">
              <Input.TextArea
                maxLength={200}
                showWordLimit
                placeholder="请输入活动描述信息"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem
            label="活动举办方信息"
            style={{ marginBottom: 0 }}
          ></FormItem>
          <Form.List field="activityOrganizer">
            {(fields, { add, remove, move }) => {
              return (
                <div className={"organizer-wrap"}>
                  {fields?.length > 0 && (
                    <div className="organizer-header">
                      <div className="organizer-header-th">举办方类型</div>
                      <div className="organizer-header-th">是否主责任单位</div>
                      <div className="organizer-header-th">举办单位名称</div>
                      <div className="organizer-header-th">
                        举办方联系人姓名
                      </div>
                      <div className="organizer-header-th">举办方联系电话</div>
                      <div className="organizer-header-th">操作</div>
                    </div>
                  )}
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key}>
                        <Form.Item label={""} className={"organizer-body"}>
                          <div className="organizer-td">
                            <Form.Item
                              field={item.field + ".organizerType"}
                              rules={[
                                { required: true, message: "请选择举办方类型" },
                              ]}
                              noStyle
                            >
                              <Select
                                placeholder="举办方类型"
                                options={[
                                  { label: "主板单位", value: "0" },
                                  { label: "会展中心1", value: "1" },
                                ]}
                              />
                            </Form.Item>
                          </div>
                          <div className="organizer-td">
                            <Form.Item
                              field={item.field + ".isUnit"}
                              noStyle
                              triggerPropName="checked"
                              rules={[{ type: "boolean", true: true }]}
                            >
                              <Checkbox>是</Checkbox>
                            </Form.Item>
                          </div>
                          <div className="organizer-td">
                            <FormItem
                              field={item.field + ".unitName"}
                              rules={[
                                {
                                  required: true,
                                  message: "请输入举办单位名称",
                                },
                              ]}
                              noStyle
                            >
                              <Input placeholder="请输入" maxLength={30} />
                            </FormItem>
                          </div>
                          <div className="organizer-td">
                            <FormItem
                              field={item.field + ".organizerName"}
                              rules={[
                                {
                                  required: true,
                                  message: "请输入举办方联系人姓名",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="请输入"
                                style={{ width: 100 }}
                                maxLength={10}
                              />
                            </FormItem>
                          </div>
                          <div className="organizer-td">
                            <FormItem
                              field={item.field + ".organizerPhone"}
                              rules={[
                                {
                                  required: true,
                                  message: "请输入举办方联系电话",
                                },
                                { match: regExp.number, message: "请输入数字" },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="请输入"
                                style={{ width: 130 }}
                                maxLength={20}
                              />
                            </FormItem>
                          </div>
                          <div className="organizer-td">
                            <Button
                              icon={<IconDelete />}
                              shape="circle"
                              status="danger"
                              onClick={() => remove(index)}
                            ></Button>
                          </div>
                        </Form.Item>
                      </div>
                    );
                  })}
                  <Form.Item>
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      新增活动举办方信息
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Row>
      </Form>

      <div className="modal-footer" style={{ marginBottom: 30 }}>
        <Button type="secondary" size="large" onClick={onCancle}>
          取消
        </Button>
        <Button type="primary" size="large" onClick={onOk}>
          确定
        </Button>
      </div>
    </Modal>
  );
};
export default observer(Add);
