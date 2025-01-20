import { observer } from "mobx-react";

import noDataSvg from "@/assets/img/noPage.svg";

const Undeveloped = () => {
  return (
    <>
      <div
        className="map-networking-container"
        style={{ width: "100%", height: "100%" }}
      >
        <img className="noDataImg" src={noDataSvg} alt="" />
      </div>
    </>
  );
};

export default observer(Undeveloped);
