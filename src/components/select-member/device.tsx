import {
  Button,
  Message,
  Modal,
  Tag,
  Transfer,
  Tree,
  Checkbox,
  Input,
  Form,
} from "@arco-design/web-react";
import "./index.less";
import { useEffect, useState } from "react";
import classNames from "classnames";
import store from "../../pages/home/store";
import deviceStore from "../../pages/home/store/device-list";
import { Icons, hasValue, deep, getDeviceType } from "@/kit";
import { debounce } from "lodash";
import { KArcoTree, NoData } from "@/components";
import { IconDelete } from "@arco-design/web-react/icon";
const { devices } = Icons;
const deviceStatus = Icons.deviceStatus;
const InputSearch = Input.Search;
const FormItem = Form.Item;
const SelectMemberDeviceView = (props: any) => {
  const {
    className,
    visible,
    setVisible,
    title = "组群通话",
    selectedMemberKeys,
    setSelectedMemberKeys,
    addOrInvite,
    onLoad,
    params = {},
    isAllDevice = false,
  } = props;
  const [treeData, setTreeData] = useState([]);
  const { deviceTreeData, deviceData } = store;
  const [allMembers, setAllMembers] = useState<Array<any>>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [ids, setIds] = useState([]);
  const [searchStatus, setSearchStatus] = useState(false);
  const [selectList, setSelectList] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    const data = generateTreeData(deviceTreeData, selectedMemberKeys);
    setTreeData([...data]);
    setAllMembers(getAllMembers(deviceTreeData));
  }, [deviceTreeData]);

  useEffect(() => {
    const ids = store.deviceData
      .filter((item) => !item.gbid || item.status == 0)
      .map((item) => item.key);
    setExpandedKeys([deviceTreeData[0]?.key]);
    setIds(ids);
  }, [store.deviceData]);
  useEffect(() => {}, [addOrInvite]);

  const [targetKeys, setTargetKeys] = useState([]);
  const generateTreeData = (treeNodes = [], checkedKeys = []) => {
    const tempTreeData = treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key),
      children: generateTreeData(children, checkedKeys),
    }));
    return tempTreeData;
  };

  const getAllMembers = (list = [], transferDataSource = [], members = []) => {
    list.forEach((item) => {
      if (item.username) {
        members.push(item);
      }
      transferDataSource.push(item);
      getAllMembers(item.children, transferDataSource, members);
    });
    return members;
  };
  const getTreeTitle = (row) => {
    return (
      <div className="tree-title-wrap">
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
              src={deviceStatus[`${getDeviceType(row)}_${row.status}`]}
              style={{ width: 26, marginRight: 8 }}
            />
          </>
        )}
        <span className="tree-tit">{row.title}</span>
      </div>
    );
  };
  useEffect(() => {
    if (selectedMemberKeys) {
      setCheckedKeys(selectedMemberKeys);
      setIndeterminate(
        !!(checkedKeys.length && checkedKeys.length !== store.deviceData.length)
      );
      setCheckAll(!!(checkedKeys.length === store.deviceData.length));
      setTargetKeys(selectedMemberKeys);
    }
  }, [selectedMemberKeys]);
  useEffect(() => {
    const list = store.deviceData.filter(
      (item) => checkedKeys.includes(item.key) && item.gbid && item.status == 0
    );
    setSelectList(list);
    setIndeterminate(
      !!(checkedKeys.length && checkedKeys.length !== store.deviceData.length)
    );
    setCheckAll(!!(checkedKeys.length === store.deviceData.length));
  }, [store.deviceData, checkedKeys]);

  const onCancel = () => {
    setVisible(false);
    setSelectedMemberKeys([]);
    setCheckedKeys([]);
    setCheckAll(false);
    setIndeterminate(false);
  };
  const filterNode = (item) => {
    // 检查子节点是否满足条件
    const values = form.getFieldsValue();
    const { keyword = "" } = values;
    const hasMatchingChildren = item.children?.some((child) =>
      filterNode(child)
    );
    return (
      item.title?.toLowerCase().includes(keyword?.toLowerCase()) ||
      hasMatchingChildren
    );
  };
  const searchData = (TreeData) => {
    const values = form.getFieldsValue();
    const { keyword = "" } = values;
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        if (item.title?.toLowerCase().indexOf(keyword?.toLowerCase()) > -1) {
          result.push({ ...item });
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
  const formChange = (value, values) => {
    const data = searchData(store.deviceTreeData);
    setTreeData(data);
    setSearchStatus(hasValue(values));
  };

  function onChangeAll(checked) {
    if (checked) {
      setIndeterminate(false);
      setCheckAll(true);
      setCheckedKeys(ids);
    } else {
      setIndeterminate(false);
      setCheckAll(false);
      setCheckedKeys([]);
    }
  }
  const onDel = (id) => {
    const index = checkedKeys.indexOf(id);
    if (index > -1) {
      const checkedKeysTemp = deep(checkedKeys);
      checkedKeysTemp.splice(index, 1);
      setCheckedKeys(checkedKeysTemp);
    }
  };

  const treeDataTransfer = generateTreeData(treeData, targetKeys);
  const loadMore = (treeNode) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (treeNode.props.nodeType === "group") {
          let data = await deviceStore.getdeviceGroupList(treeNode.props._key);
          treeNode.props.dataRef.children = data;
          // 更新树数据
          setTreeData([...treeData]);
          resolve(true);
        } else {
          resolve(true);
        }
      }, 1000);
    });
  };
  return (
    <Modal
      title={title}
      visible={visible}
      className={classNames("select-member-wrap", className)}
      style={{
        zIndex: 100000, // 这里设置你需要的z-index值
      }}
      onCancel={onCancel}
      mask={false}
      footer={
        <div>
          <Button type="secondary" size="default" onClick={onCancel}>
            {"取消"}
          </Button>
          <Button
            type="primary"
            size="default"
            onClick={() => {
              // const tempTargetKeys = targetKeys.reduce((acc, val) => {
              //   const matchedItem = allMembers.find((item) => item.key === val);
              //   if (matchedItem) {
              //     acc.push({
              //       id: matchedItem.gbid,
              //       type: matchedItem.deviceType,
              //     });
              //   }
              //   return acc;
              // }, []);
              const tempTargetKeys = selectList.map((item) => {
                return {
                  id: item.gbid,
                  gbid:item.gbid,
                  type: item.deviceType,
                };
              });
              if (tempTargetKeys.length === 0) {
                return Message.warning("请先选择设备！");
              }
              if (tempTargetKeys.length > 9) {
                return Message.warning("最多同时9路视频通话！");
              }
              setVisible(false);
              store.callVisible = true;
              // console.log('selectedMembers', tempTargetKeys)
              if (addOrInvite === 1) {
                store.addSelectedMemberKeys = tempTargetKeys;
              } else {
                store.selectedMembers = tempTargetKeys;
              }
            }}
          >
            {"确认"}
          </Button>
        </div>
      }
      autoFocus={false}
      focusLock={true}
    >
      <div className="select-member-con">
        <div className="select-member-item">
          <div className="select-member-item-header">
            <Checkbox
              onChange={onChangeAll}
              checked={checkAll}
              indeterminate={indeterminate}
            >
              警力列表
            </Checkbox>
          </div>
          <Form
            layout="vertical"
            form={form}
            onChange={debounce(formChange, 600)}
            style={{
              padding: "0 10px",
            }}
          >
            <FormItem field="keyword" style={{ marginBottom: 10 }}>
              <InputSearch
                autoComplete="off"
                allowClear
                placeholder="请输入关键字搜索警员姓名"
                size="large"
                defaultValue=""
              />
            </FormItem>
          </Form>
          <div className="select-member-item-con  public-scrollbar">
            {treeData.length > 0 ? (
              <KArcoTree
                treeData={treeData}
                filterNode={filterNode}
                loadMore={isAllDevice && loadMore}
                blockNode
                checkable={!isAllDevice}
                checkStrictly={true}
                checkedKeys={checkedKeys}
                onCheck={(value) => {
                  setCheckedKeys(value);
                  setIndeterminate(
                    !!(value.length && value.length !== store.deviceData.length)
                  );
                  setCheckAll(!!(value.length === store.deviceData.length));
                }}
                className={classNames(
                  "organization-tree",
                  "expand-tree-select",
                  "public-scrollbar"
                )}
                style={{ maxHeight: "100%", overflowX: "hidden" }}
                virtualListProps={{
                  height: 600,
                }}
                renderTitle={(options) => {
                  return getTreeTitle(options);
                }}
                expandedKeys={expandedKeys}
                // fieldNames={{
                //   key: "id",
                //   title: "name",
                // }}
                // onSelect={(
                //   selectedKeys,
                //   { selected, selectedNodes, node }
                // ) => {
                //   // const row = tryGet(selectedNodes[0], "props");
                //   // itemClick(node);
                // }}
                onExpand={(keys) => {
                  setExpandedKeys(keys);
                }}
                setExpandedKeys={setExpandedKeys}
              ></KArcoTree>
            ) : (
              <NoData isAnbo status={searchStatus} image_width={"200px"} />
            )}
          </div>
        </div>
        <div className="select-member-item">
          <div className="select-member-item-header">
            <span style={{ marginLeft: 10 }}>
              已选列表（{selectList?.length || 0}）
            </span>
          </div>
          <div className="select-member-item-con  public-scrollbar">
            <div className="select-member-list">
              {selectList.map((row) => (
                <div className="tree-title-wrap" key={row.key}>
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
                        src={
                          deviceStatus[`${getDeviceType(row)}_${row.status}`]
                        }
                        style={{ width: 26, marginRight: 8 }}
                      />
                    </>
                  )}
                  <span className="tree-tit">{row.title}</span>
                  <Button
                    type="text"
                    className="del-icon"
                    icon={<IconDelete />}
                    disabled={targetKeys.includes(row.key)}
                    onClick={() => {
                      onDel(row.key);
                    }}
                  ></Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectMemberDeviceView;
