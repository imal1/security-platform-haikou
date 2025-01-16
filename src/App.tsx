import React, { useEffect } from "react";
import { unstable_HistoryRouter as HashRouter } from "react-router-dom";
import "./App.less";
import { customHistory } from "@/kit";
import AuthRouter from "./layout/AuthRouter";
import Appstore from "./store";

function App() {
  document.body.setAttribute("arco-theme", "dark");
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      Appstore.closePage("video-list");
      // 这里可以选择返回一个字符串以显示提示
      // event.returnValue = "确定要离开吗？"; // 可选
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
      <HashRouter history={customHistory}>
        <AuthRouter />
      </HashRouter>
    </>
  );
}

export default App;
