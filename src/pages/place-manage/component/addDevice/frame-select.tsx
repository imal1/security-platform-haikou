import styles from "./index.module.less";
import { useState, useEffect, memo } from "react";
import { observer } from "mobx-react";
import {
  Input,
  Button,
  Message,
  Tooltip,
  Checkbox,
} from "@arco-design/web-react";
import exh_center from "@/assets/img/place-manage/exh-center.png";
import store from "../../store/index";
import storeAttr from "../../store/attributes-store";
import { KArcoTree, FilterModal, TitleBar } from "@/components";
import { debounce } from "lodash";
import { tryGet, deep } from "@/kit";
import classNames from "classnames";
import deviceTypeUrl from "@/assets/img/place-manage/device-type.png";
import appStore from "@/store";
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
const FrameSelect = () => {
  const { filterTypes } = store;
  const [deviceTypeKeys, setDeviceTypeKeys] = useState([]);
  const [deviceStatusKeys, setDeviceStatusKeys] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [frameCheckedKeys, setFrameCheckedKeys] = useState([]);
  const [frameExpandedKeys, setFrameExpandedKeys] = useState([]);
  const [deviceTotal, setDeviceTotal] = useState(0);
  const [frameData, setFrameData] = useState([]);

  useEffect(() => {
    storeAttr.updateDeviceChecks();
  }, []);
  useEffect(() => {
    init();
  }, [storeAttr.addDeviceType]);
  const init = () => {
    const ids = filterTypes.map((item) => item.value);
    setDeviceTypeKeys(ids);
    setKeyword("");
    setDeviceStatusKeys(["0", "1", "2"]);
    setDeviceTotal(0);
    setFrameData([]);
    setTreeData([]);
  };
  const getTreeTitle = (row) => {
    return (
      <div className="device-tree-title-wrap2">
        {(row.title + (row.gbid || "")).length > 8 ? (
          <Tooltip
            content={
              <div style={{ wordBreak: "break-all" }}>
                {row.title}
                {row.gbid && (
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    [{row.gbid}]
                  </span>
                )}
              </div>
            }
          >
            <div className="name text-overflow">
              {row.title}
              {row.gbid && (
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  [{row.gbid}]
                </span>
              )}
            </div>
          </Tooltip>
        ) : (
          <div className="name text-overflow">
            {row.title}
            {row.gbid && (
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                [{row.gbid}]
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const onOk = () => {
    const list = frameData.filter((item) =>
      frameCheckedKeys.includes(item.key)
    );
    storeAttr.setFrameData(list);
    storeAttr.updateDeviceChecks();
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      if (storeAttr.addDeviceType == "1" && storeAttr.location) {
        getFrameSelectList({ keyword, deviceTypeKeys, deviceStatusKeys });
      }
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    keyword,
    deviceTypeKeys,
    deviceStatusKeys,
    storeAttr.addDeviceType,
    storeAttr.location,
  ]);
  useEffect(() => {
    if (!storeAttr.location && storeAttr.addDeviceType == "1") {
      init();
    }
  }, [storeAttr.location]);
  const getFrameSelectList = async ({
    keyword,
    deviceTypeKeys,
    deviceStatusKeys,
  }) => {
    const data: any = {
      // withRole: false,
      deviceStatus: deviceStatusKeys,
      // tag: "",
      deviceName: keyword,
      deviceTypes: deviceTypeKeys,
      location: storeAttr.location,
    };
    if (deviceTypeKeys.includes("IPC_1") && !deviceTypeKeys.includes("IPC_3")) {
      data.cameraForms = ["1", "2"];
    } else if (
      !deviceTypeKeys.includes("IPC_1") &&
      deviceTypeKeys.includes("IPC_3")
    ) {
      data.cameraForms = ["3", "4"];
    } else if (
      deviceTypeKeys.includes("IPC_1") &&
      deviceTypeKeys.includes("IPC_3")
    ) {
      data.cameraForms = ["1", "2", "3", "4"];
    }

    const res = await appStore.getLayerBusinessQuery(data);
    const list =
      res.map((item) => {
        const deviceType = store.getDeviceType(item);
        const groupIds = item?.groupId?.split("|") || [];
        return {
          ...item,
          deviceType,
          deviceName: item.name,
          key: `${item.gbid}-${groupIds[0] ? groupIds[0] : ""}`,
        };
      }) || [];
    const deviceTypeList = filterTypes.filter((item) =>
      deviceTypeKeys.includes(item.value)
    );
    const treeList = deviceTypeList
      .map((item) => {
        const children = list
          .filter((child) => child.deviceType == item.value)
          .map((child) => {
            return {
              ...child,
              key: child.key,
              title: child.name,
            };
          });
        return {
          ...item,
          title: `${item.label}（${children?.length || 0}）`,
          key: item.value,
          children,
          checkable: false,
          total: children?.length || 0,
        };
      })
      .filter((item) => item.children.length > 0);
    console.log(treeList, "treeListtreeListtreeList");

    const parentIds = treeList.map((item) => item.key);
    const ids = list.map((item) => item.key);
    console.log(parentIds, "parentIdsparentIds");
    setFrameExpandedKeys([parentIds[0]]);
    setFrameCheckedKeys([...parentIds, ...ids]);
    setDeviceTotal(list.length);
    setFrameData(list);
    setTreeData(treeList);
  };
  const onSelect = (selectedKeys, node) => {
    const { gbid, deviceType, cameraForm } = node;
    let type = deviceType;
    if (deviceType === "IPC") {
      if (["1", "2"].includes(cameraForm)) {
        type = "IPC_1";
      } else {
        type = "IPC_3";
      }
    }
    appStore.getLayerServiceQuery(gbid, store.viewer);
    const layer = storeAttr.devicelayerObj[type];
    const layerId = storeAttr.devicelayerIds[type];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };
  return (
    <div className={styles.right_wrp}>
      <div className="add-device-search">
        <Input.Search
          size="large"
          value={keyword}
          placeholder="请输入设备名称/GBID/分组名搜索"
          onChange={setKeyword}
          defaultValue=""
          allowClear
        />
        <div className="filter-box">
          <FilterModal
            title="设备筛选"
            triggerProps={{
              getPopupContainer: () => document.querySelector(".addDeviceBox"),
            }}
            height={240}
          >
            <TitleBar>设备类型</TitleBar>
            <CheckboxGroup
              value={deviceTypeKeys}
              options={filterTypes}
              onChange={(val) => {
                setDeviceTypeKeys(val);
              }}
              className={"def-checkGroup2"}
            />
            <TitleBar>设备状态</TitleBar>
            <CheckboxGroup
              value={deviceStatusKeys}
              onChange={(val) => {
                setDeviceStatusKeys(val);
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
        </div>
      </div>

      <div className={styles.left_avar}>
        <img src={deviceTypeUrl} />
        <div className={styles.avar_title}>
          <p>设备总数:</p> <span>{deviceTotal}</span>
          <p>个</p>
        </div>
      </div>
      {treeData?.length > 0 ? (
        <>
          <div className={styles["live-show"]}>
            <KArcoTree
              treeData={treeData}
              blockNode
              onCheck={(value, extra) => {
                setFrameCheckedKeys(value);
              }}
              className={classNames(
                styles["organization-tree"],
                "expand-tree-select",
                "public-scrollbar",
                styles["device-list-tree"]
              )}
              style={{ maxHeight: "100%", overflow: "auto" }}
              virtualListProps={{
                height: 800,
              }}
              // checkedStrategy={Tree.SHOW_CHILD}
              renderTitle={(options: any) => {
                return getTreeTitle(options);
              }}
              checkStrictly={true}
              checkedKeys={frameCheckedKeys}
              // selectedKeys={selectedKeys}
              expandedKeys={frameExpandedKeys}
              onSelect={(selectedKeys, { selected, selectedNodes, node }) => {
                onSelect(selectedKeys, node.props);
              }}
              checkable
              onExpand={(keys) => {
                setFrameExpandedKeys(keys);
              }}
              // setExpandedKeys={setExpandedKeys}
            ></KArcoTree>
          </div>

          <div className={styles.footer}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 10 }}
              onClick={debounce(onOk, 600)}
            >
              添加
            </Button>
          </div>
        </>
      ) : (
        <div className="no-data">
          <img src={exh_center} />
          <span>暂无数据</span>
        </div>
      )}
    </div>
  );
};

export default memo(observer(FrameSelect));
