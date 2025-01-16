import React, { memo, useEffect, useState } from "react";
import { observer } from "mobx-react";
import store from "@/pages/home/store";
import Container from "@/pages/place-manage/component/ele-store/feature-region/Container";
import styles from "./index.module.less";
import ZYX from "@/assets/img/place-manage/icons/ZYX.png";
import JX from "@/assets/img/place-manage/icons/JX.png";
import CIRCLE from "@/assets/img/place-manage/icons/CIRCLE.png";
import DBX from "@/assets/img/place-manage/icons/DBX.png";
import classNames from "classnames";
import { Modal, Button, InputNumber, Form } from "@arco-design/web-react";
const FormItem = Form.Item;
interface FeatureRegionColumn {
  key: string;
  title: string;
  icon: string;
  GeometryType: string;
}

const columns: FeatureRegionColumn[] = [
  {
    key: "ZYX",
    title: "自由线",
    icon: ZYX,
    GeometryType: "POLYLINE",
  },
  {
    key: "JX",
    title: "矩形",
    icon: JX,
    GeometryType: "RECTANGLE",
  },
  {
    key: "CIRCLE",
    title: "圆形",
    icon: CIRCLE,
    GeometryType: "CIRCLE",
  },
  {
    key: "DBX",
    title: "多边形",
    icon: DBX,
    GeometryType: "POLYGON",
  },
];
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
let geometry: any = null;
let geometryUtilFrame: any = null;
const FrameSelectDevice = (props) => {
  const [selected, setSelected] = useState<FeatureRegionColumn>();
  const { viewer } = store;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  let geometryData = {};

  const handleColumnClick = (column: FeatureRegionColumn) => {
    setSelected(column);
    remove();
    geometryUtilFrame = new window["KMapUE"].GeometryUtil({ viewer });
    geometryUtilFrame.draw({
      type: window["KMapUE"].GeometryType[column.GeometryType],
      geometryStyle: { fillColor: "#FF6806B3" },
      // type: 444,
      onComplete: (res) => {
        geometry = res;
        geometryData = res.getData();
        geometry.edit();
        geometry.on("editdata", () => {
          onOk(geometry.getEditData());
        });
        if (column.key === "ZYX") {
          setVisible(true);
          form.setFieldValue("queryScope", 10);
          return;
        }
        onOk(geometry.getEditData());
      },
    });
  };
  useEffect(() => {
    return () => {
      geometryUtilFrame && geometryUtilFrame.cancel();
      remove();
    };
  }, []);
  useEffect(() => {
    if (!store.location) {
      remove();
    }
  }, [store.location]);
  const remove = () => {
    geometry && geometry.remove();
    geometry = null;
  };
  const onOk = (location) => {
    store.location = location;
    store.homeLeftSideActive = "3";
    store.leftVisible = true;
  };
  const onClose = () => {
    store.frameSelectVisible = false;
    props.onClose && props.onClose();
  };
  const onSearch = () => {
    const queryScope = form.getFieldValue("queryScope");
    const distance = Number(queryScope);
    setVisible(false);
    onOk(geometry.getEditData(distance / 1000));
  };
  return (
    <Container
      className={styles["frame-select-device-wrap"]}
      title="框选设备"
      onClose={onClose}
    >
      <div className={"frame-select-device"}>
        {columns.map((v) => (
          <div
            className="column-item"
            key={v.key}
            onClick={() => handleColumnClick(v)}
          >
            <div
              className={classNames("column-item-icon", {
                active: selected?.key === v.key,
              })}
            >
              <img src={v.icon} width={40} />
            </div>
            <div className="column-item-title">{v.title}</div>
          </div>
        ))}
        <Modal
          title="查询缓冲区"
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          autoFocus={false}
          focusLock={true}
          mask={false}
          style={{ width: 400 }}
          footer={
            <div>
              <Button type="primary" onClick={onSearch}>
                确认
              </Button>
            </div>
          }
        >
          <Form form={form} autoComplete="off">
            <FormItem
              label="查询范围"
              field={"queryScope"}
              initialValue={10}
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                placeholder="查询范围"
                min={0}
                suffix={<span>M</span>}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    </Container>
  );
};
export default memo(observer(FrameSelectDevice));
