import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Checkbox,
  Form,
  Input,
  Select,
  Tag,
  Modal,
  Button,
  Popover,
  Message,
} from "@arco-design/web-react";
import {
  IconFile,
  IconLocation,
  IconPhone,
  IconPlayCircle,
} from "@arco-design/web-react/icon";
import {
  KArcoTree,
  NoData,
  FilterModal,
  TitleBar,
  KMediaUniContent,
} from "@/components";
import { tryGet, Icons, hasValue, imgOnError } from "@/kit";
import { observer } from "mobx-react";
import store from "../store";
import { debounce } from "lodash";
import classNames from "classnames";
import { PeopleTypeEnum } from "@/pages/home/souye/people-type-enum";
import appStore from "@/store";
import Draggable from "react-draggable";
import policeUrl from "@/assets/img/home/police.png";
const { devices } = Icons;
const FormItem = Form.Item;
const { Row, Col } = Grid;
const CheckboxGroup = Checkbox.Group;
const InputSearch = Input.Search;
const statusList = [
  { label: "在线", value: "0" },
  { label: "离线", value: "1" },
];
const peopleTypeList = [
  { label: "警组", value: PeopleTypeEnum.Group },
  { label: "组长", value: PeopleTypeEnum.GroupLeader },
  { label: "警员", value: PeopleTypeEnum.GroupMember },
];
const DEVICE_ICONS = {
  BWC: {
    ON: devices.ZFJLYON,
    OFF: devices.ZFJLYOFF,
  },
  PTT: {
    ON: devices.DJJON,
    OFF: devices.DJJOFF,
  },
  PAD: {
    ON: devices.JWTON,
    OFF: devices.JWTOFF,
  },
};
const PoliceDeployment = ({
  arrangeValue,
  level = 1,
  isGroupCall = true,
  isAllSelect = false,
}) => {
  const [status, setStatus] = useState(["0", "1"]);
  const [peopleType, setPeopleType] = useState(
    peopleTypeList.map((item) => item.value)
  );
  const [peoType, setPeoType] = useState(
    peopleTypeList.map((item) => item.value)
  );
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [searchStatus, setSearchStatus] = useState(false);
  const policeModalRef = useRef(null);
  const { policeStatistic, policeTree,isPlay } = store;
  useEffect(() => {
    setTreeData(policeTree);
  }, [policeTree]);
  useEffect(() => {
    formChange(null, {});
  }, [status]);
  useEffect(() => {
    const ids = store.policeData
      .filter((item) => !item.gbid || item.status == 0)
      .map((item) => item.id);
    setExpandedKeys([ids[0]]);
    if (isAllSelect) {
      setCheckedKeys(ids);
    } else {
      setCheckedKeys([]);
    }
  }, [store.policeData]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      if (store.viewer) {
        const data = store.policeData?.filter((item) => {
          return (
            (item._peopleType === PeopleTypeEnum.GroupLeader ||
              item._peopleType === PeopleTypeEnum.GroupMember) &&
            peopleType.includes(item._peopleType)
          );
        });

        store.addDeviceLayer(checkedKeys, data, "police");
      }
    }, 1000);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [checkedKeys, store.viewer, peopleType]);
  useEffect(() => {
    return () => {
      store.policeModalVisiable = false;
      store.removeDeviceLayer("police");
    };
  }, []);
  useEffect(() => {
    const onWindowResize = () => {
      store.policeModalPosition = {
        x: store.policeModalPosition.x,
        y: store.policeModalPosition.y,
      };
    };
    window.addEventListener("resize", onWindowResize, false);
    window.onbeforeunload = function () {
      store.realTimetrack && store.realTimetrack.remove();
      store.historytrack && store.historytrack.remove();
    };
    return () => {
      window.removeEventListener("resize", onWindowResize, false);
    };
  });
  const flyTo = (item) => {
    const { gbid } = item;
    gbid && appStore.getLayerServiceQuery(gbid, store.viewer);
  };
  const getTreeTitle = (row) => {
    // 解析设备类型和状态图标
    const parseDeviceIcon = (deviceType, deviceStatus) => {
      return (
        (deviceStatus == 0
          ? DEVICE_ICONS[deviceType]?.ON
          : DEVICE_ICONS[deviceType]?.OFF) || DEVICE_ICONS.BWC.OFF
      );
    };

    return (
      <div className="tree-title-wrap">
        {row.type == "memberList" && (
          <>
            {row.gbid && (
              <img
                src={parseDeviceIcon(row._deviceType, row.status)}
                style={{ width: 26, marginRight: 8 }}
              />
            )}

            <Tag
              size="small"
              style={{
                backgroundColor: row._isGroupLeader
                  ? "rgba(215, 114, 42, 0.2)"
                  : "rgba(42, 173, 215, 0.2)",
                borderColor: row._isGroupLeader ? "#fd8022" : "#00b7ff",
                color: row._isGroupLeader ? "#fd8022" : "#00b7ff",
                marginRight: 8,
                fontSize: 14,
                padding: "0 4px",
                height: 20,
                lineHeight: "18px",
              }}
              bordered
            >
              {row._showTagName}
            </Tag>
          </>
        )}
        <span className="tree-tit">
          <Popover trigger="hover" content={<span>{row._showName}</span>}>
            <span
              style={{
                textOverflow: "ellipsis",
                display: "block",
                overflow: "hidden",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              {row._showName}

              {!row.gbid && row.policeTotal > 0 && (
                <>
                  (<span style={{ color: "#65f1ff" }}>{row.policeTotal}</span>
                  <span style={{ color: "rgba(255,255,255,.7)" }}>/</span>
                  <span style={{ color: "#00ffc0" }}>{row.onlineNum}</span>
                  <span style={{ color: "rgba(255,255,255,.7)" }}>/</span>
                  <span style={{ color: "#bababa" }}>{row.offlineNum}</span>)
                </>
              )}
            </span>
          </Popover>
        </span>
        {row.type == "memberList" && (
          <div className="control-box">
            <Popover trigger="hover" content={<span>查看详情</span>}>
              <IconFile
                className="control-button"
                onClick={async (evt) => {
                  if (store.trackType||isPlay) {
                    return;
                  }
                  const picUrl = await store.userProfile(row.name);

                  store.policeInfo = { picUrl, ...row };
                  store.policeModalVisiable = true;
                  store.policeModalPosition = {
                    x: 420,
                    y: evt.screenY - 200 || 0,
                  };

                  const layer = store.devicelayerObj["police"]["police"];
                  const layerId = store.devicelayerIds["police"]["police"];
                  if (row.gbid && layer && layerId) {
                    layer.select({
                      layerId,
                      gbid: row.gbid,
                    });
                  }
                  evt.stopPropagation();
                }}
              />
            </Popover>
            <Popover trigger="hover" content={<span>定位</span>}>
              <IconLocation
                className="control-button"
                onClick={(evt) => {
                  flyTo(row);
                  evt.stopPropagation();
                }}
              />
            </Popover>
            <Popover trigger="hover" content={<span>通话组会</span>}>
              <IconPhone
                className="control-button"
                onClick={(evt) => {
                  // TODO: 通话
                  evt.stopPropagation();
                  store.callVisible = true;
                  store.addOrInvite = 0;
                  store.callTitle = "通话组会";
                  store.selectedMembers = [{ ...row, type: row.deviceType }];
                }}
              />
            </Popover>
          </div>
        )}
      </div>
    );
  };
  const searchData = (TreeData) => {
    const values = form.getFieldsValue();
    const { keyword = "" } = values;
    let type: any = [];
    if (level == 1) {
      type =
        values.type === 0
          ? peopleTypeList.map((item) => item.value)
          : [values.type];
    } else {
      type = peoType;
    }
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        const childrenElems = Array.isArray(item.children)
          ? loop(item.children)
          : [];

        if (
          (item.name.toLowerCase().includes(keyword?.toLowerCase()) &&
            ((item.gbid &&
              type.includes(item._peopleType) &&
              status.includes(String(item.status))) ||
              !item.gbid ||
              !type)) ||
          childrenElems.length > 0 // 子组件匹配父组件也显示
        ) {
          childrenElems.unshift({
            ...item,
          });
        }

        result.push(...childrenElems);

        // if (
        //   item.name.toLowerCase().includes(keyword?.toLowerCase()) &&
        //   (item.gbid && type.includes(item._peopleType) && status.includes(String(item.status)))
        // ) {
        //   result.push({
        //     ...item,
        //     children: item.children?.length ? loop(item.children) : [],
        //   });
        // } else if (item.children) {
        //   const filterData = loop(item.children);
        //   if (filterData.length) {
        //     result.push({ ...item, children: filterData });
        //   }
        // }
      });

      return result;
    };
    return loop(TreeData);
  };
  const filterNode = (item) => {
    const values = form.getFieldsValue();
    const { keyword = "" } = values;
    let type: any = [];
    if (level == 1) {
      type =
        values.type === 0
          ? peopleTypeList.map((item) => item.value)
          : [values.type];
    } else {
      type = peoType;
    }
    // 检查子节点是否满足条件
    const hasMatchingChildren = item.children?.some((child) =>
      filterNode(child)
    );
    return (
      (item.name.toLowerCase().includes(keyword?.toLowerCase()) &&
        ((item.gbid &&
          type.includes(item._peopleType) &&
          status.includes(String(item.status))) ||
          !item.gbid ||
          !type ||
          item._bFilterPass)) ||
      hasMatchingChildren
    );
  };
  const formChange = (value, values) => {
    const data = searchData(store.policeTree);
    setTreeData(data);
    setSearchStatus(hasValue(values));
  };
  const itemClick = async (item) => {
    const { deviceType = "BWC", gbid, memberType, status } = item.props;
    gbid && appStore.getLayerServiceQuery(gbid, store.viewer);

    const layer = store.devicelayerObj["police"]["police"];
    const layerId = store.devicelayerIds["police"]["police"];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
    if (memberType && status != 0) {
      if (gbid) {
        Message.warning("当前人员绑定设备已离线！");
      } else {
        Message.warning("当前人员未绑定设备！");
      }
    }
  };

  const calcScreenPosition = (position) => {
    if (!store.policeModalVisiable || !policeModalRef.current) {
      return {
        x: window.innerWidth,
        y: window.innerHeight,
      };
    } else {
      const rect = policeModalRef.current.getBoundingClientRect();
      return {
        x: Math.min(window.innerWidth - rect.width - 60, position.x),
        y: Math.min(window.innerHeight - rect.height - 110, position.y),
      };
    }
  };
  console.log(policeTree, "policeTree");
  const deviceInfo = (row) => {
    store.changeState({
      deviceVisible: true,
      deviceCurrent: row,
      onlyPlay: true,
    });
  };
  useEffect(() => {
    console.log(store.policeModalVisiable);
  }, [store.policeModalVisiable]);
  const onCancel = () => {
    store.policeModalVisiable = false;
    store.layerSelect("police", "police");
  };
  return (
    <div
      className="police-deployment arrange-wrap perception-police"
      style={{ display: arrangeValue === "jlbs" ? "flex" : "none" }}
    >
      {level == 1 && (
        <>
          <Row gutter={20} style={{ paddingLeft: 10, paddingRight: 10 }}>
            <Col span={7}>
              <div className="bianzu-item">
                <div className="count">
                  {tryGet(policeStatistic, "groupNum") || 0}
                </div>
                <div className="name">警组</div>
              </div>
            </Col>
            <Col span={7}>
              <div className="bianzu-item">
                <div className="count">
                  {tryGet(policeStatistic, "personNum") || 0}
                </div>
                <div className="name">人数</div>
              </div>
            </Col>
            <Col span={10}>
              <div className="bianzu-item">
                <CheckboxGroup
                  value={status}
                  onChange={setStatus}
                  style={{ display: "block", marginLeft: 6 }}
                >
                  {statusList.map((item) => (
                    <Checkbox value={item.value} key={item.value}>
                      <span
                        className={`check-item ${
                          item.value === "0" ? "" : "offline"
                        }`}
                      >
                        <span className="dot"></span>
                        {item.label}
                        <span className="line-num">
                          {item.value === "0"
                            ? policeStatistic?.onlineNum
                            : policeStatistic?.offlineNum}
                        </span>
                      </span>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </Col>
          </Row>
        </>
      )}

      <Form
        layout="vertical"
        form={form}
        style={{ padding: level == 1 ? "14px 10px" : "0 10px 14px 10px" }}
        onChange={debounce(formChange, 600)}
      >
        <Row gutter={5}>
          <Col span={level == 1 ? 17 : 21}>
            <FormItem field="keyword" style={{ marginBottom: 0 }}>
              <InputSearch
                autoComplete="off"
                allowClear
                placeholder="请输入关键字搜索警员姓名"
                size="large"
                // onSearch={formChange}
              />
            </FormItem>
          </Col>
          {level == 1 && (
            <Col span={7}>
              <FormItem
                field="type"
                style={{ marginBottom: 0 }}
                initialValue={0}
              >
                <Select
                  options={[{ label: "全部", value: 0 }, ...peopleTypeList]}
                  placeholder="请选择"
                  size="large"
                ></Select>
              </FormItem>
            </Col>
          )}
          {level == 2 && (
            <>
              <Col span={3}>
                <FilterModal
                  title="设备筛选"
                  triggerProps={{
                    getPopupContainer: () =>
                      document.querySelector(".perception-police"),
                  }}
                  height={240}
                >
                  <TitleBar>类型</TitleBar>
                  <CheckboxGroup
                    value={peoType}
                    options={peopleTypeList}
                    onChange={(val) => {
                      setPeoType(val);
                      formChange(null, {});
                    }}
                    className={"def-checkGroup2"}
                  />
                  <TitleBar>设备状态</TitleBar>
                  <CheckboxGroup
                    value={status}
                    options={statusList}
                    onChange={setStatus}
                    className={"def-checkGroup2"}
                  >
                    {statusList.map((item) => (
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
              </Col>
            </>
          )}
        </Row>
      </Form>
      <div className="people-tree-wrap">
        {treeData.length > 0 ? (
          <KArcoTree
            treeData={policeTree}
            filterNode={filterNode}
            blockNode
            checkable
            checkedKeys={checkedKeys}
            onCheck={(value) => {
              setCheckedKeys(value);
            }}
            className="organization-tree public-scrollbar"
            style={{ maxHeight: "100%" }}
            renderTitle={(options) => {
              return getTreeTitle(options);
            }}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            fieldNames={{
              key: "id",
              title: "name",
            }}
            onSelect={(selectedKeys, { selected, selectedNodes, node }) => {
              // const row = tryGet(selectedNodes[0], "props");
              setSelectedKeys(selectedKeys);
              itemClick(node);
            }}
            onExpand={(keys) => {
              setExpandedKeys(keys);
            }}
            setExpandedKeys={setExpandedKeys}
            virtualListProps={{
              height: 800,
            }}
          ></KArcoTree>
        ) : (
          <NoData isAnbo status={searchStatus} image_width={"200px"} />
        )}
      </div>
      {isGroupCall && (
        <div className="people-type-select">
          <CheckboxGroup
            value={peopleType}
            onChange={setPeopleType}
            options={peopleTypeList.filter((item) => item.label != "警组")}
            style={{ display: "block" }}
          />
          <Button
            type="secondary"
            style={{ padding: "0 8px" }}
            onClick={() => {
              if (!checkedKeys.length) {
                return Message.warning("请先勾选警力人员！");
              }
              if (checkedKeys.length > 25) {
                return Message.warning("勾选警力人员不能超过25人！");
              }
              store.addOrInvite = 0;
              store.selectedMembers = checkedKeys;
              store.callTitle = "组群通话";
              store.memberType = 'police';
              store.selectMemberVisible = true;
            }}
          >
            组群通话
          </Button>
        </div>
      )}
      <Modal
        // alignCenter={false}
        style={{
          // top: calcScreenPosition(store.policeModalPosition).y,
          // left: calcScreenPosition(store.policeModalPosition).x,
          // transformOrigin: "0px 0px",
          // margin: "0",
          cursor: "move",
          top: 20,
          right: 20,
          margin: 0,
          position: "fixed",
        }}
        title="详情"
        visible={store.policeModalVisiable}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={false}
        mask={false}
        // afterOpen={() => {
        //   const dom: any = document.querySelector(".police-modal-info");
        //   const transform = dom.style.transformOrigin;
        //   // debugger;
        //   console.log(`transformorigin`, transform);
        // }}
        afterClose={() => {}}
        footer={
          <div className="police-modal-footer">
            <Button
              type="secondary"
              disabled={store.track&& store.tab === "VEHICLE_ROUTE" && store.childTab?true:false}
              onClick={() => {
                store.trackType = "real";
                onCancel();
                store.trackVisible = true;
                store.historyVisible = false;
                store.addRealTimetrack();
              }}
            >
              开启实时轨迹
            </Button>
            <Button
              type="primary"
              disabled={store.track&& store.tab === "VEHICLE_ROUTE" && store.childTab?true:false}
              onClick={() => {
                store.trackVisible = false;
                store.trackType = "history";
                store.historyVisible = true;
                onCancel();
              }}
            >
              开启历史轨迹
            </Button>
          </div>
        }
        className={"police-modal police-modal-info"}
        modalRender={(modal) => <Draggable bounds="parent">{modal}</Draggable>}
      >
        <div className="police-box" ref={policeModalRef}>
          <div className="police-info-wrap">
            <div className="police-pic">
              <img
                src={store.policeInfo || policeUrl}
                onError={(e) => imgOnError(e, policeUrl)}
              />
            </div>
            <div className="police-info-con">
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">责任单位</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div>{store.policeInfo?._zrdw}</div>
                </Col>
              </Row>
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">警员</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    {store.policeInfo?._showName}
                  </div>
                </Col>
              </Row>
              <Row gutter={10} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">对讲机</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    <Row gutter={20}>
                      <Col style={{ flex: "1" }}>
                        <div>
                          {(store.policeInfo?.deviceType === "PTT" &&
                            store.policeInfo?.status == 0 &&
                            store.policeInfo?.deviceName) ||
                            "无"}
                        </div>
                      </Col>
                      <Col flex="100px">
                        {store.policeInfo?.deviceType === "PTT" &&
                        store.policeInfo?.status == 0 ? (
                          <div
                            className="control-button"
                            onClick={(evt) => {
                              flyTo(store.policeInfo);
                              evt.stopPropagation();
                            }}
                          >
                            <Row>
                              <Col flex="30px">
                                <IconLocation className="control-icon" />
                              </Col>
                              <Col style={{ flex: "1" }}>
                                <span className="control-label">定位</span>
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">执法仪</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    <Row gutter={20}>
                      <Col style={{ flex: "1" }}>
                        <div>
                          {(store.policeInfo?.deviceType === "BWC" &&
                            store.policeInfo?.status == 0 &&
                            store.policeInfo?.deviceName) ||
                            "无"}
                        </div>
                      </Col>
                      <Col flex="100px">
                        {store.policeInfo?.deviceType === "BWC" &&
                        store.policeInfo?.status == 0 ? (
                          <div
                            className="control-button"
                            onClick={(evt) => {
                              // TODO: 调阅画面
                              deviceInfo(store.policeInfo);
                              evt.stopPropagation();
                            }}
                          >
                            <Row>
                              <Col flex="30px">
                                <IconPlayCircle className="control-icon" />
                              </Col>
                              <Col style={{ flex: "1" }}>
                                <span className="control-label">调阅</span>
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">警务通</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    {(store.policeInfo?.deviceType === "PAD" &&
                      store.policeInfo?.status == 0 &&
                      store.policeInfo?.deviceName) ||
                      "无"}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Modal>
      {/* <div style={{ display: store.policeModalVisiable ? "block" : "none" }}>
       
      </div> */}
      <Modal
        alignCenter={false}
        style={{
          top: 71,
          transformOrigin: "0px 0px",
          margin: "0",
          left: "calc( 100vw - 458px - 40px)",
          width: 458,
        }}
        title={store.trackType == "real" ? "实时轨迹查看" : "历史轨迹查看"}
        visible={store.trackVisible}
        onCancel={() => {
          store.trackType = "";
          store.trackVisible = false;
        }}
        afterClose={() => {
          store.leftPanelVisible = true;
          store.navPanelVisible = true;
          store.removeRealTimetrack();
          store.removeHistorytrack();
        }}
        autoFocus={false}
        focusLock={false}
        mask={false}
        footer={
          <div className="police-modal-footer">
            <Button
              type="secondary"
              onClick={() => {
                store.trackType = "";
                store.trackVisible = false;
                store.leftPanelVisible = true;
                store.navPanelVisible = true;
                store.removeRealTimetrack();
              }}
            >
              {store.trackType == "real" ? "关闭实时轨迹" : "关闭历史轨迹"}
            </Button>
          </div>
        }
        className={"police-modal police-truck-modal"}
      >
        <div className="police-box" ref={policeModalRef}>
          <div className="police-info-wrap">
            <div className="police-pic">
              <img
                src={store.policeInfo.picUrl || policeUrl}
                onError={(e) => imgOnError(e, policeUrl)}
              />
            </div>
            <div className="police-info-con">
              <Row gutter={10} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">责任单位</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div>{store.policeInfo?._zrdw}</div>
                </Col>
              </Row>
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">警员</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    {store.policeInfo?._showName}
                  </div>
                </Col>
              </Row>
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">对讲机</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    <Row gutter={20}>
                      <Col style={{ flex: "1" }}>
                        <div>
                          {(store.policeInfo?.deviceType === "PTT" &&
                            store.policeInfo?.status == 0 &&
                            store.policeInfo?.deviceName) ||
                            "无"}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">执法仪</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    <Row gutter={20}>
                      <Col style={{ flex: "1" }}>
                        <div>
                          {(store.policeInfo?.deviceType === "BWC" &&
                            store.policeInfo?.status == 0 &&
                            store.policeInfo?.deviceName) ||
                            "无"}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row gutter={20} className={"police-row"}>
                <Col flex="100px">
                  <div className="police-label">警务通</div>
                </Col>
                <Col style={{ flex: "1" }}>
                  <div className="police-info">
                    {(store.policeInfo?.deviceType === "PAD" &&
                      store.policeInfo?.status == 0 &&
                      store.policeInfo?.deviceName) ||
                      "无"}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          {store.policeInfo?.deviceType === "BWC" &&
            store.policeInfo?.status == 0 && (
              <div className="police-video-box">
                <KMediaUniContent
                  devId={store.policeInfo.gbid}
                  id="policeVideoBox"
                />
              </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default observer(PoliceDeployment);
