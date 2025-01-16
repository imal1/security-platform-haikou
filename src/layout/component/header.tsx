import { observer } from "mobx-react";
import globalState from "../../globalState";

const Header = () => {
  const onHeaderClick = () => {
    globalState.get("globalViewer") &&
      globalState
        .get("globalViewer")
        .getCameraInfo()
        .then((info: any) => {
          console.log("===========getCameraInfo==============", info);
        });
  };
  return (
    <div className="app-header">
      <div className="app-header-con">
        <div className="app-title" onClick={onHeaderClick}>
          南宁会展中心数字孪生保障系统
        </div>
      </div>
    </div>
  );
};
const ObserverHeader = observer(Header);
export default ObserverHeader;
