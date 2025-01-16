import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { IconClose, IconLocation } from "@arco-design/web-react/icon";
// import { IconExchange } from "@arco-iconbox/react-pgisicon";
import { Input, Form, Space, Button } from "@arco-design/web-react";
import { observer } from "mobx-react";
import store from "./store";
import "./index.less";
import walkIcon from "@/assets/img/plan/walk.svg";
import walkSelectIcon from "@/assets/img/plan/walk-select.svg";
import driveIcon from "@/assets/img/plan/drive.svg";
import driveSelectIcon from "@/assets/img/plan/drive-select.svg";
import addIcon from "@/assets/img/plan/add.svg";
import closeIcon from "@/assets/img/plan/close.svg";
import reduceIcon from "@/assets/img/plan/reduce.svg";
const FormItem = Form.Item;

const trafficTypeList: any = [
  {
    label: "驾车",
    value: "drive",
    iconUrl: driveIcon,
    iconSelectUrl: driveSelectIcon,
  },
  {
    label: "步行",
    value: "walk",
    iconUrl: walkIcon,
    iconSelectUrl: walkSelectIcon,
  },
];
const Planning = (props) => {
  const { kmap } = props;
  const [form] = Form.useForm();
  const [active, setActive] = useState("drive");

  useEffect(() => {
    initial();
    return () => {
      store.initialData();
    };
  }, []);
  useEffect(() => {
    store.wayPoint.forEach((item, index) => {});
  }, [store.wayPoint?.length]);
  const initial = async () => {
    await store.initialData();
    store.changeState({ formObj: form });
  };
  // search
  const onInputSearch = (val: string, pageNo = 1) => {
    if (!kmap) return;
    if (val) {
      kmap.queryInfoByType({
        // 全国
        code: "100000",
        keyword: val,
        searchType: [],
        maxCount: 10,
        pageNo,
        callback: function (res) {
          if (Array.isArray(res.data)) {
            store.changeState({ addressList: res.data });
            // setAddresses(res.data);
            // setAddressTotal(res.total);
          }
        },
      });
    } else {
      store.changeState({ addressList: [] });
    }
  };
  const formChange = async (value, values) => {
    console.log(value, values);
    let firstKey = Object.keys(value)[0]; // 获取第一个键
    let firstValue = value[firstKey]; // 获取第一个值
    store.changeState({ currentKey: firstKey });
    onInputSearch(firstValue);
  };
  const {
    wayPoint = [],
    addWayPoint,
    reduceWayPoint,
    wayMaxNum,
    addressList,
  } = store;
  return (
    <div className="planning-wrap">
      <div className="planning-form-box">
        <div className="planning-close">
          <IconClose />
        </div>
        <ul className="traffic-tab">
          {trafficTypeList.map((item) => (
            <li
              key={item.value}
              className={`${
                item.value === active ? "tab-li select" : "tab-li"
              }`}
              onClick={() => {
                setActive(item.value);
              }}
            >
              <img src={item.iconUrl} alt={item.label} className="pic" />
              <img
                src={item.iconSelectUrl}
                alt={item.label}
                className="pic-select"
              />
            </li>
          ))}
        </ul>
        <div className="plan-form-wrap">
          <div className="plan-change">
            {/* <IconExchange /> */}
          </div>
          <Form
            className="plan-form"
            form={form}
            layout="vertical"
            onChange={debounce(formChange, 600)}
          >
            <Space size={13}>
              <FormItem label="" field="startPoint">
                <Input
                  autoComplete="off"
                  prefix={<span>起</span>}
                  placeholder="请输入起点"
                  size="large"
                  style={{ width: 270 }}
                  allowClear
                  clearIcon={<img src={closeIcon} style={{ marginTop: 4 }} />}
                />
              </FormItem>
            </Space>
            {wayPoint.map((item, index) => (
              <Space size={13} key={item.key}>
                <FormItem label="" field={`way_${item.key}`}>
                  <Input
                    autoComplete="off"
                    placeholder="请输入途经点"
                    prefix={<span>经</span>}
                    size="large"
                    style={{ width: 270 }}
                    allowClear
                    clearIcon={<img src={closeIcon} style={{ marginTop: 4 }} />}
                  />
                </FormItem>
                <div className="wayoper">
                  <img
                    src={reduceIcon}
                    onClick={() => {
                      reduceWayPoint(item.key);
                    }}
                  />
                </div>
              </Space>
            ))}
            <Space
              size={13}
              className={`${wayPoint?.length > 0 ? "" : "moveup"}`}
            >
              <FormItem label="" field="endPoint" style={{ marginBottom: 0 }}>
                <Input
                  autoComplete="off"
                  placeholder="请输入终点"
                  prefix={<span>终</span>}
                  size="large"
                  style={{ width: 270 }}
                  allowClear
                  clearIcon={<img src={closeIcon} style={{ marginTop: 4 }} />}
                />
              </FormItem>
              <div
                style={{
                  height: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {wayPoint?.length < wayMaxNum && (
                  <img
                    src={addIcon}
                    onClick={() => {
                      addWayPoint();
                    }}
                  />
                )}
              </div>
            </Space>
          </Form>
        </div>
        <div className="plan-to-wrap">
          <div className="clear-plan">清除路线</div>
          <Button type="primary" className="plan-btn">
            {active === "drive" ? "开车去" : "走路去"}
          </Button>
        </div>
      </div>
      <div className="planning-con">
        {/* 路径规划方案 */}
        <div className="plan-programme-wrap"></div>
        {/* 地址输入搜索 */}
        <div className="plan-search-list">
          {addressList.map((item, index) => (
            <div className="plan-search-li" key={index}>
              <IconLocation />
              <label htmlFor="">{item.name || item.address}</label>
              <span className="text-overflow">{item.address}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(Planning);
