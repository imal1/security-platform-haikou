import styles from "./index.module.less";
import { observer } from "mobx-react";
import {
  Select,
  Message,
  Popconfirm,
  Tooltip,
  Button,
} from "@arco-design/web-react";
import Container from "./Container";
import classNames from "classnames";
import detailWebp from "@/assets/img/place-manage/fangan-box/detail.webp";
import editWebp from "@/assets/img/place-manage/fangan-box/edit.webp";
import copyWebp from "@/assets/img/place-manage/fangan-box/copy.webp";
import deleteWebp from "@/assets/img/place-manage/fangan-box/delete.webp";
import { deletePlan, planStart } from "../../store/webapi";
import store from "../../store/index";
import { debounce } from "lodash";
import { getEventId, getVenueId } from "../../../../kit/util";
import { useEffect } from "react";
const Option = Select.Option;

const PlanSelect = ({ onActions }) => {
  const { plans, plans2Options, selectedPlan, viewer } = store;
  const venueId = getVenueId();
  const eventId = getEventId();

  const handleSelect = (value) => {
    if(store.isCorrect) {
      Message.warning("正在纠偏，无法切换");
      return
    }
    store.changeState({
      selectedPlan: plans?.find((v) => v.id === value),
      checkedKeysArr: [],
      checkedKeysInherentArr: [],
      jfInherentKeys: [],
      jfTemporaryKeys: [],
    });
    if (viewer) {
      const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
      geometryUtil.removeAll();
      const element = new window["KMapUE"].SecurityElementBatch({
        viewer,
      });
      element.removeAll();
      const labelBatch = new window["KMapUE"].LabelBatch({
        viewer,
      });
      labelBatch.removeAll();
      const roadBatch = new window["KMapUE"].RoadLabelBatch({
        viewer,
      });
      roadBatch.removeAll();
    }
  };

  const handleSwitch = debounce(async () => {
    const enablePlans = plans.filter((v) => v.enable === 1);
    if (enablePlans.length === 1 && selectedPlan.enable === 1) {
      return Message.error("当前现场有且只有一个启用方案，可启用其他方案");
    }

    await planStart({
      id: selectedPlan.id,
      eventId,
      venueId,
      enable: !selectedPlan.enable,
    });
    Message.success("操作成功");
    store.getAllPlans();
  }, 100);

  const handleDelete = async () => {
    if (selectedPlan.enable) {
      return Message.error("当前现场有且只有一个启用方案，不可删除");
    }
    await deletePlan(selectedPlan.id);
    Message.success("删除成功");
    store.getAllPlans();
  };

  return (
    <Container className={styles["plan-select"]} title={"方案选择"}>
      <div className="select-box">
        <Select
          className="select"
          size="large"
          placeholder="请选择方案"
          value={selectedPlan?.id}
          onChange={handleSelect}
        >
          {plans2Options.map((item) => (
            <Option key={item.value} value={item.value}>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <span
                  className="text-overflow"
                  style={{ flex: 1, overflow: "hidden" }}
                >
                  {item.label}
                </span>
                {!!item.enable && (
                  <label
                    style={{
                      color:
                        selectedPlan?.id == item.value ? "#d4cdbb" : "#fff",
                    }}
                  >
                    已启用
                  </label>
                )}
              </span>
            </Option>
          ))}
        </Select>
        {selectedPlan && (
          <Tooltip content={selectedPlan.enable ? "禁用" : "启用"}>
            <div
              className={classNames("switch", { checked: selectedPlan.enable })}
              onClick={handleSwitch}
            />
          </Tooltip>
        )}
      </div>
      <div className="plan-actions">
        <Button className="plan-add" onClick={() => onActions("create")}>
          新增方案
        </Button>
        {selectedPlan && (
          <div className="actions">
            <div className="action-item" onClick={() => onActions("detail")}>
              <img src={detailWebp} />
              <span>详情</span>
            </div>
            <div className="action-item" onClick={() => onActions("edit")}>
              <img src={editWebp} />
              <span>编辑</span>
            </div>
            <div className="action-item" onClick={() => onActions("copy")}>
              <img src={copyWebp} />
              <span>复制</span>
            </div>
            <Popconfirm title="确定删除该方案？" onOk={handleDelete}>
              <div className="action-item">
                <img src={deleteWebp} />
                <span>删除</span>
              </div>
            </Popconfirm>
          </div>
        )}
      </div>
    </Container>
  );
};

export default observer(PlanSelect);
