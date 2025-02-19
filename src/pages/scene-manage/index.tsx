import { Button, Form, Input } from "@arco-design/web-react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import style from "./index.module.less";
import { getSceneList } from "./webapi";

const SceneManage = () => {
  const [params, setParams] = useState({});
  const [sceneList, setSceneList] = useState([]);

  const init = async () => {
    const list = await getSceneList();
    setSceneList(list);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className={style["scene-manage"]}>
      <Form
        layout="inline"
        className="query-form backend-form w-auto mt-[20px]"
      >
        <Form.Item label="" field="name">
          <Input
            placeholder="请输入场景名称"
            style={{ width: 196 }}
            allowClear
          />
        </Form.Item>
        <Form.Item className="flex-auto justify-end">
          <span className="whitespace-nowrap">
            共<label className="px-2 text-[#08F0FF]">{sceneList.length}</label>
            个场景
          </span>
          <Button type="primary" className="ml-[20px]">
            新增场景
          </Button>
        </Form.Item>
      </Form>
      <div className={`${style["scene-list"]} mt-[24px]`}>
        {sceneList.map((item) => (
          <div key={item.id} className="scene-box"></div>
        ))}
      </div>
    </div>
  );
};

export default observer(SceneManage);
