import { Icon, NoData } from "@/components";
import { getBaseUrl } from "@/kit";
import { Button, Form, Input } from "@arco-design/web-react";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import style from "./index.module.less";
import { getSceneList } from "./webapi";

const SceneList = ({ list }) => {
  return (
    <div className={style["scene-list"]}>
      {list.map((item) => (
        <div key={item.id} className={style["scene-box"]}>
          <div className={style["scene-box-bg"]}>
            <img src={require("@/assets/img/box-scene-1.png")} />
            <img src={require("@/assets/img/box-scene-2.png")} />
            <img src={require("@/assets/img/box-scene-3.png")} />
          </div>
          <div className={style["scene-box-content"]}>
            <div className={style["scene-box-badge"]}>{item.sceneTypeName}</div>
            <div className={style["scene-box-thumbnail"]}>
              <img src={`${getBaseUrl()}${item.sceneThumbnail}`} />
            </div>
            <div className={style["scene-box-title"]}>{item.sceneName}</div>
            <div className={style["scene-box-action"]}>
              <Button type="text" icon={<Icon type="anbao-icon-detail" />}>
                查看
              </Button>
              <div className={style["divider"]} />
              <Button type="text" icon={<Icon type="anbao-icon-edit" />}>
                编辑
              </Button>
              <div className={style["divider"]} />
              <Button type="text" icon={<Icon type="anbao-deploy" />}>
                部署
              </Button>
              <div className={style["divider"]} />
              <Button type="text" icon={<Icon type="anbao-icon-delete" />}>
                删除
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SceneManage = () => {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({});
  const [sceneList, setSceneList] = useState([]);

  const init = async () => {
    const list = await getSceneList();
    setSceneList(list);
  };

  const memoList = useMemo(() => {
    return sceneList.filter((item) =>
      item.sceneName.includes(searchParams.sceneName),
    );
  }, [sceneList, searchParams]);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className={style["scene-manage"]}>
      <Form.Provider
        onFormValuesChange={(_, values) => setSearchParams(values)}
      >
        <Form
          layout="inline"
          className="query-form backend-form w-auto mt-[20px]"
        >
          <Form.Item field="sceneName">
            <Input
              placeholder="请输入场景名称"
              style={{ width: 196 }}
              allowClear
            />
          </Form.Item>
          <Form.Item className="flex-auto justify-end">
            <span className="text-white text-[14px]">
              共
              <label className="px-2 text-[#08F0FF]">{sceneList.length}</label>
              个场景
            </span>
            <Button type="primary" className="ml-[20px]">
              新增场景
            </Button>
          </Form.Item>
        </Form>
      </Form.Provider>
      <div className="mt-[24px] flex-1">
        {sceneList.length > 0 ? <SceneList list={memoList} /> : <NoData />}
      </div>
    </div>
  );
};

export default observer(SceneManage);
