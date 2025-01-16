import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import indexStore from "../store";
import store from "../store/xclx.store";
import { debounce } from "lodash";
import {
  Grid,
  Switch,
  Checkbox,
  Input,
  Form,
  Select,
} from "@arco-design/web-react";
const { Row, Col } = Grid;

import { TitleBar } from "@/components";
import Title from "../component/title";
// import DeviceList from "./device-list";
import classNames from "classnames";
import IPC_3Url from "@/assets/img/home/IPC_3.png";
import IPC_1Url from "@/assets/img/home/IPC_1.png";
import BWCUrl from "@/assets/img/home/BWC.png";
import TOLLGATEUrl from "@/assets/img/home/TOLLGATE.png";
import { hasValue } from "@/kit";
import DeviceList from "../xingcheluxian/device-list";
import { featureDetail } from "@/mockData/index";
import { shebeiData, shebeiData1 } from "@/mockData/index";
import { deviceTypeObj } from "@/components/device-detail/index";
import { frameDetail, deviceNumById } from "../store/webapi";
import { getPlanId, getVenueId } from "../../../kit/util";

const InputSearch = Input.Search;
const FormItem = Form.Item;
const deviceImg = {
  IPC_3: IPC_3Url,
  IPC_1: IPC_1Url,
  BWC: BWCUrl,
  TOLLGATE: TOLLGATEUrl,
};
const deviceStatusList = [
  {
    label: "在线",
    value: "0",
    num: 118,
  },
  {
    label: "离线",
    value: "1",
    num: 18,
  },
  {
    label: "故障",
    value: "2",
    num: 28,
  },
];

const peopleTypeList = [
  { label: "警组", value: "警组" },
  { label: "警长", value: "警长" },
  { label: "警员", value: "警员" },
];
const LeftSide = () => {
  const [form] = Form.useForm();
  const [searchStatus, setSearchStatus] = useState(null);
  const [frameData, setFrameData] = useState([]);
  const { deviceTypes } = indexStore;
  const { deviceOpen, pliceOpen } = store;
  const venueId = getVenueId();
  const getCoreDetail = async () => {
    const planId = await getPlanId();
    frameDetail(venueId, planId).then((res) => {
      console.log(res.styleVOS);
      const data = res.styleVOS.filter((item) => {
        const { content } = item;
        if (content != "") item.content = JSON.parse(content);
        return item.content != "";
      });
      setFrameData(data[0].content);
    });
  };

  useEffect(() => {
    getCoreDetail();
    indexStore.changeState({
      leftVisible: false,
      rightVisible: false,
    });
    return () => {
      indexStore.changeState({
        deviceVisible: false,
        deviceCurrent: null,
      });
    };
  }, []);

  useEffect(() => {
    console.log(frameData, "frameDataframeData");
  }, [frameData]);
  const getDeviceStatusNum = (type) => {
    const { routerDevices = {} } = store;
    const { device = [] } = routerDevices || {};
    if (device?.length) {
      const arr = device.filter((item) => item.status == type);
      return arr.length;
    } else {
      return 0;
    }
  };
  const formChange = () => {
    const values = form.getFieldsValue();
    const { name, status, type } = values;
    const params = {
      name,
      status: status ? status.join() : "",
      type: type ? type.join() : "",
    };
    setSearchStatus(hasValue(params));
    store.getDeviceRoute(params);
  };
  const onDetail = (row) => {
    indexStore.changeState({
      deviceVisible: true,
      deviceCurrent: row,
    });
  };
  return (
    <div className="box-con">
      <Form
        layout="vertical"
        form={form}
        style={{ padding: "0 10px 14px" }}
        onChange={debounce(formChange, 600)}
      >
        <Title
          title="核心圈"
          after={
            <div className="device-switch">
              <label htmlFor="">设备上图</label>
              <Switch
                size="small"
                checked={deviceOpen}
                onChange={(val) => {
                  store.deviceOpen = val;
                }}
              />
            </div>
          }
        />
        <div className="device-attr-wrap">
          <div className="hexinqun-top">
            {frameData?.map((item, index) => {
              return (
                <div key={index}>
                  <TitleBar>
                    <div className="tit-con">
                      <label htmlFor="">{item.key}</label>
                    </div>
                  </TitleBar>
                  <p className="text-box">
                    <span>{item.value}</span>
                  </p>
                </div>
              );
            })}

            <TitleBar>
              <div className="tit-con">
                <label htmlFor="">关联设备</label>
              </div>
            </TitleBar>

            <FormItem
              field="type"
              style={{ marginBottom: 0 }}
              initialValue={shebeiData.device.map((item) => item.id)}
            >
              <Checkbox.Group className={"device-type-wrap"}>
                {shebeiData.device.map((item) => {
                  return (
                    <div className="arco-checkbox" key={item.id}>
                      <div className={classNames("device-type-item")}>
                        <div className="device-pic">
                          <img src={deviceImg[item.deviceType]} />
                        </div>
                        <div className="device-con">
                          <span>{deviceTypeObj[item.deviceType]}</span>
                          <div className="device-num">
                            {shebeiData?.deviceNum[item.deviceType] || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Checkbox.Group>
            </FormItem>
          </div>
        </div>

        <Title
          title="警力部署"
          style={{ marginBottom: 15 }}
          after={
            <div className="device-switch">
              <label htmlFor="">警力上图</label>
              <Switch
                size="small"
                checked={pliceOpen}
                onChange={(val) => {
                  store.pliceOpen = val;
                }}
              />
            </div>
          }
        />
        <div style={{ display: "flex" }}>
          <FormItem field="name" style={{ marginBottom: 0 }}>
            <Row gutter={5}>
              <Col span={17}>
                <FormItem field="keyword" style={{ marginBottom: 0 }}>
                  <InputSearch
                    autoComplete="off"
                    allowClear
                    placeholder="请输入设备名称搜索"
                    size="large"
                    onSearch={(val) => {
                      formChange();
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem
                  field="type"
                  style={{ marginBottom: 0 }}
                  initialValue={""}
                >
                  <Select
                    options={[{ label: "全部", value: "" }, ...peopleTypeList]}
                    placeholder="请选择"
                    size="large"
                  ></Select>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </div>
      </Form>
      <DeviceList
        type={"renyuan"}
        dataSourse={shebeiData1?.device || []}
        loading={false}
        searchStatus={searchStatus}
        onDetail={onDetail}
      />
    </div>
  );
};
const ObserverLeftSide = observer(LeftSide);
export default ObserverLeftSide;
