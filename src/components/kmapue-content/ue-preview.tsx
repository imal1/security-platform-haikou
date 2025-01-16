import React, { useEffect, useState } from "react";
import { tryGet } from "@/kit";
import { Empty, Button, Modal } from "@arco-design/web-react";
import "./index.less";
import KMapUeContent from "./index";
import noDataUrl from "@/assets/img/no-data/no-data.png";
import tipUrl from "@/assets/img/exclamationCircle.png";
interface UePreviewProps {
  domId?: string;
  spinClassName?: string;
  className?: string;
  solution?: number;
  autoDestroy?: number;
  children?: React.ReactNode | string;
  onLoad: (res) => void;
  onDestroy?: () => void;
}
const UePreview = (props: UePreviewProps) => {
  const { solution, onLoad, onDestroy, autoDestroy = 0 } = props;
  const [ueError, setUeError] = useState(null);
  const [isDestroy, setIsDestroy] = useState(false);
  const [ueResult, setUeResult] = useState(true);
  const [ueObj, setUeObj] = useState(null);
  const [isRefresh, setIsRefresh] = useState(true);
  const [visible, setVisible] = useState(false);
  return (
    <div className="ue-preview-box">
      {solution && ueResult && !isDestroy && (
        <KMapUeContent
          solution={Number(solution)}
          autoDestroy={autoDestroy}
          onLoad={(res) => {
            onLoad && onLoad(res);
            if (res.code === 200) {
              setUeResult(true);
              setUeObj(res.ue);
              res.ue?.on("error", function (data) {
                setUeResult(false);
                setUeError({
                  res: { code: data.code, message: data.msg },
                  code: 500,
                });
                setVisible(true);
              });
            } else {
              if (tryGet(res, "res.code") === "S199315") {
                setIsRefresh(false);
              } else {
                setIsRefresh(true);
              }
              setUeResult(false);
              setUeError(res);
            }
          }}
          onDestroy={() => {
            setIsDestroy(true);
            onDestroy && onDestroy();
          }}
        />
      )}
      {ueError && !isDestroy && (
        <Empty
          imgSrc={noDataUrl}
          description={
            <div>
              <div
                className="no-label"
                style={{
                  color: "#cee7ff",
                  fontSize: 16,
                  padding: "10px 0 30px 0",
                  fontFamily: "PingFang SC",
                }}
              >
                {/* 当前场景暂无空闲实例资源，请稍后重试 */}
                {tryGet(ueError, "res.message")}
              </div>
              {isRefresh && (
                <Button
                  type="secondary"
                  onClick={() => {
                    setUeResult(true);
                    setUeError(null);
                    setIsDestroy(false);
                  }}
                  size="small"
                >
                  重连实例
                </Button>
              )}
            </div>
          }
        />
      )}
      {isDestroy && (
        <Empty
          imgSrc={noDataUrl}
          description={
            <div>
              <div
                className="no-label"
                style={{
                  color: "#cee7ff",
                  fontSize: 16,
                  padding: "10px 0 30px 0",
                  fontFamily: "PingFang SC",
                }}
              >
                长时间未操作，场景服务已断开链接，请点击
                <span
                  className="animated-underline"
                  onClick={() => {
                    setUeResult(true);
                    setUeError(null);
                    setIsDestroy(false);
                  }}
                >
                  重新加载
                </span>
                ，实例化场景。
              </div>
            </div>
          }
        />
      )}
      <Modal
        title="提示"
        visible={visible}
        className={"ue-tip-modal"}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="ueErrorTip">
          <img src={tipUrl} />
          <span>{tryGet(ueError, "res.message")}</span>
        </div>
      </Modal>
    </div>
  );
};
export default UePreview;
