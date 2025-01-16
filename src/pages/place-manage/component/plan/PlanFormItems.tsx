import { observer } from "mobx-react";
import { Form, Input } from "@arco-design/web-react";
import store from "../../store";

const PlanFormItems = () => {
  const { actionType, plans, selectedPlan } = store;

  const initPlanName = () => {
    switch (actionType) {
      case "create":
      case "copy":
        return "方案" + (plans.length + 1);
      case "edit":
        return selectedPlan?.planName;
    }
  };

  return (
    <>
      <Form.Item
        label={"方案名称"}
        field="planName"
        rules={[
          {
            required: true,
            maxLength: 30,
            message: "请输入30个字符以内的方案名称！",
          },
        ]}
        initialValue={initPlanName()}
      >
        <Input placeholder="请输入方案名称" allowClear />
      </Form.Item>

      <Form.Item
        label={"方案说明"}
        field="planIllustrate"
        rules={[{ maxLength: 200, message: "请输入200个字符以内的方案说明！" }]}
      >
        <Input.TextArea placeholder="请输入" rows={4} allowClear />
      </Form.Item>

      <Form.Item
        label={"人防说明"}
        field="civilIllustrate"
        rules={[{ maxLength: 200, message: "请输入200个字符以内的人防说明！" }]}
      >
        <Input.TextArea placeholder="请输入" rows={4} allowClear />
      </Form.Item>

      <Form.Item
        label={"物防说明"}
        field="physicalIllustrate"
        rules={[{ maxLength: 200, message: "请输入200个字符以内的物防说明！" }]}
      >
        <Input.TextArea placeholder="请输入" rows={4} allowClear />
      </Form.Item>

      <Form.Item
        label={"技防说明"}
        field="technicalIllustrate"
        rules={[{ maxLength: 200, message: "请输入200个字符以内的技防说明！" }]}
      >
        <Input.TextArea placeholder="请输入" rows={4} allowClear />
      </Form.Item>
    </>
  );
};

export default observer(PlanFormItems);
