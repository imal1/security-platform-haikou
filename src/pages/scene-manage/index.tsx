import { Button, Input } from "@arco-design/web-react";
import { observer } from "mobx-react";
import { useState } from "react";
import style from "./index.module.less";

const SceneManage = () => {
  const [params, setParams] = useState({});
  const [sceneList, setSceneList] = useState([]);

  return (
    <div className={style["scene-manage"]}>
      <div className={style["heading-1"]}>场景管理</div>
      <div className={`${style["action"]} mt-2`}>
        <Input placeholder="请输入场景名称" style={{ width: 196 }} />
        <div className="space-x-6">
          <span>
            共<label className="px-2 text-[#08F0FF]">{sceneList.length}</label>
            个场景
          </span>
          <Button type="primary">新增场景</Button>
        </div>
      </div>
      <div className={`${style["scene-list"]} mt-3`}>
        {sceneList.map((item) => (
          <div key={item.id}></div>
        ))}
      </div>
    </div>
  );
};

export default observer(SceneManage);
