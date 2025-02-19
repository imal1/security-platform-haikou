/**
 * 活动方案管理
 */
import { NoData } from "@/components";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
} from "@arco-design/web-react";
import classNames from "classnames";
import { debounce } from "lodash";
import { observer } from "mobx-react";
import { useEffect } from "react";
import List from "./component/list";
import styles from "./index.module.less";
import store from "./store";
const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const ActivityManage = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    store.changeState({ tableForm: form });
  }, [form]);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    try {
      await store.initialData();
      formChange();
    } catch (error) {}
  };
  const formChange = async () => {
    // await store.getList();
  };
  const { dataStatus, dataSource } = store;
  return (
    <div className={classNames(styles["activity-plan-manage"])}>
      <Form
        form={form}
        style={{ width: "auto", marginTop: 20 }}
        layout="inline"
        className="query-form backend-form"
        onChange={debounce(formChange, 600)}
      >
        <FormItem label="" field="serviceCode">
          <InputSearch
            allowClear
            placeholder="请输入活动名称"
            style={{ width: 200 }}
            onSearch={formChange}
          />
        </FormItem>
        <FormItem
          label=""
          field="date"
          // initialValue={{
          //   startDate: dayjs().subtract(6, "month").format("YYYY-MM-DD"),
          //   endDate: dayjs().add(6, "month").format("YYYY-MM-DD"),
          // }}
          normalize={(value) => {
            return {
              startDate: value && value[0],
              endDate: value && value[1],
            };
          }}
          formatter={(value) => {
            return value && value.startDate
              ? [value.startDate, value.endDate]
              : [];
          }}
        >
          <RangePicker />
        </FormItem>
        <FormItem label="" field="activityType">
          <Select
            placeholder="请选择活动类型"
            style={{ width: 200 }}
            allowClear
            showSearch
            getPopupContainer={() => document.querySelector(".query-form")}
            filterOption={(input, option) =>
              (option.props?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {[].map((option) => (
              <Option
                key={option.serviceCode}
                value={option.serviceName}
                title={option.serviceName}
              >
                {option.serviceName}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem className={"form-end"}>
          <Button type="secondary">重置</Button>
          <Button type="primary" style={{ marginLeft: 10 }}>
            搜索
          </Button>
        </FormItem>
      </Form>
      {dataSource?.length > 0 ? (
        <List />
      ) : (
        <div className="activity-plan-con">
          <NoData status={dataStatus} />
        </div>
      )}
    </div>
  );
};
export default observer(ActivityManage);
