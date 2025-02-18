import { Icon, NoData } from "@/components";
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
const Option = Select.Option;
const Add = () => {
  const {
    modalVisible,
    areaTree,
    departmentTree,
    activityTypes,
    activityPersonSize,
    securityLevelData,
    organizerTypes,
    sceneList,
    departmentData,
  } = store;
  const [form] = Form.useForm();
  const [file, setFile]: any = useState();
  const [activityThumbnail, setActivityThumbnail] = useState();
  const [regionName, setRegionName] = useState();
  const [deptName, setDeptName] = useState();
  const onCancle = () => {
    store.changeState({
      modalVisible: false,
    });
  };
  const onOk = async () => {
    try {
      let values = await form.validate();
      console.log(values);
      let params = {
        ...values,
        activityThumbnail,
        ...values.date,
        regionName,
        deptName,
        regionId: values.regionId.join(),
        deptId: values.deptId.join(),
      };
      await store.addActivity(params);
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
      onOk={onOk}
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
                  <Input
                    placeholder="请输入活动名称"
                    maxLength={30}
                    allowClear
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
                      startDay: value && value[0],
                      finishDay: value && value[1],
                    };
                  }}
                  formatter={(value) => {
                    return value && value.startDay
                      ? [value.startDay, value.finishDay]
                      : [];
                  }}
                >
                  <RangePicker
                    disabledDate={(current) => current.isBefore(dayjs())}
                    allowClear
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="活动场景"
                  field="sceneId"
                  rules={[{ required: true, message: "请选择活动场景" }]}
                >
                  <Select placeholder="请选择活动场景" allowClear>
                    {sceneList.map((option) => (
                      <Option
                        key={option.id}
                        value={option.id}
                        title={option.sceneName}
                      >
                        {option.sceneName}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label="活动类型"
                  field="activityType"
                  rules={[{ required: true, message: "请选择活动类型" }]}
                >
                  <Select placeholder="请选择活动类型" allowClear>
                    {activityTypes.map((option) => (
                      <Option
                        key={option.code}
                        value={option.code}
                        title={option.name}
                      >
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="活动人员规模"
                  field="personSize"
                  rules={[{ required: true, message: "请选择活动人员规模" }]}
                >
                  <Select placeholder="请选择活动人员规模" allowClear>
                    {activityPersonSize.map((option) => (
                      <Option
                        key={option.code}
                        value={option.code}
                        title={option.name}
                      >
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="活动所属行政区域"
                  field="regionId"
                  rules={[
                    { required: true, message: "请选择活动所属行政区域" },
                  ]}
                >
                  <Cascader
                    showSearch={true}
                    placeholder="请选择活动所属行政区域"
                    allowClear={true}
                    options={areaTree}
                    getPopupContainer={() =>
                      document.querySelector(".add-form")
                    }
                    fieldNames={{
                      label: "name",
                      value: "id",
                    }}
                    onChange={(value, extra) => {
                      const regionNameStr = extra
                        .map((item) => item.name)
                        .join();
                      setRegionName(regionNameStr);
                      console.log(extra, "Cascader");
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="所属辖区责任单位"
                  field="deptId"
                  rules={[
                    { required: true, message: "请选择所属辖区责任单位" },
                  ]}
                >
                  <TreeSelect
                    showSearch
                    treeCheckable
                    placeholder="请选择所属辖区责任单位"
                    treeData={departmentTree}
                    treeCheckStrictly={true}
                    filterTreeNode={filterTreeNode}
                    maxTagCount={1}
                    fieldNames={{
                      key: "id",
                      title: "name",
                    }}
                    notFoundContent={<NoData status={true} />}
                    getPopupContainer={() =>
                      document.querySelector(".add-form")
                    }
                    onChange={(value, extra) => {
                      const names = departmentData
                        .filter((item) => value.includes(item.id))
                        .map((item) => item.name)
                        .join();
                      setDeptName(names);
                    }}
                    allowClear
                    treeProps={{
                      height: 200,
                      onSelect: (v, n) => {
                        console.log(n);
                      },
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="活动安保等级"
                  field="securityLevel"
                  rules={[{ required: true, message: "请选择安保等级" }]}
                >
                  <Select placeholder="请选择安保等级" allowClear>
                    {securityLevelData.map((option) => (
                      <Option
                        key={option.code}
                        value={option.code}
                        title={option.name}
                      >
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="活动描述" field="activityRemark">
                  <Input.TextArea
                    maxLength={200}
                    showWordLimit
                    placeholder="请输入活动描述信息"
                    allowClear
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
                action={`${window.globalConfig["BASE_URL"]}/file/upload`}
                accept={".jpg,.jpeg,.png"}
                showUploadList={false}
                className={"activity-upload"}
                beforeUpload={beforeUpload}
                headers={{
                  "sys-token": localStorage.getItem("server-token"),
                }}
                onChange={(_, currentFile: any) => {
                  if (currentFile.status === "done") {
                    const url = currentFile?.response?.result;
                    setActivityThumbnail(url);
                    console.log(url);
                  }
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
          <Form.List field="organizerList">
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
                                allowClear
                              >
                                {organizerTypes.map((option) => (
                                  <Option
                                    key={option.code}
                                    value={option.code}
                                    title={option.name}
                                  >
                                    {option.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="organizer-td">
                            <Form.Item
                              field={item.field + ".responsibility"}
                              noStyle
                              triggerPropName="checked"
                              rules={[{ type: "boolean", true: true }]}
                            >
                              <Checkbox>是</Checkbox>
                            </Form.Item>
                          </div>
                          <div className="organizer-td">
                            <FormItem
                              field={item.field + ".organizerName"}
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
                              field={item.field + ".contactName"}
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
                              field={item.field + ".contactNumber"}
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
        {/* <div className="big-title" style={{ marginTop: 25 }}>
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
        </FormItem> */}
      </Form>
    </Modal>
  );
};
export default observer(Add);
