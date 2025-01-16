import styles from "./PlanCreate.module.less";
import { observer } from "mobx-react";
import { Button, Form, Message, Select } from "@arco-design/web-react";
import Container from "./Container";
import TitleBar from "../title-bar";
import store from "../../store";
import { copyPlan } from "../../store/webapi";
import { getEventId, getVenueId } from "../../../../kit/util";
import PlanFormItems from "./PlanFormItems";
import { debounce } from "lodash";

const PlanCopy = ({ onCancel }) => {
  const { plans2Options, selectedPlan } = store;
  const [form] = Form.useForm();
  const venueId = getVenueId();
  const eventId = getEventId();

  const onFinish = async () => {
    const values = await form.validate();
    const data = {
      ...values,
      copyId: selectedPlan?.id,
      eventId,
      venueId,
    };

    const id = await copyPlan(data);
    store.getAllPlans(id);
    Message.success("复制成功");
    onCancel();
  };

  return (
    <Container
      className={styles["plan-create"]}
      title={"复制方案"}
      onClose={onCancel}
    >
      <TitleBar content={"方案基本信息"} />

      <Form
        className={"public-scrollbar"}
        initialValues={selectedPlan}
        form={form}
        layout="vertical"
        size="large"
      >
        <Form.Item label={"复制方案"} field="id" disabled>
          <Select options={plans2Options} />
        </Form.Item>
        <PlanFormItems />
      </Form>

      <div className="button-box">
        <Button className="cancel" onClick={debounce(onCancel, 600)}>
          取消
        </Button>
        <Button
          type="primary"
          className="confirm"
          onClick={debounce(onFinish, 600)}
        >
          确认
        </Button>
      </div>
    </Container>
  );
};

export default observer(PlanCopy);
