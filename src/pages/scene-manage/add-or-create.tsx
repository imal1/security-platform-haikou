import { Button, Form, Input, Select, Upload } from "@arco-design/web-react";
import { observer } from "mobx-react";

const SceneAddOrCreate = () => {
  const [form] = Form.useForm();
  const onSubmit = () => {};
  return (
    <div>
      <Form.Provider onFormSubmit={onSubmit}>
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="场景名称"
            field="sceneName"
            rules={[{ required: true, message: "请输入场景名称" }]}
          >
            <Input placeholder="请输入场景名称" />
          </Form.Item>
          <Form.Item
            label="场景类型"
            field="sceneType"
            rules={[{ required: true, message: "请选择场景类型" }]}
          >
            <Select placeholder="请选择场景类型">
              <Select.Option value="数字学生">数字学生</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="场景服务"
            field="sceneService"
            rules={[{ required: true, message: "请选择场景服务" }]}
          >
            <Select placeholder="请选择">
              <Select.Option value="">请选择</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="场景中心点"
            field="sceneCenter"
            rules={[{ required: true, message: "请输入经纬度" }]}
          >
            <Input placeholder="请输入经纬度" />
          </Form.Item>
          <Form.Item
            label="所属行政区"
            field="district"
            rules={[{ required: true, message: "请选择所属行政区" }]}
          >
            <Select placeholder="请选择">
              <Select.Option value="">请选择</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="场景面积" field="sceneArea">
            <Input placeholder="请输入大于0的整数" />
          </Form.Item>
          <Form.Item label="场景图片" field="sceneImage">
            <Upload
              action="your - upload - action - url"
              listType="picture-card"
              accept=".jpg, .jpeg, .png"
            ></Upload>
          </Form.Item>
          <Form.Item label="场景说明" field="sceneDescription">
            <Input.TextArea placeholder="请输入" maxLength={200} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="secondary" htmlType="reset">
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Form.Provider>
    </div>
  );
};

export default observer(SceneAddOrCreate);
