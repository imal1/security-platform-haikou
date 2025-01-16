import styles from "./PlanDetail.module.less";
import { observer } from "mobx-react";
import { Form, Input } from "@arco-design/web-react";
import Container from "./Container";
import TitleBar from "../title-bar";
import store from "../../store/index";

const PlanDetail = ({ onCancel }) => {
  const { selectedPlan } = store;
  const [form] = Form.useForm();

  return (
    <Container
      className={styles["plan-detail"]}
      title={"方案详情"}
      onClose={onCancel}
    >
      <TitleBar content={"方案基本信息"} />

      <Form
        className={"public-scrollbar"}
        initialValues={selectedPlan}
        form={form}
        layout="horizontal"
        size="large"
      >
        <Form.Item label={"方案名称"} field="planName">
          <Input readOnly />
        </Form.Item>

        <Form.Item label={"方案说明"} field="planIllustrate">
          <Input.TextArea rows={4} readOnly />
        </Form.Item>

        <Form.Item label={"人防说明"} field="civilIllustrate">
          <Input.TextArea rows={4} readOnly />
        </Form.Item>

        <Form.Item label={"物防说明"} field="physicalIllustrate">
          <Input.TextArea rows={4} readOnly />
        </Form.Item>

        <Form.Item label={"技防说明"} field="technicalIllustrate">
          <Input.TextArea rows={2} readOnly />
        </Form.Item>
      </Form>
    </Container>
  );
};

export default observer(PlanDetail);
