import { Icon, NoData } from "@/components";
import { getBaseUrl, microAppHistory } from "@/kit";
import appStore from "@/store";
import { Button, Form, Input, Modal } from "@arco-design/web-react";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useEffect, useMemo, useRef, useState } from "react";
import style from "./index.module.less";
import SceneForm from "./scene-form";
import { getSceneList, ISceneInfo } from "./webapi";

const SceneManage = () => {
  const sceneManageRef = useRef(null);
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({});
  const [sceneList, setSceneList] = useState([]);
  const [addForm] = Form.useForm<ISceneInfo>();
  const [editForm] = Form.useForm<ISceneInfo>();
  const [visible, setVisible] = useState({
    add: false,
    edit: false,
  });

  const init = async () => {
    const list = await getSceneList();
    setSceneList(list);
  };

  const memoList = useMemo(() => {
    const { sceneName } = searchParams;
    if (!sceneName) return sceneList;
    return sceneList.filter((item) => item.sceneName.includes(sceneName));
  }, [sceneList, searchParams]);

  useEffect(() => {
    init();
  }, []);

  return (
    <div ref={sceneManageRef} className={style["scene-manage"]}>
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
            <Button
              className="ml-[20px]"
              onClick={() => setVisible({ ...visible, add: true })}
            >
              新增场景
            </Button>
            <Modal
              title="新增场景"
              visible={visible.add}
              onCancel={() => setVisible({ ...visible, add: false })}
              mountOnEnter
              unmountOnExit
              getPopupContainer={() => sceneManageRef.current}
              onConfirm={() => addForm.submit()}
            >
              <SceneForm form={addForm} />
            </Modal>
          </Form.Item>
        </Form>
      </Form.Provider>
      <div
        className={classNames(style["scene-list"], "mt-[24px]", "flex-1", {
          grid: sceneList.length > 0,
        })}
      >
        {sceneList.length > 0 ? (
          <>
            {memoList.map((item) => (
              <div key={item.id} className={style["scene-box"]}>
                <div className={style["scene-box-bg"]}>
                  <img src={require("@/assets/img/box-scene-1.png")} />
                  <img src={require("@/assets/img/box-scene-2.png")} />
                  <img src={require("@/assets/img/box-scene-3.png")} />
                </div>
                <div className={style["scene-box-content"]}>
                  <div className={style["scene-box-badge"]}>
                    {item.sceneTypeName}
                  </div>
                  <div className={style["scene-box-thumbnail"]}>
                    <img src={`${getBaseUrl()}${item.sceneThumbnail}`} />
                  </div>
                  <div className={style["scene-box-title"]}>
                    {item.sceneName}
                  </div>
                  <div className={style["scene-box-action"]}>
                    <Button
                      type="text"
                      icon={<Icon type="anbao-icon-detail" />}
                      onClick={() => {
                        appStore.setActivityInfo({
                          venueId: item.id,
                          solution: item.sceneServiceCode,
                        });
                        microAppHistory.push("/scene-preview");
                      }}
                    >
                      查看
                    </Button>
                    <div className={style["divider"]} />
                    <Button type="text" icon={<Icon type="anbao-icon-edit" />}>
                      编辑
                    </Button>
                    <Modal
                      title="编辑场景"
                      visible={visible.edit}
                      onCancel={() => setVisible({ ...visible, edit: false })}
                      mountOnEnter
                      unmountOnExit
                      getPopupContainer={() => sceneManageRef.current}
                      onConfirm={() => editForm.submit()}
                    >
                      <SceneForm form={editForm} />
                    </Modal>
                    <div className={style["divider"]} />
                    <Button
                      type="text"
                      icon={<Icon type="anbao-deploy" />}
                      onClick={() => {
                        appStore.setActivityInfo({
                          venueId: item.id,
                          solution: item.sceneServiceCode,
                        });
                        microAppHistory.push("/site_manage");
                      }}
                    >
                      部署
                    </Button>
                    <div className={style["divider"]} />
                    <Button
                      type="text"
                      icon={<Icon type="anbao-icon-delete" />}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};

export default observer(SceneManage);
