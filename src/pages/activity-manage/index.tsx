/**
 * 活动管理
 */
import { NoData } from "@/components";
import appStore from "@/store";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
} from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import classNames from "classnames";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { observer } from "mobx-react";
import { useEffect } from "react";
import Add from "./component/add";
import Info from "./component/info";
import List from "./component/list";
import styles from "./index.module.less";
import store from "./store";
const FormItem = Form.Item;
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
  useEffect(() => {
    if (appStore.serviceRoutes) {
      store.getRegionAndChildren();
    }
  }, [appStore.serviceRoutes]);
  const formChange = async () => {
    store.clearPager();
    await store.getList();
  };
  const {
    dataSource,
    loading,
    getList,
    dataStatus,
    modalVisible,
    activityTypes,
    sceneList,
  } = store;
  return (
    <div className={classNames(styles["activity-manage"])}>
      {modalVisible && <Add />}
      <Info />
      <Form
        form={form}
        style={{ width: "auto", marginTop: 20 }}
        layout="inline"
        className="query-form backend-form"
        onChange={debounce(formChange, 600)}
      >
        <FormItem label="" field="serviceCode">
          <Input
            allowClear
            placeholder="请输入活动名称"
            style={{ width: 200 }}
          />
        </FormItem>
        <FormItem label="" field="serviceName">
          <Select
            placeholder="请选择活动场景"
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
            {sceneList.map((option) => (
              <Option
                key={option.id}
                value={option.id}
                title={option.sceneName}
              >
                {option.sceneName}
              </Option>
            ))}
          </Select>
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
            {activityTypes.map((option) => (
              <Option key={option.code} value={option.code} title={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="" field="activityStatus">
          <Select
            placeholder="请选择活动状态"
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
        <FormItem
          label=""
          field="date"
          initialValue={{
            startDate: dayjs().subtract(6, "month").format("YYYY-MM-DD"),
            endDate: dayjs().add(6, "month").format("YYYY-MM-DD"),
          }}
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
          <RangePicker style={{ width: 260 }} />
        </FormItem>
        <FormItem className={"form-end"}>
          <Button type="secondary">重置</Button>
          <Button type="primary" style={{ marginLeft: 10 }}>
            搜索
          </Button>
        </FormItem>
      </Form>
      <div className="activity-manage-con-warp">
        <div>
          <Button
            type="secondary"
            icon={<IconPlus />}
            onClick={() => {
              store.modalVisible = true;
              store.current = null;
            }}
          >
            新增活动
          </Button>
        </div>

        {dataSource?.length > 0 ? (
          <List />
        ) : (
          <div className="activity-con">
            <NoData status={dataStatus} />
          </div>
        )}
      </div>
    </div>
  );
};
export default observer(ActivityManage);
