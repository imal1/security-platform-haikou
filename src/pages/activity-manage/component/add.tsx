import { Icon } from "@/components";
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Grid,
  Input,
  Message,
  Modal,
  Progress,
  Radio,
  Select,
  TreeSelect,
  Upload,
} from "@arco-design/web-react";
import { IconDelete, IconEdit, IconPlus } from "@arco-design/web-react/icon";
import classNames from "classnames";
import dayjs from "dayjs";
import { regExp } from "kit";
import { observer } from "mobx-react";
import { useState } from "react";
import styles from "../index.module.less";
import store from "../store";
const { RangePicker } = DatePicker;
const { Row, Col } = Grid;
const RadioGroup = Radio.Group;
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
  const { modalVisible, areaTree } = store;
  const [form] = Form.useForm();
  const [file, setFile]: any = useState();
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
  const cs = `arco-upload-list-item${file && file.status === "error" ? " is-error" : ""}`;
  return (
    <Modal
      title={"新增活动"}
      visible={modalVisible}
      className={classNames("security-modal", styles["activity-manage-modal"])}
      //   onOk={onOk}
      onCancel={onCancle}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form form={form} className="add-form public-scrollbar" layout="vertical">
        <div className="big-title">
          <span>活动基本信息</span>
        </div>
        <Row gutter={30}>
          <Col span={19}>
            <Row gutter={35}>
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
                  rules={[
                    { required: true, message: "请选择活动所属行政区域" },
                  ]}
                >
                  <Cascader
                    showSearch={true}
                    placeholder="请选择活动所属行政区域"
                    allowClear={true}
                    options={areaTree}
                    fieldNames={{
                      label:'name',
                      value:'id'
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="所属辖区责任单位"
                  field="unit"
                  rules={[
                    { required: true, message: "请选择所属辖区责任单位" },
                  ]}
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
                  rules={[{ required: true, message: "请选择安保等级" }]}
                >
                  <Select
                    placeholder="请选择安保等级"
                    options={[
                      { label: "高", value: "0" },
                      { label: "中", value: "1" },
                      { label: "低", value: "2" },
                    ]}
                  />
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="活动描述" field="activityDesc">
                  <Input.TextArea
                    maxLength={200}
                    showWordLimit
                    placeholder="请输入活动描述信息"
                  />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={5}>
            <FormItem
              label=""
              field="upload"
              triggerPropName="fileList"

              // initialValue={[
              //   {
              //     uid: "-1",
              //     url: "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp",
              //     name: "20200717",
              //   },
              // ]}
            >
              <Upload
                action="/"
                accept={".jpg,.jpeg,.png"}
                showUploadList={false}
                className={"activity-upload"}
                beforeUpload={beforeUpload}
                onChange={(_, currentFile) => {
                  setFile({
                    ...currentFile,
                    url: URL.createObjectURL(currentFile.originFile),
                  });
                }}
                onProgress={(currentFile) => {
                  setFile(currentFile);
                }}
              >
                <div className={cs}>
                  {file && file.url ? (
                    <div className="arco-upload-list-item-picture custom-upload-avatar">
                      <img src={file.url} />
                      <div className="arco-upload-list-item-picture-mask">
                        <IconEdit />
                      </div>
                      {file.status === "uploading" && file.percent < 100 && (
                        <Progress
                          percent={file.percent}
                          type="circle"
                          size="mini"
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translateX(-50%) translateY(-50%)",
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="arco-upload-trigger-picture">
                      <div className="arco-upload-trigger-picture-text">
                        <Icon type="anbao-newly-added" />
                        <div style={{ marginTop: 2, fontWeight: 600 }}>
                          上传
                        </div>
                      </div>
                      <div className="fengmian">活动封面</div>
                    </div>
                  )}
                  <div className="upload-desc">
                    支持上传JPG/JPEG/PNG格式 文件，文件大小不超过10M
                  </div>
                </div>
              </Upload>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Form.List field="activityOrganizer">
            {(fields, { add, remove, move }) => {
              return (
                <div className={"organizer-wrap"}>
                  <div className="small-title">
                    <span>活动举办方信息</span>
                    <Button
                      onClick={() => {
                        add();
                      }}
                      icon={<IconPlus />}
                    >
                      新增活动举办方信息
                    </Button>
                  </div>
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
                        <Form.Item
                          label={""}
                          className={"organizer-body"}
                          style={{ marginBottom: 0 }}
                        >
                          <div className="organizer-td">
                            <Form.Item
                              field={item.field + ".organizerType"}
                              rules={[
                                { required: true, message: "请选择类型" },
                              ]}
                              noStyle
                            >
                              <Select
                                placeholder="请选择类型"
                                size="small"
                                options={[
                                  { label: "主板单位", value: "0" },
                                  { label: "会展中心1", value: "1" },
                                ]}
                                allowClear
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
                                  message: "请输入单位",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="请输入单位"
                                maxLength={30}
                                size="small"
                                allowClear
                              />
                            </FormItem>
                          </div>
                          <div className="organizer-td">
                            <FormItem
                              field={item.field + ".organizerName"}
                              rules={[
                                {
                                  required: true,
                                  message: "请输入姓名",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="请输入姓名"
                                maxLength={10}
                                size="small"
                                allowClear
                              />
                            </FormItem>
                          </div>
                          <div className="organizer-td">
                            <FormItem
                              field={item.field + ".organizerPhone"}
                              rules={[
                                {
                                  required: true,
                                  message: "请输入电话",
                                },
                                { match: regExp.number, message: "请输入数字" },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="请输入电话"
                                maxLength={20}
                                size="small"
                                allowClear
                              />
                            </FormItem>
                          </div>
                          <div className="organizer-td">
                            <IconDelete onClick={() => remove(index)} />
                          </div>
                        </Form.Item>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
        </Row>
        <div className="big-title" style={{ marginTop: 25 }}>
          <span>活动安保方案</span>
        </div>
        <FormItem
          label="是否复制方案"
          initialValue={"1"}
          rules={[{ required: true, message: "请选择是否复制方案" }]}
        >
          <RadioGroup
            defaultValue={"1"}
            options={[
              { label: "是", value: "1" },
              { label: "否", value: "0" },
            ]}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default observer(Add);
