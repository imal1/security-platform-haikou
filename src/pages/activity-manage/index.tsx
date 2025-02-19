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
      store.getList();
    } catch (error) {}
  };
  useEffect(() => {
    if (appStore.serviceRoutes) {
      store.getRegionAndChildren();
    }
  }, [appStore.serviceRoutes]);
  const {
    dataSource,
    dataStatus,
    modalVisible,
    activityTypes,
    sceneList,
    activityStatus,
    modalInfoVisible
  } = store;
  return (
    <div className={classNames(styles["activity-manage"])}>
      {modalVisible && <Add />}
      {modalInfoVisible&&<Info />}
      <Form
        form={form}
        style={{ width: "auto", marginTop: 20 }}
        layout="inline"
        className="query-form backend-form"
        onChange={debounce(store.getList, 600)}
      >
        <FormItem label="" field="activityName">
          <Input
            allowClear
            placeholder="请输入活动名称"
            style={{ width: 200 }}
          />
        </FormItem>
        <FormItem label="" field="sceneId">
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
            {activityStatus.map((option) => (
              <Option key={option.code} value={option.code} title={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          label=""
          field="date"
          initialValue={{
            startDay: dayjs().subtract(6, "month").format("YYYY-MM-DD"),
            finishDay: dayjs().add(6, "month").format("YYYY-MM-DD"),
          }}
          normalize={(value) => {
            return {
              startDay: value && value[0],
              finishDay: value && value[1],
            };
          }}
          formatter={(value) => {
            return value && value.startDay
              ? [value.startDay, value.finishDay]
              : [];
          }}
        >
          <RangePicker style={{ width: 260 }} />
        </FormItem>
        <FormItem className={"form-end"}>
          <Button
            type="secondary"
            onClick={() => {
              form.resetFields();
              store.getList();
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => {
              store.getList();
            }}
          >
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
