import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  Form,
  Input,
  Tag,
  Checkbox,
  Tooltip,
  Button,
} from "@arco-design/web-react";
import { IconFile } from "@arco-design/web-react/icon";
import {
  KArcoTree,
  NoData,
  FilterModal,
  TitleBar,
  DeviceDetail,
} from "@/components";
import { tryGet, Icons, deep,Trees } from "@/kit";
import { observer } from "mobx-react";
import store from "../store";
import iconRefreshUrl from "@/assets/img/icon-refresh.png";
import iconRefreshHoverUrl from "@/assets/img/icon-refresh-hover.png";
import classNames from "classnames";
import { debounce } from "lodash";
import appStore from "@/store";
const FormItem = Form.Item;
const InputSearch = Input.Search;
const { Row, Col } = Grid;
const deviceStatus = Icons.deviceStatus;
const CheckboxGroup = Checkbox.Group;
const deviceStatusList = [
  {
    label: "在线",
    value: "0",
  },
  {
    label: "离线",
    value: "1",
  },
  {
    label: "故障",
    value: "2",
  },
];
const {getFirstRootKeys} = Trees

const PerceptionDevice = ({ arrangeValue }) => {
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(["inherent", "temporary"]);
  const [selectedTemporaryKeys, setSelectedTemporaryKeys] = useState([]);
  const [expandedTemporaryKeys, setExpandedTemporaryKeys] = useState(["-1"]);
  const [inherentCheckedKeys, setInherentCheckedKeys] = useState([]);
  const [temporaryCheckedKeys, setTemporaryCheckedKeys] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const {
    deviceInherentTree,
    deviceTemporaryTree,
    drawCodes,
    featureTypes,
    deviceTypes,
    deviceTypeKeys,
    deviceStatusKeys,
  } = store;
  useEffect(() => {
    if (!store.viewer) return;
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      store.addDeviceLayer(
        inherentCheckedKeys,
        store.deviceInherentData,
        "inherent"
      );
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    inherentCheckedKeys,
    store.viewer,
    store.deviceFilterKeys,
    store.deviceNameVisible,
  ]);
  useEffect(() => {}, []);
  useEffect(() => {
    return () => {
      store.removeDeviceLayer("inherent");
      // store.removeDeviceLayer("temporary");
      store.changeState({
        deviceVisible: false,
        deviceCurrent: null,
      });
    };
  }, []);
  useEffect(() => {
    setFirstExpanded();
  }, [inputValue]);
  const setFirstExpanded = () => {
    try {
      const inherentData: any = searchData(store.deviceInherentTree);
      // 合并 keys
      if (inherentData?.length > 0) {
        setExpandedKeys([...getFirstRootKeys(inherentData,'id'),...getFirstRootKeys([inherentData[1]],'id')]);
      }
    } catch (error) {}
  };
  const getTreeTitle = (row) => {
    return (
      <div className="tree-title-wrap">
        {drawCodes.includes(row.featureCode) && (
          <>
            <Tag
              size="small"
              style={{
                backgroundColor: "rgba(215, 114, 42, 0.2)",
                borderColor: "#fd8022",
                color: "#fd8022",
                marginRight: 8,
              }}
              bordered
            >
              {featureTypes[row.featureCode]}
            </Tag>
          </>
        )}
        {!drawCodes.includes(row.featureCode) && row.featureCode && (
          <img
            src={store.icons[row.featureCode || row.deviceType]}
            style={{ width: 26, marginRight: 8 }}
          />
        )}
        {row.deviceType && (
          <>
            {row.status == 0 && (
              <Tag
                size="small"
                style={{
                  backgroundColor: "rgba(0, 255, 192, 0.2)",
                  borderColor: "#00ffc0",
                  color: "#00ffc0",
                  marginRight: 8,
                }}
                bordered
              >
                在线
              </Tag>
            )}
            {row.status == 1 && (
              <Tag
                size="small"
                style={{
                  backgroundColor: "rgba(186, 186, 186, 0.2)",
                  borderColor: "#bababa",
                  color: "#bababa",
                  marginRight: 8,
                }}
                bordered
              >
                离线
              </Tag>
            )}
            {row.status == 2 && (
              <Tag
                size="small"
                style={{
                  backgroundColor: "rgba(216, 73, 44, 0.2)",
                  borderColor: "#d8492c",
                  color: "#d8492c",
                  marginRight: 8,
                }}
                bordered
              >
                故障
              </Tag>
            )}

            <img
              src={deviceStatus[`${row.deviceType}_${row.status}`]}
              style={{ width: 26, marginRight: 8 }}
            />
          </>
        )}

        {row.title.length > 8 ? (
          <Tooltip content={row.title}>
            <span className="tree-tit text-overflow">{row.title}</span>
          </Tooltip>
        ) : (
          <span className="tree-tit text-overflow">{row.title}</span>
        )}
        {row.deviceType && (
          <div className="device-info">
            <Tooltip content={"详情"}>
              <Button
                type="text"
                size="mini"
                style={{ color: "#38eefb", padding: "2px 7px" }}
                icon={<IconFile style={{ fontSize: 18 }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDetail({
                    ...row,
                    layerType: "inherent",
                  });
                }}
              ></Button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  };
  const searchData = (TreeData) => {
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        if (item.featureName.toLowerCase().includes(inputValue.toLowerCase())) {
          result.push({
            ...item,
            children: item.children?.length ? loop(item.children) : [],
          });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({ ...item, children: filterData });
          }
        }
      });
      return result;
    };
    return loop(TreeData);
  };
  const filterNode = (item) => {
    if (["inherent", "temporary"].includes(item.id)) return true;
    // 检查子节点是否满足条件
    const hasMatchingChildren = item.children?.some((child) =>
      filterNode(child)
    );
    return (
      item.featureName.toLowerCase().includes(inputValue.toLowerCase()) ||
      hasMatchingChildren
    );
  };
  const itemClick = async (item, type) => {
    const { locationpoint, deviceType, gbid } = item.props;
    if (locationpoint?.length > 0) {
      store.viewer.flyTo({
        lng: locationpoint[0],
        lat: locationpoint[1],
        alt: appStore.devicePerspectiveVisible ? 800 : 100,
        pitch: -90,
      });
    } else {
      gbid && appStore.getLayerServiceQuery(gbid, store.viewer);
    }
    const layer = store.devicelayerObj[type][deviceType];
    const layerId = store.devicelayerIds[type][deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };
  const onDetail = (row) => {
    store.changeState({
      deviceVisible: true,
      deviceCurrent: row,
    });
    const { layerType, deviceType, gbid } = row;
    const layer = store.devicelayerObj[layerType][deviceType];
    const layerId = store.devicelayerIds[layerType][deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };
  return (
    <div
      className="police-deployment arrange-wrap perception-device"
      style={{ display: arrangeValue === "gzsb" ? "flex" : "none" }}
    >
      <Form layout="vertical" form={form} style={{ padding: "14px 10px" }}>
        <div style={{ display: "flex" }}>
          <FormItem field="keyword" style={{ marginBottom: 0, flex: 1 }}>
            <InputSearch
              autoComplete="off"
              allowClear
              placeholder="请输入关键字搜索设备名称"
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
            <FilterModal
              title="设备筛选"
              triggerProps={{
                getPopupContainer: () =>
                  document.querySelector(".perception-device"),
              }}
              height={240}
            >
              <TitleBar>设备类型</TitleBar>
              <CheckboxGroup
                value={deviceTypeKeys}
                options={deviceTypes}
                onChange={(val) => {
                  store.deviceTypeKeys = val;
                  store.getDeviceTree();
                }}
                className={"def-checkGroup2"}
              />
              <TitleBar>设备状态</TitleBar>
              <CheckboxGroup
                value={deviceStatusKeys}
                // options={deviceStatusList}
                onChange={(val) => {
                  store.deviceStatusKeys = val;
                  store.getDeviceTree();
                }}
                className={"def-checkGroup2"}
              >
                {deviceStatusList.map((item) => (
                  <Checkbox key={item.value} value={item.value}>
                    <span
                      className={classNames(
                        "check-item",
                        item.value === "1" && "offline",
                        item.value === "2" && "fault"
                      )}
                    >
                      <span className="dot"></span>
                      <span>{item.label}</span>
                    </span>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </FilterModal>
          </FormItem>
          <FormItem
            field=""
            style={{ marginBottom: 0, width: 42, marginLeft: 6 }}
          >
            <div
              className="filter-box"
              onClick={() => {
                store.getDeviceTree();
              }}
            >
              <img src={iconRefreshUrl} className="pic" alt="" />
              <img src={iconRefreshHoverUrl} className="pic-hover" alt="" />
            </div>
          </FormItem>
        </div>
      </Form>
      <div className="people-tree-wrap" id={"jiFangTrdee"}>
        {searchData(deviceInherentTree)?.length === 0 ? (
          <>
            <NoData
              isAnbo
              status={
                deviceTypeKeys.length === 0 ||
                deviceStatusKeys.length === 0 ||
                inputValue
                  ? true
                  : false
              }
              image_width={"200px"}
            />
          </>
        ) : (
          <>
            <KArcoTree
              treeData={deviceInherentTree}
              filterNode={filterNode}
              blockNode
              className="organization-tree public-scrollbar"
              style={{ maxHeight: "100%" }}
              checkable
              renderTitle={(options: any) => {
                return getTreeTitle(options);
              }}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              checkedKeys={inherentCheckedKeys}
              onCheck={(checkedKeys) => {
                setInherentCheckedKeys(checkedKeys);
              }}
              fieldNames={{
                key: "id",
                title: "featureName",
              }}
              onSelect={(selectedKeys, { selected, selectedNodes, node }) => {
                setSelectedKeys(selectedKeys);
                itemClick(node, "inherent");
              }}
              onExpand={(keys, extra) => {
                setExpandedKeys(keys);
              }}
              setExpandedKeys={setExpandedKeys}
              virtualListProps={{
                height: 800,
              }}
            ></KArcoTree>
            {/* <KArcoTree
              treeData={deviceTemporaryTree}
              filterNode={filterNode}
              blockNode
              className="organization-tree"
              checkable
              renderTitle={(options: any) => {
                return getTreeTitle2(options);
              }}
              selectedKeys={selectedTemporaryKeys}
              expandedKeys={expandedTemporaryKeys}
              checkedKeys={temporaryCheckedKeys}
              onCheck={(checkedKeys) => {
                setTemporaryCheckedKeys(checkedKeys);
              }}
              fieldNames={{
                key: "id",
                title: "featureName",
              }}
              onSelect={(selectedKeys, { selected, selectedNodes, node }) => {
                setSelectedTemporaryKeys(selectedKeys);
                itemClick(node, "temporary");
              }}
              onExpand={(keys, extra) => {
                setExpandedTemporaryKeys(keys);
              }}
              setExpandedKeys={setExpandedTemporaryKeys}
              virtualListProps={{
                height:
                  document.getElementById("jiFangTrdee")?.clientHeight || 500,
              }}
            ></KArcoTree> */}
          </>
        )}
      </div>
    </div>
  );
};

export default observer(PerceptionDevice);
