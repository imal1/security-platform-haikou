import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react";

import { Grid, Radio, Checkbox, Form, Input } from "@arco-design/web-react";
import Title from "../component/title";
import { KArcoTree, NoData, FilterModal, TitleBar } from "@/components";
import { debounce } from "lodash";
import filterUrl from "@/assets/img/icon-refresh.png";
import filterHoverUrl from "@/assets/img/icon-refresh-hover.png";
import classNames from "classnames";
import DeviceList from "@/pages/home/xingcheluxian/device-list";
import { hasValue } from "@/kit";
import "./index.less";
import { getPlanId, getVenueId } from "../../../kit/util";
import { deviceNumById } from "../store/webapi";
import DeviceFilter from "../../place-manage/component/FloatLeft/DeviceFilter";
const venueId = getVenueId();

const InputSearch = Input.Search;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const RightSide = () => {
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");
  const [deviceList, setDeviceList] = useState([]);
  const [searchStatus, setSearchStatus] = useState(null);

  const get2DeviceData = async () => {
    const planId = await getPlanId();
  };

  const getDeviceData = async () => {
    const planId = await getPlanId();

    deviceNumById(venueId, planId).then((res) => {
      console.log(res, "deviceNumByIddeviceNumById");
      setDeviceList(res);
    });
  };

  useEffect(() => {
    getDeviceData();
  }, []);

  const refresh = () => {
    console.log("shuaxin");
    getDeviceData();
  };

  const formChange = () => {
    const values = form.getFieldsValue();
    const { keyword } = values;
    const params = {
      keyword,
    };
    setSearchStatus(hasValue(params));
    console.log("search", keyword);
    getDeviceData();
  };

  const onDetail = (row) => {
    console.log("detail", row);
  };

  const handleDeviceFilter = ({ types, status }) => {
    // setTreeParams({ deviceTypes: types.join(","), status: status.join(",") });
  };

  return (
    <div className="box-con">
      <Title title="关联设备" />

      <Form
        layout="vertical"
        form={form}
        style={{ padding: "14px 10px" }}
        onChange={debounce(formChange, 600)}
      >
        <div style={{ display: "flex" }}>
          <FormItem field="keyword" style={{ marginBottom: 0, flex: 1 }}>
            <InputSearch
              autoComplete="off"
              allowClear
              placeholder="请输入关键字搜索要素名称"
              size="large"
              onSearch={(val) => {
                setInputValue(val);
              }}
              onChange={debounce((val) => {
                setInputValue(val);
              }, 600)}
            />
          </FormItem>
          <FormItem
            field=""
            style={{ marginBottom: 0, width: 42, marginLeft: 6 }}
            className={"filter-type-wrap"}
          >
            <DeviceFilter onFilter={handleDeviceFilter} right='178' />
          </FormItem>
          <div
            className={classNames("filter-modal-wrap")}
            style={{ marginLeft: 6 }}
            onClick={() => {
              refresh();
            }}
          >
            <img src={filterUrl} className="pic" alt="shuaxin" />
            <img src={filterHoverUrl} className="pic-hover" alt="" />
          </div>
        </div>
      </Form>
      <div className="public-scrollbar hexinqu-device-list">
        <DeviceList
          dataSourse={deviceList || []}
          loading={false}
          searchStatus={searchStatus}
          onDetail={onDetail}
        />
      </div>
    </div>
  );
};
const ObserverRightSide = observer(RightSide);
export default ObserverRightSide;
