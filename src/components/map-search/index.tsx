import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { observer } from "mobx-react";
import { debounce } from "lodash";
import ReactDOM from "react-dom/client";
import { Input, Pagination } from "@arco-design/web-react";
import waterImage from "@/assets/img/position.svg";
import PositionWaterDroplet from "./PositionWaterDroplet";
import { getTypeof } from "@/kit";
import globalState from "@/globalState";
import "./index.less";

const InputSearch = Input.Search;

let markers = {
  poiMarkerId: "",
  poiPopupId: "",
  pickupMarkerId: "",
  pickupCustomOverlayId: "",
  lineLayerId: "",
};
const highLight = (item, keyword) => {
  let { name, address, provinceName = "", cityName = "", areaName = "" } = item;
  let safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escapes special characters
  if (!name) name = address;
  let namehtml = name.replace(
    new RegExp(`(${safeKeyword})`, "gi"),
    "<span style='color: #FFF'>$1</span>"
  );
  let area = provinceName + cityName + areaName;
  let html = "";
  if (name) {
    html += `<div class='poi-name'><span class='search-name text-overflow'>${namehtml}</span><label class='text-overflow'>${area}</label></div><div class='address text-overflow' style='color:#CEC9C9;; font-size:12px;'>${
      (address && address.replace(area, "")) || ""
    }</div>`;
  }
  return html;
};

interface MapSearchProps {
  className: string;
  kmap: any;
  onSearch: (val) => void;
  placeholder?: string;
  disabled?: boolean;
  adcode?: string | number;
  onFocusCallback?: () => void;
  onClear?: () => void;
}
const getDeviceDom = (info) => {
  const { address, name, telephone } = info;
  return (
    <div className={`device-view-wrap`}>
      <div className="device-header">
        <div className="tit">查看详情</div>
      </div>
      <div className="device-con">
        <div className="device-li">
          <div className="device-label">名称：</div>
          <div className="device-info">{name || "-"}</div>
        </div>
        <div className="device-li">
          <div className="device-label">地址：</div>
          <div className="device-info" title={address}>
            {address || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};
//设备详情弹框内容
const setBaseInfo = (info) => {
  let dom = document.querySelector("#mapAddressBox");
  if (!dom) return;
  let root = ReactDOM.createRoot(dom);
  root.render(getDeviceDom(info));
};
const MapSearch = forwardRef((props: MapSearchProps, ref) => {
  const [keyword, setKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressTotal, setAddressTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [id, setId] = useState("");
  const {
    kmap,
    className,
    onSearch,
    placeholder,
    disabled = false,
    adcode = "460100",
    onClear,
  } = props;
  useImperativeHandle(ref, () => ({
    setShow(val) {
      setShowSearch(val);
    },
  }));
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      onInputSearch(keyword);
    }, 1000);

    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mapSearchBox = document.querySelector(".map-search-box");
      if (mapSearchBox && !mapSearchBox.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const clearPoiMarkerPopup = () => {
    if (!kmap) return;
    if (markers.poiMarkerId) {
      kmap.removeMarkersById({
        id: markers.poiMarkerId,
      });
      markers.poiMarkerId = "";
    }
    clearPopupBox();
    removeLineLayer();
  };
  // search
  const onInputSearch = (val: string, pageNo = 1) => {
    if (!kmap) return;
    if (val) {
      kmap.queryInfoByType({
        // 全国
        code: adcode,
        keyword: val,
        searchType: [],
        maxCount: 10,
        pageNo,
        callback: function (res) {
          if (Array.isArray(res.data)) {
            setAddresses(res.data);
            setAddressTotal(res.total);
          }
          if (!showSearch) {
            setShowSearch(true);
          }
        },
      });
    } else {
      // clearPoiMarkerPopup();
    }
  };
  const removeLineLayer = () => {
    markers.lineLayerId &&
      kmap.removeLayer({
        layerId: markers.lineLayerId,
      });
    markers.lineLayerId = "";
  };
  const addLineLayer = (geometry, lngLat) => {
    try {
      const spriteType = globalState.get("spriteType");
      const list = ["fresh", "grey"];
      const color = list.includes(spriteType) ? "#0087FF" : "#00E092";
      removeLineLayer();
      var layerId = kmap.addGeometryLayer({
        data: {
          type: "FeatureCollection",
          features: [
            {
              geometry,
              type: "Feature",
              properties: {
                id: "bec7ebb89ec416c008b8f792e28ce7f1",
                "line-color": color,
                "line-opacity": 1,
                "line-width": 6,
              },
            },
          ],
        },
        ended: function (res) {
          console.log(res);
          kmap.moveTolnglat({
            type: 2,
            point: lngLat,
            zoom: 16,
          });
        },
      });

      markers.lineLayerId = layerId;
    } catch (error) {}
  };
  const onClickAddress = (lngLat: any, name: string, row: any) => {
    if (!kmap) return;
    clearPoiMarkerPopup();
    kmap.moveTolnglat({
      type: 2,
      point: lngLat,
      zoom: 16,
    });
    kmap.addMarker({
      url: waterImage,
      anchor: "bottom",
      point: lngLat,
      cssClassName: "serarch-marker",
      ended: (res) => {
        markers.poiMarkerId = res.data;
        addPopupBox(lngLat, row);
        kmap.addEventOnMarkers({
          selector: `#${markers.poiMarkerId}`,
          event: "click",
          handler: (e, info) => {
            e.stopPropagation();
            setTimeout(() => {
              addPopupBox(lngLat, row);
            }, 200);
          },
        });
      },
    });
    // setKeyword(name);
    // setShowSearch(false);
    onSearch && onSearch({ lngLat, name, clearPoiMarkerPopup });
  };
  const clearPopupBox = () => {
    if (!kmap) return;
    if (markers.poiPopupId) {
      kmap.removeInfoWindow({
        id: markers.poiPopupId,
      });
      markers.poiPopupId = "";
    }
  };
  const addPopupBox = (lngLat, row) => {
    if (!kmap) return;
    clearPopupBox();
    let html = '<div class="map-address-box" id="mapAddressBox"></div>';
    kmap.addInfoWindow({
      content: html,
      anchor: "bottom",
      tipPosition: "bottom",
      cssClassName: "police-popup",
      offset: [0, -45],
      closeButton: true,
      closeOnClick: true,
      point: lngLat,
      zIndex: 200,
      ended: (res) => {
        if (res.status === 10) {
          markers.poiPopupId = res.data;
          setBaseInfo(row);
        }
      },
    });
  };
  return (
    <div className={`map-search-box ${className ? className : ""}`}>
      <InputSearch
        // size="large"
        disabled={disabled}
        allowClear
        value={keyword}
        // className="keyword-search"
        placeholder={placeholder ? placeholder : "请输入关键字搜索位置"}
        searchButton={true}
        onFocus={() => {
          props.onFocusCallback?.();
          if (keyword && !showSearch) {
            setShowSearch(true);
          }
        }}
        onClear={() => {
          setAddresses([]);
          setShowSearch(false);
          clearPoiMarkerPopup();
          onClear && onClear();
        }}
        onChange={(val) => {
          val = val.trim();
          setCurrent(1);
          setKeyword(val);
          setAddresses([]);
          if (!val) {
            setShowSearch(false);
            clearPoiMarkerPopup();
            setId("");
          }
        }}
        onSearch={debounce((val) => {
          setCurrent(1);
          if (val) {
            onInputSearch(val);
          } else {
            setShowSearch(false);
            setId("");
          }
        }, 600)}
      />
      <div className={`search-result-wrap ${showSearch ? "show" : "hide"}`}>
        {addresses?.length > 0 ? (
          <>
            {addresses.map((item: any, index) => (
              <div
                style={{
                  display: "flex",
                  padding: "0 7px",
                }}
                key={item.id}
                className={`search-result-li ${item.id === id ? "active" : ""}`}
                onClick={() => {
                  setId(item.id);
                  clearPoiMarkerPopup();
                  const point =
                    getTypeof(item.locationpoint) === "object"
                      ? item.locationpoint?.coordinates
                      : item.locationpoint;
                  // onClickAddress(point, item.name);
                  if (item.location_geo) {
                    addLineLayer(item.location_geo, point);
                  }
                  // else if (item.location.type === "LineString") {
                  //   addLineLayer(item.location, point);
                  // }
                  else {
                    onClickAddress(point, item.name, item);
                  }
                }}
              >
                <PositionWaterDroplet
                  text={index + 1}
                  styles={{
                    transform: "scale(1)",
                    minWidth: "32px",
                    marginTop: "4px",
                    marginRight: 6,
                  }}
                />
                <div
                  className="name text-overflow"
                  dangerouslySetInnerHTML={{
                    __html: highLight(item, keyword),
                  }}
                ></div>
              </div>
            ))}
            {addressTotal > 10 && (
              <section className="pagination paginationContainer">
                <Pagination
                  onChange={(e) => {
                    setCurrent(e);
                    onInputSearch(keyword, e);
                  }}
                  // onPageSizeChange={(pageSize, current) => {
                  //   setCurrent(current);
                  // }}
                  current={current}
                  bufferSize={0}
                  hideOnSinglePage
                  pageSize={10}
                  total={addressTotal}
                  size="mini"
                />
              </section>
            )}
          </>
        ) : (
          <div className="search-result-li no-data" key="no-data">
            暂无数据
          </div>
        )}
      </div>
    </div>
  );
});
export default observer(MapSearch);
