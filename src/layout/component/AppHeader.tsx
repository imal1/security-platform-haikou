import { observer } from "mobx-react";

const AppHeader = () => {
  return (
    <div className="app-header">
      <div className="app-header-con">
        <div className="app-title">南宁会展中心数字孪生保障系统</div>
      </div>
    </div>
  );
};

const ObserverHeader = observer(AppHeader);
export default ObserverHeader;
