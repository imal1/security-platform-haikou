import MapContent from "@/components/map-content";
import { useRef } from "react";

const MapPick = () => {
  const mapPick = useRef<any>();
  const overlaysId = useRef<string>();

  const addCustomOverlay = (lngLat) => {
    if (!mapPick.current) return;

    if (overlaysId.current) {
      mapPick.current.removeCustomOverlayById({
        id: overlaysId.current,
      });
      overlaysId.current = null;
    }
    let DOM = document.createElement("div");
    DOM.className = "addByIdClass";
    DOM.innerHTML = "";
    // DOM.style.width = "200px";
    // DOM.style.height = "80px";
    let imgSrc = document.createElement("img");
    imgSrc.src = require("@/assets/img/icon-skg-poi.png");
    let SPAN = document.createElement("span");
    SPAN.innerHTML = lngLat.join();
    DOM.appendChild(imgSrc);
    DOM.appendChild(SPAN);
    mapPick.current.addCustomOverlay({
      point: lngLat,
      element: DOM,
      offset: [0, -6],
      customOverlaysType: "addById",
      ended: (res) => {
        try {
          overlaysId.current = res.data;
        } catch (error) {}
      },
    });
  };

  const onClickEvent = (res) => {
    // this.setState({
    //   pickupCoordinate: `${res.lngLat.lng.toFixed(6)},${res.lngLat.lat.toFixed(
    //     6
    //   )}`,
    // });
    addCustomOverlay([res.lngLat.lng.toFixed(6), res.lngLat.lat.toFixed(6)]);
  };

  const onLoad = ({ map }) => {
    map.addTools({
      compass: true,
      zoomControl: true,
    });
    map.addEventOnMap({
      event: "click",
      handler: onClickEvent,
    });
    mapPick.current = map;
  };

  return (
    <div className="w-[calc(100vw-40px)] h-[calc(100vh-170px)]">
      <MapContent onLoad={onLoad}></MapContent>
    </div>
  );
};

export default MapPick;
