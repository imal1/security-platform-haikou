import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import store from "../../store/attributes-store";
import {
  Modal,
  Input,
  TableColumnProps,
  Radio,
  Checkbox,
  Select,
  Button,
} from "@arco-design/web-react";
import { KArcoTable, NoData, KArcoTree } from "@/components";
import { IconLeft, IconRight } from "@arco-design/web-react/icon";
import TitleBar from "../title-bar";
import filterUrl from "@/assets/img/place-manage/filter.png";
import filterHoverUrl from "@/assets/img/place-manage/filter-hover.png";
import { tryGet, deep, Icons } from "@/kit";

const InputSearch = Input.Search;
const Option = Select.Option;
const deviceIcon = {
  TOLLGATE: Icons.devices?.KKON,
  IPC_3: Icons.devices?.QJON,
  IPC_1: Icons.devices?.QIUJION,
  BWC: Icons.devices?.ZFJLYON,
};

const statusList = [
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
const AddDevice = () => {
  const {
    modalVisible,
    filterTypes,
    deviceTypes,
    activeType,
    filterVisible,
    filterCodes,
    statusCodes,
    tagList,
    tagIds,
    deviceGroupTree,
    totalStatistical,
    deviceFilterParams,
  } = store;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [tableCheckedKeys, setTableCheckedKeys] = useState([]);
  const [status, setStatus] = useState(["0", "1", "2"]);
  const [ids, setIds] = useState([]);
  const [typeCodes, setTypeCodes] = useState(filterCodes);
  const [keyword, setKeyword] = useState("");
  const idsToRemove = useMemo(() => {
    const ids = dataSource.map((item) => item.gbid);
    return ids;
  }, [dataSource, checkedKeys]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      // onInputSearch(keyword);
    }, 1000);

    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      store.getDeviceGroup();
    }, 600);

    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [store.deviceFilterParams]);
  useEffect(() => {
    return () => {
      store.changeState({
        activeType: filterTypes[0]?.value,
        deviceFilterParams: {
          withRole: false,
          deviceStatus: "0,1,2",
          tag: "",
          deviceName: "",
          deviceTypes: filterTypes[0]?.value,
        },
      });
    };
  }, []);
  useEffect(() => {
    setDataSource(store.devices);
  }, [store.devices]);
  useEffect(() => {
    setTableCheckedKeys([]);
  }, [dataSource]);
  useState();
  const renderIndexColumn = (text, record, index) => {
    return index + 1; // 根据行索引生成序号
  };
  const columns: TableColumnProps[] = [
    {
      title: "序号",
      dataIndex: "index",
      width: 80,
      //   fixed: "left",
      render: renderIndexColumn,
    },
    {
      title: "设备GBID",
      dataIndex: "deviceName",
      autoEllipsisCheck: true,
      render(col, item, index) {
        return col + item.gbid;
      },
    },
  ];
  const getTreeTitle = (row) => {
    return (
      <div className="device-tree-title-wrap">
        <div className="name">{row.title}</div>
        {row.nodeType == "group" && (
          <div className="status-opts">
            <label htmlFor="">{tryGet(row, "statistical.total") || 0}</label>
            <div className="status">
              <div className="status-li">
                <span></span>(
                {tryGet(row, "statistical.items")
                  ? tryGet(row, "statistical.items")[0] || 0
                  : 0}
                )
              </div>
              <div className="status-li">
                <span></span>(
                {tryGet(row, "statistical.items")
                  ? tryGet(row, "statistical.items")[1] || 0
                  : 0}
                )
              </div>
              <div className="status-li">
                <span></span>(
                {tryGet(row, "statistical.items")
                  ? tryGet(row, "statistical.items")[2] || 0
                  : 0}
                )
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const onCancel = () => {
    store.modalVisible = false;
  };
  const onOk = async () => {
    console.log(dataSource, "dataSource");
    store.setDevices(dataSource);
    onCancel();
  };
  const onFilterCancel = () => {
    store.filterVisible = false;
    setTypeCodes(store.filterCodes);
    setIds(store.tagIds.split(","));
    setStatus(store.statusCodes.split(","));
  };
  const onFilterOk = async () => {
    console.log("ok");
    store.changeState({
      statusCodes: status,
      tagIds: ids,
      deviceFilterParams: {
        ...store.deviceFilterParams,
        deviceStatus: status.join(),
        tag: ids.join(),
      },
      filterCodes: typeCodes,
      filterVisible: false,
    });
    store.filterTypes = deviceTypes.filter((item) =>
      typeCodes.includes(item.value)
    );
  };
  console.log(store.deviceGroupTree, "devices");

  const loadMore = (treeNode) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (treeNode.props.nodeType === "group") {
          let data = await store.getdeviceGroupList(treeNode.props._key);
          treeNode.props.dataRef.children = data;
          // console.log(store.deviceGroupTree,'store.deviceGroupTree')
          // console.log(deviceGroupTree,'deviceGroupTree')
          resolve(true);
        } else {
          resolve(true);
        }
      }, 1000);
    });
  };

  const filterDom = () => {
    return (
      <Modal
        title="添加设备"
        visible={filterVisible}
        className="filter-modal small-modal"
        onOk={onFilterOk}
        onCancel={onFilterCancel}
        mask={false}
        autoFocus={false}
        focusLock={true}
        getPopupContainer={() => document.querySelector(".add-device-warp")}
      >
        <TitleBar
          content={"设备类型"}
          style={{ marginTop: 14, marginBottom: 14 }}
        />
        <Checkbox.Group
          value={typeCodes}
          // options={deviceTypes}
          onChange={(val) => {
            setTypeCodes(val);
          }}
        >
          {deviceTypes.map((item) => (
            <Checkbox
              key={item.value}
              value={item.value}
              disabled={
                filterCodes.length === 1 && filterCodes.includes(item.value)
              }
            >
              {item.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
        <TitleBar
          content={"设备状态"}
          style={{ marginTop: 14, marginBottom: 14 }}
        />
        <Checkbox.Group
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
        >
          {statusList.map((item) => (
            <Checkbox
              key={item.value}
              value={item.value}
              disabled={
                statusCodes.length === 1 && statusCodes.includes(item.value)
              }
            >
              {item.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
        <TitleBar
          content={"设备标签"}
          style={{ marginTop: 14, marginBottom: 14 }}
        />
        <Select
          mode="multiple"
          placeholder="请选择标签"
          value={ids}
          // style={{ width: 345 }}
          onChange={(val) => {
            setIds(val);
          }}
          allowClear
        >
          {tagList.map((option) => (
            <Option key={option.tagId} value={option.tagId}>
              {option.tagName}
            </Option>
          ))}
        </Select>
      </Modal>
    );
  };
  const filterTree = (tree) => {
    return tree.reduce((acc, node) => {
      // 如果当前节点的ID不在idsToRemove列表中，处理这个节点
      if (!idsToRemove.includes(node.key)) {
        // 如果有子节点，递归过滤子节点
        if (node.children && node.children.length > 0) {
          const filteredChildren = filterTree(node.children);
          // 只有当过滤后的子节点数组非空时，才添加到结果中
          if (filteredChildren.length > 0) {
            acc.push({ ...node, children: filteredChildren });
          } else {
            // 如果子节点被全部过滤掉，添加没有children属性的节点
            const { children, ...rest } = node;
            acc.push(rest);
          }
        } else {
          // 如果没有子节点，直接添加这个节点
          acc.push(node);
        }
      }
      return acc;
    }, []);
  };
  return (
    <Modal
      title="添加设备"
      className={"add-device-modal"}
      // visible={modalVisible}
      onOk={onOk}
      onCancel={onCancel}
      autoFocus={false}
      focusLock={true}
      style={{ width: 1000 }}
      getPopupContainer={() => document.querySelector(".attr-from")}
    >
      <div className="add-device-warp">
        {filterDom()}
        <div className="device-list-wrap">
          <div className="device-header-left">
            <label>设备列表</label>
            <div
              className={`header-filter ${store.filterVisible ? "active" : ""}`}
              onClick={() => {
                store.filterVisible = true;
              }}
            >
              <span>筛选</span>
              <img src={filterUrl} alt="" className="pic" />
              <img src={filterHoverUrl} alt="" className="pic-hover" />
            </div>
          </div>
          <div className="设备"></div>

          <div className="device-box">
            <Radio.Group
              className="radio-group-buttons device-list-group"
              value={activeType}
              onChange={(val) => {
                store.deviceFilterParams = {
                  ...store.deviceFilterParams,
                  deviceTypes: val,
                };
                store.activeType = val;
              }}
              type="button"
            >
              {[...filterTypes].map((item) => (
                <Radio key={item.value} value={item.value}>
                  <div
                    className={`device-tab ${item.value == activeType ? "active" : ""
                      }`}
                  >
                    {item.label}
                  </div>
                </Radio>
              ))}
            </Radio.Group>
            <div className="device-left-con">
              <div className="header">
                <div className="title">
                  <img src={deviceIcon[activeType]} alt="" />
                  <span>
                    {
                      filterTypes.find((item) => item.value == activeType)
                        ?.label
                    }
                  </span>
                </div>
                <div className="device-total">
                  总数：{totalStatistical?.total || 0}
                </div>
              </div>
              <div className="device-con-search">
                <InputSearch
                  autoComplete="off"
                  allowClear
                  placeholder="请输入GBID或设备名称或分组名"
                  value={deviceFilterParams.deviceName}
                  onChange={(val) => {
                    store.deviceFilterParams = {
                      ...store.deviceFilterParams,
                      deviceName: val,
                    };
                  }}
                // onSearch={formChange}
                />
              </div>
              <div className="device-status-wrap">
                <div className="status-li">
                  <span></span>在线(
                  {tryGet(totalStatistical, "items")
                    ? tryGet(totalStatistical, "items")[0] || 0
                    : 0}
                  )
                </div>
                <div className="status-li">
                  <span></span>离线(
                  {tryGet(totalStatistical, "items")
                    ? tryGet(totalStatistical, "items")[1] || 0
                    : 0}
                  ))
                </div>
                <div className="status-li">
                  <span></span>故障(
                  {tryGet(totalStatistical, "items")
                    ? tryGet(totalStatistical, "items")[2] || 0
                    : 0}
                  ))
                </div>
              </div>
              <div className="device-list">
                <KArcoTree
                  treeData={filterTree(store.deviceGroupTree)}
                  blockNode
                  loadMore={loadMore}
                  onCheck={(value) => {
                    setCheckedKeys(value);
                  }}
                  className="organization-tree expand-tree-select"
                  renderTitle={(options: any) => {
                    return getTreeTitle(options);
                  }}
                  checkedKeys={checkedKeys}
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  fieldNames={
                    {
                      // key: "orgCode",
                      // title: "orgName",
                      // children: "child",
                    }
                  }
                  onSelect={(
                    selectedKeys,
                    { selected, selectedNodes, node }
                  ) => {
                    setSelectedKeys(selectedKeys);
                  }}
                  onExpand={(keys) => {
                    setExpandedKeys(keys);
                  }}
                // setExpandedKeys={setExpandedKeys}
                ></KArcoTree>
              </div>
            </div>
          </div>
        </div>
        <div className="device-arrow-warp">
          <Button
            className="arrow-item"
            shape="circle"
            disabled={tableCheckedKeys.length == 0}
            onClick={() => {
              const data = dataSource.filter(
                (item) => !tableCheckedKeys.includes(item.gbid)
              );
              setDataSource([...data]);
              setTableCheckedKeys([]);
            }}
            icon={<IconLeft />}
          ></Button>
          <Button
            className="arrow-item"
            shape="circle"
            disabled={checkedKeys.length == 0}
            onClick={() => {
              let data = store.shuttleData();
              const list = data
                .filter((item) => checkedKeys.includes(item.key) && item.gbid)
                .map((item) => {
                  return {
                    deviceName: item.deviceName,
                    gbid: item.key,
                    deviceType: item.deviceType,
                    cameraForm: item.cameraForm,
                  };
                });
              setDataSource([...deep(dataSource), ...list]);
              setCheckedKeys([]);
            }}
            icon={<IconRight />}
          ></Button>
        </div>
        <div className="select-list-wrap">
          <div className="device-header-right">
            <label>已选设备</label>
            <div className="device-num">
              <label>总数</label>
              <span>{dataSource?.length || 0}</span>
            </div>
          </div>
          <div className="device-con">
            <div className="device-con-search">
              <InputSearch
                autoComplete="off"
                allowClear
                placeholder="请输入GBID或设备名称"
                value={keyword}
                onChange={(val) => {
                  setKeyword(val);
                }}
              // onSearch={formChange}
              />
            </div>
            <KArcoTable
              columns={columns}
              border={false}
              //   loading={loading}
              data={dataSource.filter(
                (item) =>
                  item.gbid?.includes(keyword) ||
                  item.deviceName?.includes(keyword)
              )}
              rowKey={(record) => record.gbid}
              style={{ marginBottom: 20 }}
              scroll={{
                y: 360,
              }}
              rowSelection={{
                columnWidth: 60,
                type: "checkbox",
                onChange: (selectedRowKeys, selectedRows) => {
                  console.log(selectedRowKeys, selectedRows);
                  setTableCheckedKeys(selectedRowKeys);
                },
              }}
              pagination={false}
              noDataElement={<NoData status={false} height={300} />}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default observer(AddDevice);
