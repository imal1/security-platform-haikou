import {
  Button,
  Dropdown,
  Menu,
  Message,
  TableColumnProps,
  Upload,
  Table,
  Tooltip,
} from "@arco-design/web-react";
import { IconDelete, IconDown, IconCopy } from "@arco-design/web-react/icon";
import { KArcoTable, NoData } from "@/components";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import store from "../../store/attributes-store";
import { getProjectRelativePath, downLoadUrl, deep } from "@/kit";
import * as XLSX from "xlsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const projectRelativePath = getProjectRelativePath();

const arrayMove = (array, from, to) => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(from, 1);
  newArray.splice(to, 0, movedItem);
  return newArray;
};
const VideoDevice = () => {
  useEffect(() => {}, [store.modalVisible]);
  const onClickMenuItem = (key) => {
    if (key == "2") {
      const url = `${projectRelativePath}static/download/device-import-temp.xlsx`;
      downLoadUrl(url, "设备导入模板", "xlsx");
    }
  };
  const renderIndexColumn = (text, record, index) => {
    return index + 1; // 根据行索引生成序号
  };
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState(store.devices);

  useEffect(() => {
    setDevices(store.devices);
  }, [store.devices]);

  const columns: TableColumnProps[] = [
    {
      title: (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          序号
          <Tooltip content="支持鼠标长按列表拖动调整设备排序">
            <div className="prompt-icon"></div>
          </Tooltip>
        </div>
      ),
      dataIndex: "index",
      width: 90,
      render: renderIndexColumn,
    },
    {
      title: "设备名称",
      dataIndex: "deviceName",
      autoEllipsisCheck: true,
      render(col, item, index) {
        return (
          <Tooltip
            content={
              <div style={{ wordBreak: "break-all" }}>
                {col}
                {item.gbid && (
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    [{item.gbid}]
                  </span>
                )}
              </div>
            }
          >
            <div className="name text-overflow">
              {col}
              {item.gbid && (
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  [{item.gbid}]
                </span>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "Operation",
      width: 100,
      render(col, item, index) {
        return (
          <>
            <Tooltip content="复用">
              <Button
                type="text"
                icon={<IconCopy />}
                size="small"
                onClick={() => {
                  const newData = deep(devices);
                  // const num =
                  //   newData.filter(
                  //     (row) => row.gbid == item.gbid && row.multiplex
                  //   ).length + 1;
                  newData.splice(index + 1, 0, {
                    ...item,
                    multiplex: "1",
                    deviceName: `复用_${item.deviceName}`,
                  });
                  setDevices(newData);
                  store.devices = newData;
                  // store.updateDeviceChecks();
                }}
                style={{ color: "#38f0fd", fontSize: 16 }}
              ></Button>
            </Tooltip>
            <Tooltip content="删除">
              <Button
                type="text"
                icon={<IconDelete />}
                size="small"
                onClick={() => {
                  const newData = deep(devices);
                  newData.splice(index, 1);
                  setDevices(newData);
                  store.devices = newData;
                  store.updateDeviceChecks();
                }}
                style={{ color: "#38f0fd", fontSize: 16 }}
              ></Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newData = arrayMove(
      devices,
      result.source.index,
      result.destination.index
    );
    setDevices(newData);
    store.devices = newData;
  };

  // 判断gbid是否重复
  const hasDuplicateId = (tableData, paramsName = "gbid") => {
    const idSet = new Set();
    for (const data of tableData) {
      if (idSet.has(data[paramsName])) {
        return true;
      }
      idSet.add(data[paramsName]);
    }
    return false;
  };

  const hasEmptyField = (tableData, paramsName = "gbid") => {
    return tableData.some((item) => !item[paramsName]);
  };

  const beforeUpload = (file, filesList) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file); // 读取文件
    reader.onload = (evt) => {
      // 读取完文件之后会回来这里
      const workbook = XLSX.read(evt.target.result, { type: "array" });
      const sheet_name_list = workbook.SheetNames;
      let data: any = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      data = data.map((item) => {
        return {
          deviceName: item["设备名称"],
          gbid: item["设备id"],
          deviceType: item["设备类型"],
        };
      });
      if (hasEmptyField(data)) {
        return Message.error("设备ID存在空值，请修改文件后重新导入！");
      }
      if (hasEmptyField(data, "deviceName")) {
        return Message.error("设备名称存在空值，请修改文件后重新导入！");
      }
      if (hasEmptyField(data, "deviceType")) {
        return Message.error("设备类型存在空值，请修改文件后重新导入！");
      }
      if (hasDuplicateId(data)) {
        return Message.error("设备ID存在重复，请修改文件后重新导入！");
      }
      if (hasDuplicateId(data, "deviceName")) {
        return Message.error("设备名称存在重复，请修改文件后重新导入！");
      }
      const deviceTypes = ["TOLLGATE", "IPC_3", "IPC_1", "BWC"];
      if (data.some((item) => !deviceTypes.includes(item["deviceType"]))) {
        return Message.error("设备类型存在无法识别，请修改文件后重新导入！");
      }
      store.setDevices(data);
    };
    return false;
  };

  const DraggableContainer = (props) => (
    <Droppable droppableId="droppable">
      {(provided) => (
        <tbody ref={provided.innerRef} {...provided.droppableProps} {...props}>
          {props.children}
          {provided.placeholder}
        </tbody>
      )}
    </Droppable>
  );

  const DraggableRow = (props) => {
    const { record, index, ...rest } = props;
    return (
      <Draggable
        key={record.gbid + index}
        draggableId={record.gbid + index}
        index={index}
      >
        {(provided, snapshot) => (
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...rest}
            style={{
              ...provided.draggableProps.style,
              ...(snapshot.isDragging
                ? { boxShadow: "0px 0px 10px 2px #0c82d2 inset" }
                : { cursor: "move" }),
            }}
          />
        )}
      </Draggable>
    );
  };
  /**
   * 切换视角
   * @param type 是否是主视角
   */
  const changeView = async () => {
    try {
      const { viewer } = store;
      const cameraInfo = await viewer.getCameraInfo();
      viewer.flyTo({
        ...cameraInfo,
        pitch: -90,
        alt: 200,
      });
    } catch (error) {}
  };
  const components = {
    body: {
      wrapper: DraggableContainer,
      row: DraggableRow,
    },
  };

  return (
    <div className="video-device-wrap">
      <div className="video-device-header">
        <label htmlFor="">视频设备</label>
        <div className="video-device-add">
          <Dropdown
            unmountOnExit={false}
            droplist={
              <Menu onClickMenuItem={onClickMenuItem}>
                <Upload
                  action="/"
                  accept={".xls,.xlsx"}
                  beforeUpload={beforeUpload}
                >
                  <Menu.Item key="1">导入文件</Menu.Item>
                </Upload>
                <Menu.Item key="2">模板下载</Menu.Item>
              </Menu>
            }
          >
            <Button type="secondary" size="small">
              批量导入
              <IconDown />
            </Button>
          </Dropdown>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => {
              store.modalVisible = true;
              store.frameSelectVisible = true;
              changeView();
            }}
          >
            添加设备
          </Button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Table
          className="arco-drag-table-container"
          components={components}
          columns={columns}
          border={false}
          loading={loading}
          data={devices}
          rowKey={(record) => record.gbid}
          style={{ marginBottom: 20 }}
          scroll={{
            y: 400,
          }}
          pagination={false}
          noDataElement={<NoData status={false} height={200} />}
        />
      </DragDropContext>
    </div>
  );
};
export default observer(VideoDevice);
