import TitleBar from "../title-bar";
import {
  Tooltip,
  Radio,
  Form,
  Button,
  InputNumber,
} from "@arco-design/web-react";
import { observer } from "mobx-react";
import store from "../../store/attributes-store";
import globalState from "@/globalState";
import exclamationCircle from "@/assets/img/exclamationCircle.png";
const RadioGroup = Radio.Group;
const ViewVisualAngle = () => {
  return (
    <div className="view-visual-angle-con">
      <TitleBar
        content={
          <div style={{ display: "flex", alignItems: "center" }}>
            查看视角
            <Tooltip content="支持调整查看模型视角">
              <div className="prompt-icon"></div>
            </Tooltip>
          </div>
        }
        style={{ marginBottom: 14 }}
      />
      <div className="visual-angle-type" style={{ marginBottom: 40 }}>
        <Form.Item label="" field="visualType" initialValue={"0"}>
          <RadioGroup
            onChange={(val) => {
              store.visualType = val;
              if (val == "0") {
                const mainView = globalState.get("mainView");
                store.attrForm.setFieldsValue(mainView);
                store.rotation = mainView;
                store.viewer.flyTo(mainView);
              }
            }}
          >
            <Radio value="0">场景默认初始化视角</Radio>
            <Radio value="1">自定义视角</Radio>
          </RadioGroup>
        </Form.Item>
        {store.visualType == "1" && (
          <>
            <Button
              type="secondary"
              size="mini"
              onClick={async () => {
                // store.pickupOpen = true;
                const cameraInfo = await store.viewer.getCameraInfo();
                store.attrForm.setFieldsValue(cameraInfo);
                store.rotation = cameraInfo;
              }}
            >
              拾取视角
            </Button>
            <div className="view-tip">
              <div className="tip">
                <img src={exclamationCircle} alt="" />
                <span>鼠标拖拽场景，可选择调整视角。</span>
              </div>
            </div>
          </>
        )}
      </div>
      <Form.Item
        label="俯仰角度"
        field="pitch"
        rules={[{ type: "number", required: true, message: "请输入俯仰角度" }]}
      >
        <InputNumber
          placeholder="俯仰角度"
          disabled={store.visualType == "0"}
          onChange={(val) => {
            store.rotation = {
              ...store.rotation,
              pitch: val,
            };
            store.flyTo();
          }}
        />
      </Form.Item>
      <Form.Item
        label="偏转角度"
        field="heading"
        rules={[{ type: "number", required: true, message: "请输入偏转角度" }]}
      >
        <InputNumber
          placeholder="偏转角度"
          disabled={store.visualType == "0"}
          onChange={(val) => {
            store.rotation = {
              ...store.rotation,
              heading: val,
            };
            store.flyTo();
          }}
        />
      </Form.Item>
      <Form.Item
        label="相机高度"
        field="alt"
        rules={[{ type: "number", required: true, message: "请输入相机高度" }]}
      >
        <InputNumber
          placeholder="相机高度"
          suffix={<span>m</span>}
          disabled={store.visualType == "0"}
          onChange={(val) => {
            store.rotation = {
              ...store.rotation,
              alt: val,
            };
            store.flyTo();
          }}
        />
      </Form.Item>
      <TitleBar content="切换视角动画" style={{ marginBottom: 14 }} />
      <div className="visual-angle-type">
        <Form.Item label="" field="animationType" initialValue={"0"}>
          <RadioGroup
            onChange={(val) => {
              store.animationType = val;
              // if (val == "0") {
              //   store.attrForm.setFieldValue("animationTime", 0);
              // }
            }}
          >
            <Radio value="0">跳转</Radio>
            <Radio value="1">飞行</Radio>
          </RadioGroup>
        </Form.Item>
        <Form.Item
          className={"animation-time"}
          label=""
          field="animationTime"
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          style={{ width: 160 }}
          initialValue={2}
          // rules={[{ type: "number", required: true }]}
        >
          <InputNumber
            defaultValue={2}
            placeholder="动画时间"
            disabled={store.animationType == "0"}
            suffix={<span>秒</span>}
          />
        </Form.Item>
      </div>
    </div>
  );
};
export default observer(ViewVisualAngle);
