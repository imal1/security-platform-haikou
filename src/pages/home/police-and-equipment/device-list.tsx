import { Checkbox, List, Tag, Tooltip, Button } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { NoData } from "@/components";
import { IconFile } from "@arco-design/web-react/icon";
import { deep, Icons, hasValue } from "@/kit";
import { observer } from "mobx-react";
import store from "../store";
import appStore from "@/store";
interface DeviceListProps {
  dataSourse: any;
  loading: boolean;
  searchStatus: boolean;
  type?: string;
  onDetail?: (row: any) => void;
  deviceEnable?: boolean;
}
const deviceStatus = Icons.deviceStatus;
const DeviceList = (props: DeviceListProps) => {
  const {
    dataSourse,
    loading,
    searchStatus = false,
    type,
    onDetail,
    deviceEnable,
  } = props;
  const [currentData, setCurrentData] = useState(null);
  const [selectActives, setSelectActives] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      if (store.viewer && deviceEnable) {
        store.addDeviceLayer(selectActives, dataSourse, "xclx");
      } else {
        store.removeDeviceLayer("xclx");
      }
    }, 400);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    store.viewer,
    selectActives,
    deviceEnable,
    store.deviceNameVisible
  ]);
  useEffect(() => {
    if (deviceEnable) {
      const gbids = dataSourse.map((item) => item.gbid);
      setSelectActives(gbids);
    } else {
      setSelectActives([]);
    }
  }, [deviceEnable, dataSourse]);
  useEffect(() => {
    return () => {
      store.removeDeviceLayer("xclx");
    };
  }, []);
  const itemClick = async (item, index) => {
    const { locationpoint, gbid, deviceType } = item;
    setCurrentData({ ...currentData, gbid });
    if (locationpoint.length > 0) {
      store.viewer.flyTo({
        lng: locationpoint[0],
        lat: locationpoint[1],
        alt: appStore.devicePerspectiveVisible ? 800 : 100,
        pitch: -90,
      });
    } else {
      appStore.getLayerServiceQuery(gbid, store.viewer);
    }
    const layer = store.devicelayerObj["xclx"][deviceType];
    const layerId = store.devicelayerIds["xclx"][deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid,
      });
    }
  };
  return (
    <List
      split={false}
      size="small"
      className="device-list public-scrollbar"
      bordered={false}
      loading={loading}
      // onReachBottom={(currentPage) => getData(currentPage)}
      dataSource={dataSourse}
      virtualListProps={{ height: "100%", threshold: 100 }}
      noDataElement={
        <NoData isAnbo status={searchStatus} image_width={"200px"} />
      }
      render={(item, index) => {
        return (
          <List.Item
            onClick={() => itemClick(item, index)}
            key={index}
            className={
              (currentData?.gbid === item.gbid && "listItem active") ||
              "listItem"
            }
            actions={[
              <Tooltip content={"详情"}>
                <Button
                  type="text"
                  size="mini"
                  style={{ color: "#38eefb", padding: "2px 7px" }}
                  icon={<IconFile style={{ fontSize: 18 }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetail && onDetail({ ...item, layerType: "xclx" });
                  }}
                ></Button>
              </Tooltip>,
            ]}
          >
            <Checkbox
              value={item.gbid}
              checked={selectActives.includes(item.gbid)}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(val) => {
                const data = deep(selectActives);
                const findIndex = data.indexOf(item.gbid);
                if (findIndex > -1) {
                  data.splice(findIndex, 1);
                } else {
                  data.push(item.gbid);
                }
                setSelectActives(data);
              }}
            ></Checkbox>
            <div className="tag-box">
              {item.status == 0 && (
                <Tag
                  size="small"
                  style={{
                    backgroundColor: "rgba(0, 255, 192, 0.2)",
                    borderColor: "#00ffc0",
                    color: "#00ffc0",
                  }}
                  bordered
                >
                  在线
                </Tag>
              )}
              {item.status == 1 && (
                <Tag
                  size="small"
                  style={{
                    backgroundColor: "rgba(186, 186, 186, 0.2)",
                    borderColor: "#bababa",
                    color: "#bababa",
                  }}
                  bordered
                >
                  离线
                </Tag>
              )}
              {item.status == 2 && (
                <Tag
                  size="small"
                  style={{
                    backgroundColor: "rgba(216, 73, 44, 0.2)",
                    borderColor: "#d8492c",
                    color: "#d8492c",
                  }}
                  bordered
                >
                  故障
                </Tag>
              )}
            </div>
            <img
              src={deviceStatus[`${item.deviceType}_${item.status}`]}
              alt=""
            />
            {item.deviceName.length > 15 ? (
              <Tooltip content={item.deviceName}>
                <div className="device-name text-overflow">
                  {item.deviceName}
                </div>
              </Tooltip>
            ) : (
              <div className="device-name text-overflow">{item.deviceName}</div>
            )}
          </List.Item>
        );
      }}
    />
  );
};
export default observer(DeviceList);
