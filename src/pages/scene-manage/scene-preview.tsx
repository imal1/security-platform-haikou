import { UePreview } from "@/components";
import { getBaseUrl, getSolution, getVenueId } from "@/kit";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import style from "./index.module.less";
import { getSceneInfo, ISceneInfo } from "./webapi";

const ScenePreview = () => {
  const sceneId = useMemo(() => getVenueId(), []);
  const [info, setInfo] = useState<ISceneInfo>({} as ISceneInfo);

  const init = async () => {
    const res = await getSceneInfo(sceneId);
    setInfo(res);
  };

  useEffect(() => {
    init();
  }, [sceneId]);

  return (
    <div className={style["scene-preview"]}>
      <div className={style["scene"]}>
        <div className={style["ue-preview-box"]}>
          <UePreview solution={getSolution()} />
        </div>
      </div>
      <div className={style["detail"]}>
        <div className={style["detail-title"]}>{info.sceneName}</div>
        <div className={style["detail-info"]}>
          <div>
            <span>场景类型：</span>
            <span>{info.sceneType}</span>
          </div>
          <div>
            <span>场景服务：</span>
            <span>{info.sceneServiceName}</span>
          </div>
          <div>
            <span>场景中心点：</span>
            <span>{info.sceneCenter}</span>
          </div>
          <div>
            <span>所属行政区：</span>
            <span>{info.regionName}</span>
          </div>
          <div>
            <span>场景面积：</span>
            <span>{info.sceneArea || "-"}</span>
          </div>
          <div>
            <span>场景图片：</span>
          </div>
          <div className="h-auto">
            <img src={`${getBaseUrl()}${info.sceneThumbnail}`} />
          </div>
          <div>
            <span>场景说明：</span>
            <span>{info.remark || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ScenePreview);
