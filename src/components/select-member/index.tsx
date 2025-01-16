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
import { Icons, hasValue, deep } from "../../kit";
import { debounce } from "lodash";
import { KArcoTree, NoData } from "@/components";
import { IconDelete } from "@arco-design/web-react/icon";
const { devices } = Icons;
const InputSearch = Input.Search;
const FormItem = Form.Item;
const SelectMemberView = (props: any) => {
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
  } = props;
  const [treeData, setTreeData] = useState([]);
  const { policeStatistic, policeTree, policeData } = store;
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
    setTreeData(policeTree);
    setAllMembers(getAllMembers(policeTree));
  }, [policeTree]);
  useEffect(() => {
    const ids = store.policeData
      .filter((item) => !item.gbid || item.status == 0)
      .map((item) => item.id);
    setExpandedKeys(ids);
    setIds(ids);
  }, [store.policeData]);
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

  const generateTransferData = (list = [], transferDataSource = []) => {
    list.forEach((item) => {
      transferDataSource.push(item);
      generateTransferData(item.children, transferDataSource);
    });
    return transferDataSource;
  };
  const getTreeTitle = (row) => {
    return (
      <div className="tree-title-wrap">
        {row.type == "memberList" && (
          <>
            {row.gbid && (
              <img
                src={row.status == 0 ? devices.ZFJLYON : devices.ZFJLYOFF}
                style={{ width: 26, marginRight: 8 }}
              />
            )}

            <Tag
              size="small"
              style={{
                backgroundColor: !["组长"].includes(row._showTagName)
                  ? "rgba(42, 173, 215, 0.2)"
                  : "rgba(215, 114, 42, 0.2)",
                borderColor: !["组长"].includes(row._showTagName)
                  ? "#00b7ff"
                  : "#fd8022",
                color: !["组长"].includes(row._showTagName)
                  ? "#00b7ff"
                  : "#fd8022",
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
          {row.name}
          {!row.gbid && row.policeTotal && (
            <>
              （<span style={{ color: "#65f1ff" }}>{row.policeTotal}</span>
              <span style={{ color: "rgba(255,255,255,.7)" }}>/</span>
              <span style={{ color: "#00ffc0" }}>{row.onlineNum}</span>
              <span style={{ color: "rgba(255,255,255,.7)" }}>/</span>
              <span style={{ color: "#bababa" }}>{row.offlineNum}</span>）
            </>
          )}
        </span>
      </div>
    );
  };
  useEffect(() => {
    if (selectedMemberKeys) {
      setCheckedKeys(selectedMemberKeys);
      setIndeterminate(
        !!(checkedKeys.length && checkedKeys.length !== store.policeData.length)
      );
      setCheckAll(!!(checkedKeys.length === store.policeData.length));
      setTargetKeys(selectedMemberKeys);
    }
  }, [selectedMemberKeys]);
  useEffect(() => {
    const list = store.policeData.filter(
      (item) => checkedKeys.includes(item.id) && item.gbid && item.status == 0
    );
    setSelectList(list);
    setIndeterminate(
      !!(checkedKeys.length && checkedKeys.length !== store.policeData.length)
    );
    setCheckAll(!!(checkedKeys.length === store.policeData.length));
  }, [store.policeData, checkedKeys]);

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
      item.name.toLowerCase().includes(keyword?.toLowerCase()) ||
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
    const data = searchData(store.policeTree);
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
                return Message.warning("请先勾选警力人员！");
              }
              if (tempTargetKeys.length > 25) {
                return Message.warning("勾选警力人员不能超过25人！");
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
                treeData={treeDataTransfer}
                filterNode={filterNode}
                blockNode
                checkable
                checkStrictly={true}
                checkedKeys={checkedKeys}
                onCheck={(value) => {
                  setCheckedKeys(value);
                  setIndeterminate(
                    !!(value.length && value.length !== store.policeData.length)
                  );
                  setCheckAll(!!(value.length === store.policeData.length));
                }}
                className="organization-tree"
                renderTitle={(options) => {
                  return getTreeTitle(options);
                }}
                expandedKeys={expandedKeys}
                fieldNames={{
                  key: "id",
                  title: "name",
                }}
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
                <div className="tree-title-wrap" key={row.id}>
                  {row.gbid && (
                    <>
                      <img
                        src={
                          row.status == 0 ? devices.ZFJLYON : devices.ZFJLYOFF
                        }
                        style={{ width: 26, marginRight: 8 }}
                      />
                      <Tag
                        size="small"
                        style={{
                          backgroundColor: !["组长"].includes(row._showTagName)
                            ? "rgba(42, 173, 215, 0.2)"
                            : "rgba(215, 114, 42, 0.2)",
                          borderColor: !["组长"].includes(row._showTagName)
                            ? "#00b7ff"
                            : "#fd8022",
                          color: !["组长"].includes(row._showTagName)
                            ? "#00b7ff"
                            : "#fd8022",
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
                    {row.name}
                    {!row.gbid && row.policeTotal && (
                      <>
                        （
                        <span style={{ color: "#65f1ff" }}>
                          {row.policeTotal}
                        </span>
                        <span style={{ color: "rgba(255,255,255,.7)" }}>/</span>
                        <span style={{ color: "#00ffc0" }}>
                          {row.onlineNum}
                        </span>
                        <span style={{ color: "rgba(255,255,255,.7)" }}>/</span>
                        <span style={{ color: "#bababa" }}>
                          {row.offlineNum}
                        </span>
                        ）
                      </>
                    )}
                  </span>
                  <Button
                    type="text"
                    className="del-icon"
                    icon={<IconDelete />}
                    disabled={targetKeys.includes(row.id)}
                    onClick={() => {
                      onDel(row.id);
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

export default SelectMemberView;
