import React, { useState } from "react";
import { observer } from "mobx-react";
import store from "../store";
import { Grid, Radio } from "@arco-design/web-react";
import PoliceDeployment from "../souye/police-deployment";
import PerceptionDevice from "./perception-device";

const RadioGroup = Radio.Group;

const arrangeList = [
  {
    label: "警力部署",
    value: "jlbs",
  },
  {
    label: "感知设备",
    value: "gzsb",
  },
];
const PolicAndEquipment = ({ deviceEnable = true, level = 2,isGroupCall=true,isAllSelect=false }) => {
  const [arrangeValue, setArrangeValue] = useState("jlbs");
  return (
    <div className="arrange-wrap">
      <RadioGroup
        type="button"
        name="lang"
        className={"home-radio-group two-tab"}
        value={arrangeValue}
        options={arrangeList}
        onChange={setArrangeValue}
        style={{ marginBottom: 2, marginTop: 5 }}
      ></RadioGroup>
      <PoliceDeployment arrangeValue={arrangeValue} level={level} isGroupCall={isGroupCall} isAllSelect={isAllSelect}/>
      <PerceptionDevice
        arrangeValue={arrangeValue}
        deviceEnable={deviceEnable}
      />
    </div>
  );
};
export default observer(PolicAndEquipment);
