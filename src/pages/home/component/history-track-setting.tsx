import React, { useEffect, useState, useRef, memo } from "react";
import { observer } from "mobx-react";
import store from "../store";
import {
  Modal,
  Form,
  Button,
  DatePicker,
  Select,
} from "@arco-design/web-react";
import dayjs from "dayjs";
import { filter } from "lodash";
// store.historyVisible = false;
const FormItem = Form.Item;
const filterList = [
  {
    label: "1小时",
    value: "1",
  },
  {
    label: "3小时",
    value: "3",
  },
  {
    label: "5小时",
    value: "5",
  },
  {
    label: "8小时",
    value: "8",
  },
  {
    label: "24小时",
    value: "24",
  },
];
const HistoryTrackSetting = () => {
  const { historyVisible } = store;
  const [form] = Form.useForm();
  const [startTime, setStartTime] = useState(
    dayjs().subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss")
  );
  const [endTime, setEndTime] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  useEffect(() => {
    store.historyParams = null;
  }, []);
  const changeTimeRange = (val) => {
    const count = Number(val);
    const start = dayjs().subtract(count, "hour").format("YYYY-MM-DD HH:mm:ss");
    const end = dayjs().format("YYYY-MM-DD HH:mm:ss");
    setStartTime(start);
    setEndTime(start);
    form.setFieldsValue({
      startTime: start,
      endTime: end,
    });
  };
  const oncancel = () => {
    store.historyVisible = false;
    store.trackType = "";
  };
  const onOk = async () => {
    try {
      const values = await form.validate();
      store.historyParams = values;
      store.historyVisible = false;

      store.addHistorytrack(values.startTime, values.endTime);
    } catch (error) {}
  };
  const reset = () => {
    changeTimeRange(1);
    form.setFieldsValue({
      filter: "1",
    });
  };
  return (
    <Modal
      title="查询历史轨迹"
      visible={historyVisible}
      onCancel={oncancel}
      autoFocus={false}
      focusLock={true}
      mask={false}
      footer={
        <div>
          <Button type="secondary" onClick={oncancel}>
            取消
          </Button>
          <Button type="secondary" onClick={reset} style={{ marginLeft: 10 }}>
            重置
          </Button>
          <Button type="primary" onClick={onOk}>
            确定
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        initialValues={{ name: "admin" }}
        autoComplete="off"
        onValuesChange={(v, vs) => {
          console.log(v, vs);
        }}
        onSubmit={(v) => {
          console.log(v);
        }}
      >
        <FormItem
          label="开始时间"
          field="startTime"
          initialValue={startTime}
          rules={[{ required: true, message: "请选择开始时间" }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            onChange={(val) => {
              setStartTime(val);
              form.setFieldValue("filter", undefined);
            }}
            disabledDate={(current) =>
              current.isAfter(dayjs()) ||
              current.isAfter(dayjs(endTime)) ||
              current.isBefore(dayjs().subtract(1, "month"))
            }
          />
        </FormItem>
        <FormItem
          label="结束时间"
          field="endTime"
          rules={[{ required: true, message: "请选择结束时间" }]}
          initialValue={endTime}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            onChange={(val) => {
              setEndTime(val);
              form.setFieldValue("filter", undefined);
            }}
            disabledDate={(current) =>
              current.isAfter(dayjs()) ||
              current.isBefore(dayjs(startTime).subtract(1, "day")) ||
              current.isBefore(dayjs().subtract(1, "month"))
            }
          />
        </FormItem>
        <FormItem label="快速筛选" field="filter" initialValue={"1"}>
          <Select
            options={filterList}
            placeholder="请选择"
            onChange={changeTimeRange}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default memo(observer(HistoryTrackSetting));
