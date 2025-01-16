import React, { useEffect, useState, useRef } from "react";
import TitleBar from "../title-bar";
import exhCenter from "@/assets/img/place-manage/exh-center.png";
import horizontal from "@/assets/img/place-manage/horizontal.png";
import horizontalHover from "@/assets/img/place-manage/horizontal-hover.png";
import verticla from "@/assets/img/place-manage/verticla.png";
import verticlaHover from "@/assets/img/place-manage/verticla-hover.png";
import add from "@/assets/img/place-manage/add.png";
// import delete from "@/assets/img/place-manage/delete.png";
// import delete -hover from "@/assets/img/place-manage/verticla-hover.png";
// import delete -hover from "@/assets/img/place-manage/verticla-hover.png";
import {
  Radio,
  Input,
  Message,
  Form,
  Switch,
  Dropdown,
  Button,
  Menu,
  Upload,
  Tooltip,
} from "@arco-design/web-react";
import { getProjectRelativePath, downLoadUrl, deep } from "@/kit";
import styles from "./component-config.module.less";
import { debounce } from "lodash";
import classNames from "classnames";
import * as XLSX from "xlsx";
import { downloadTemplate } from "../../store/webapi";
import store from "../../store/attributes-store";
import storeFloat from "../../store/index";

const RadioGroup = Radio.Group;
const projectRelativePath = getProjectRelativePath();

const ComponentConfig = ({ form, gizmoStatus, current }) => {
  const { viewer } = store;
  const { closeComponentFrame, openComponentFrame } = storeFloat;
  console.log(form.getFieldValue("styleType"), "styleType1111999999999");

  const [styleType, setStyleType] = useState<number | string>(
    form.getFieldValue("styleType")
      ? form.getFieldValue("styleType")
      : "horizontal"
  );
  useEffect(() => {
    console.log(
      form.getFieldValue("styleType"),
      'form.getFieldValue("styleType")1111111'
    );

    form.getFieldValue("styleType");
  }, [styleType]);
  useEffect(() => {
    console.log(
      form.getFieldValue("styleType"),
      'form.getFieldValue("styleType")2222222'
    );

    setStyleType(
      form.getFieldValue("styleType")
        ? form.getFieldValue("styleType")
        : "horizontal"
    );
  }, [form.getFieldValue("styleType")]);

  const [modalTitle, setModalTitle] = useState<string>("");
  const [filters, setFilters] = useState<any>([
    {
      key: "",
      value: "",
    },
  ]);

  const onChangeValue = (type: string, key: number, value: any) => {
    let arr: any = [...filters];
    if (!arr[key]) {
      arr[key] = {};
    }
    arr[key][type] = value;
    setFilters(arr);
  };

  const loadUp = () => {
    const url = `${projectRelativePath}static/download/form-import-temp.xlsx`;
    downLoadUrl(url, "表单导入模板", "xlsx");
  };

  const [checkedValue, setCheckedValue] = useState(false);
  useEffect(() => {
    setCheckedValue(gizmoStatus);
  }, [gizmoStatus]);

  const switchOpen = (val) => {
    const { id, type } = current;
    const uid = id ? type + id : 1;
    if (!val) {
      closeComponentFrame(uid);
    }
  };

  useEffect(() => {
    console.log(styleType, "styleType222222222222222");
    if (checkedValue) {
      viewer.getCameraInfo().then((info: any) => {
        if (info.z < 10000) {
          initFrame(8000);
        } else {
          initFrame(20000);
        }
      });
    }
  }, [styleType, checkedValue]);

  const initFrame = (distance: number) => {
    const { detailData } = store;
    const { id, type } = current;
    const uid = id ? type + id : 1;
    let style = styleType;
    console.log(style, "stylestylestyle");
    const content = detailData?.content || [];
    const newContent =
      content?.map((item) => ({ name: item.key, value: item.value })) || [];
    console.log(newContent, "newContent");
    viewer.getPositionFromCamera(distance || 8000, (res) => {
      console.log(res, "res");
      !detailData?.positionX && (store.positionFrame = res);
      const { lng, lat, alt } = res;
      const _option = {
        title: detailData?.popFrameName || "弹窗标题",
        contents: newContent,
        position: [detailData?.positionX || lng, detailData?.positionY || lat],
        altitude: detailData?.altitude || (alt > 0 ? alt : 20),
        id: detailData?.featureLibraryId || 1,
      };
      if (newContent.length == 0) delete _option.contents;
    });
    openComponentFrame({
      uid,
      content,
      styleType,
      popFrameName: detailData?.popFrameName || "弹窗标题",
    });
  };

  const hasEmptyField = (tableData, paramsName = "gbid") => {
    return tableData.some((item) => !item[paramsName]);
  };

  const beforeUpload = (file, filesList) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file); // 读取文件
    reader.onload = (evt) => {
      //读取完文件之后会回来这里
      const workbook = XLSX.read(evt.target.result, { type: "array" });
      const sheet_name_list = workbook.SheetNames;
      //  console.log(workbook, sheet_name_list);
      let data: any = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      data = data.map((item) => {
        return {
          key: item["字段名称"],
          seq: item["排序"],
          value: item["字段值"],
        };
      });
      console.log("imprt", data);
      if (data.length == 0) {
        return Message.error("导入文件不能为空");
      }

      if (data.length > 10) {
        return Message.error("导入文件最多不可超过10组");
      }

      // console.log(hasEmptyField(data, "key"))
      if (hasEmptyField(data, "key")) {
        return Message.error("设备名称存在空值，请修改文件后重新导入！");
      }
      // if (hasEmptyField(data, "deviceType")) {
      //   return Message.error("设备类型存在空值，请修改文件后重新导入！");
      // }
      // if (hasDuplicateId(data)) {
      //   return Message.error("设备ID存在重复，请修改文件后重新导入！");
      // }
      // if (hasDuplicateId(data, "deviceName")) {
      //   return Message.error("设备名称存在重复，请修改文件后重新导入！");
      // }
      // const deviceTypes = ["TOLLGATE", "IPC_3", "IPC_1", "BWC"];
      // if (data.some((item) => !deviceTypes.includes(item["deviceType"]))) {
      //   return Message.error("设备类型存在无法识别，请修改文件后重新导入！");
      // }
      // store.setFrameData(data);
      form.setFieldsValue({ content: data });

      console.log(form, "form");
    };

    return false;
  };
  return (
    <div className={`component-config-wrap ${styles.mainBox}`}>
      <TitleBar
        content={
          <div className="model-upmap">
            <label htmlFor="">弹窗信息体</label>
            <Form.Item label="" field="gizmoStatus">
              <Switch
                size="small"
                checked={checkedValue}
                onChange={debounce((val) => {
                  setCheckedValue(val);
                  switchOpen(val);
                }, 600)}
              />
            </Form.Item>
          </div>
        }
        style={{ marginBottom: 14, width: "100%" }}
      ></TitleBar>

      {checkedValue && (
        <div className={classNames("component-config-con", styles.configCon)}>
          <div
            className={`${styles.flex} ${styles.styleType} ${styles["justify-between"]}`}
          >
            <img
              src={styleType === "horizontal" ? verticlaHover : verticla}
              className={`${styles.styleItem} ${styles.stylesingle}`}
            />
            <img
              src={styleType === "vertical" ? horizontalHover : horizontal}
              className={`${styles.styleItem} ${styles.stylesmutil}`}
            />
          </div>
          <Form.Item
            label=""
            field="styleType"
            style={{ width: "100%", marginLeft: 40 }}
          >
            <RadioGroup
              defaultValue={styleType}
              value={styleType}
              // className={styles.mb10}
              onChange={(e: string) => {
                setStyleType(e);
              }}
            >
              <Radio value="horizontal">样式1</Radio>
              <Radio value="vertical" style={{ marginLeft: 70 }}>
                样式2
              </Radio>
            </RadioGroup>
          </Form.Item>
          <div>
            <div
              className={`${styles.control} ${styles.flex} ${styles.formItemCol}`}
            >
              <label className={`${styles.controlLabel} ${styles.require}`}>
                弹窗标题
              </label>
              <Form.Item
                label=""
                field="popFrameName"
                rules={[{ required: true, message: "请输入要素名称" }]}
              >
                <Input
                  className={styles.controlInput}
                  placeholder="要素名称"
                  value={modalTitle}
                  maxLength={30}
                  style={{ width: 240 }}
                  onChange={(e) => {
                    setModalTitle(e);
                  }}
                />
              </Form.Item>
            </div>

            <div
              className={`${styles.control} ${styles.flex} ${styles["align-center"]}`}
            >
              <label className={`${styles.controlLabel}`} htmlFor="">
                弹窗内容
              </label>
              <div className={classNames(styles.controlWp)}>
                <Upload
                  action="/"
                  accept={".xls,.xlsx"}
                  beforeUpload={beforeUpload}
                >
                  <Button type="secondary" size="small">
                    批量导入
                  </Button>
                </Upload>

                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={loadUp}
                >
                  下载模版
                </Button>
              </div>
            </div>

            <Form.List
              field="content"
              rules={[{ required: true, message: "请添加字段" }]}
            >
              {(fields, { add, remove, move }) => {
                return (
                  <div className={styles.controlBox}>
                    {fields &&
                      fields?.map((item: any, index: number) => (
                        <div key={item.key} className={styles.fieldsWp}>
                          <div className={`${styles.control} ${styles.flex} `}>
                            <label className={`${styles.controlLabel}`}>
                              字段名称
                            </label>
                            <Form.Item
                              label=""
                              field={item.field + ".key"}
                              rules={[
                                { required: true, message: "请输入字段名称" },
                              ]}
                            >
                              <Input
                                className={styles.controlInput}
                                placeholder="请输入字段名称"
                                value={item?.key}
                                maxLength={20}
                                onChange={(e) => {
                                  onChangeValue("key", index, e);
                                }}
                              />
                            </Form.Item>
                          </div>
                          <div className={`${styles.control} ${styles.flex}`}>
                            <label className={`${styles.controlLabel}`}>
                              字段值
                            </label>
                            <Form.Item
                              label=""
                              field={item.field + ".value"}
                              rules={[
                                { required: true, message: "请输入字段值" },
                              ]}
                            >
                              <Input
                                maxLength={200}
                                className={styles.controlInput}
                                placeholder="请输入字段值"
                                value={item?.value}
                                onChange={(e) => {
                                  onChangeValue("value", index, e);
                                }}
                              />
                            </Form.Item>
                          </div>
                          <div
                            className={styles.delAction}
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <Tooltip content={"删除"}>
                              <span></span>
                            </Tooltip>
                          </div>
                        </div>
                      ))}

                    <Form.Item>
                      <div
                        className={`${styles.action} ${styles.flex} ${styles["aligin-center"]}`}
                        onClick={() => {
                          if (form.getFieldValue("content").length < 10) {
                            add();
                          } else {
                            Message.error("最多不可超过10组");
                          }
                        }}
                      >
                        <span></span>字段名称、字段值组
                      </div>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </div>
        </div>
      )}
    </div>
  );
};
export default ComponentConfig;
