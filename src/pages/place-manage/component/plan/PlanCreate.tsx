import styles from "./PlanCreate.module.less";
import { observer } from "mobx-react";
import { Button, Form, Message } from "@arco-design/web-react";
import Container from "./Container";
import TitleBar from "../title-bar";
import store from "../../store";
import { addPlan, updatePlan } from "../../store/webapi";
import { getEventId, getVenueId } from "../../../../kit/util";
import PlanFormItems from "./PlanFormItems";
import { debounce } from "lodash";

const PlanCreate = ({ onCancel }) => {
  const { actionType, selectedPlan, viewer } = store;
  const [form] = Form.useForm();
  const venueId = getVenueId();
  const eventId = getEventId();

  const onFinish = async () => {
    try {
      const values = await form.validate();
      const data = {
        ...values,
        id: selectedPlan?.id,
        eventId,
        venueId,
      };
      if (actionType === "edit") {
        await updatePlan(data);
        store.getAllPlans();
        Message.success("编辑成功");
      } else {
        const id = await addPlan(data);
        store.getAllPlans(id);
        Message.success("创建成功");
        if (viewer) {
          const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
          geometryUtil.removeAll();
          const element = new window["KMapUE"].SecurityElementBatch({
            viewer,
          });
          element.removeAll();
        }
        store.changeState({
          checkedKeysArr: [],
          checkedKeysInherentArr: [],
        });
      }
      onCancel();
    } catch (e) {
      Message.error("校验失败");
    }
  };

  return (
    <Container
      className={styles["plan-create"]}
      title={actionType === "edit" ? "修改方案" : "新增方案"}
      onClose={onCancel}
    >
      <TitleBar content={"方案基本信息"} />

      <Form
        className={"public-scrollbar"}
        initialValues={actionType === "edit" ? selectedPlan : null}
        form={form}
        layout="vertical"
        size="large"
      >
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

export default observer(PlanCreate);
