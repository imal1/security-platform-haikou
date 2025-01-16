import React, { useState, useEffect } from "react";
import {
  Upload,
  UploadProps,
  Progress,
  Button,
  Message,
} from "@arco-design/web-react";
import "./index.less";
import uploadDefaultUrl from "@/assets/img/Upload.svg";
import excelUrl from "@/assets/img/Excel.svg";
import { tryGet, formatFileSize, downloadExcelTemp } from "@/kit";
import { IconSync, IconToBottom } from "@arco-design/web-react/icon";

interface SingleUploadProps extends UploadProps {
  parentClassName?: string;
  fileSizeStr?: string;
  endTypePicUrl?: any;
  tempType?: string;
  tempUrl?: string; //excel 值为excel可以直接下载模板支持鉴权
  onDownload: (url: string) => void;
  initTit?: React.ReactElement;
  initInfo?: React.ReactElement;
  uploadImg?: any;
}
const SingleUpload = (props: SingleUploadProps) => {
  const {
    parentClassName = "",
    fileSizeStr, //如果是excel文件可以传文件大小，替换不能超过的大小，其他的类型请用initInfo整个替换
    onChange,
    onProgress,
    onReupload,
    initTit,
    initInfo,
    onDownload,
    endTypePicUrl = excelUrl, //上传后文件类型图片地址
    tempUrl, //下载模板地址
    tempType,
    uploadImg,
    ...otherProps
  } = props;
  const [uploadStatus, setUploadStatus] = useState("default");
  const [percent, setPercent] = useState(0);
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (props.defaultFileList && props.defaultFileList.length) {
      let status = props.defaultFileList[0]?.status || "default";
      setUploadStatus(status);
    } else {
      setUploadStatus("default");
    }
    return () => {
      setUploadStatus("default");
      setPercent(0);
      setFileList([]);
    };
  }, []);
  useEffect(() => {
    if (props?.fileList?.length === 0) {
      setUploadStatus("default");
      setPercent(0);
      setFileList([]);
    }
  }, [props && props?.fileList]);
  const downTemplate = () => {
    try {
      if (onDownload) {
        onDownload(tempUrl);
      } else {
        if (tempType === "excel") {
          downloadExcelTemp(tempUrl);
        } else {
          let link = document.createElement("a");
          link.href = tempUrl;
          link.click();
          setTimeout(() => {
            Message.success("下载成功");
          }, 1000);
        }
      }
    } catch (error) {}
  };
  return (
    <div className={`single-upload-wrap ${uploadStatus} ${parentClassName}`}>
      <Upload
        limit={{ maxCount: 1, hideOnExceedLimit: false }}
        fileList={fileList}
        onChange={(fileList, file) => {
          setFileList(fileList);
          if (fileList.length > 0) {
            const { action } = otherProps;
            setUploadStatus(file.status);
            if (!action) {
              setPercent(100);
            }
          } else {
            setUploadStatus("default");
            setPercent(0);
          }
          onChange && onChange(fileList, file);
        }}
        onReupload={(file) => {
          setPercent(0);
          onReupload && onReupload(file);
        }}
        onProgress={(file, e) => {
          setPercent(file.percent);
          onProgress && onProgress(file, e);
        }}
        {...otherProps}
      >
        <div className="trigger" id="uploadTrigger">
          {uploadStatus === "default" && (
            <div className="trigger-default">
              <div className="trigger-default-pic">
                <img
                  className="pic-default"
                  src={uploadImg || uploadDefaultUrl}
                  alt=""
                />
              </div>
              <div className="trigger-default-con">
                <div className="trigger-default-tit">
                  {initTit ? (
                    initTit
                  ) : (
                    <>
                      请把文件拖到此处或
                      <span
                        style={{ color: "#156AF8" }}
                        className="animated-underline"
                      >
                        点击上传
                      </span>
                    </>
                  )}
                </div>
                <div className="trigger-default-info">
                  {initInfo ? (
                    initInfo
                  ) : (
                    <>
                      只能上传Excel文件
                      {fileSizeStr ? `，且不超过${fileSizeStr}` : ""}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {uploadStatus !== "default" && percent < 100 && (
            <div className="trigger-init">
              <img src={endTypePicUrl} alt="" className="pic-default" />
              {uploadStatus === "uploading" && (
                <Progress percent={percent} width="65%" color="#156AF8" />
              )}
            </div>
          )}
          {uploadStatus !== "default" && percent === 100 && (
            <div className="trigger-init trigger-init-complete">
              <div className="trigger-init-file">
                <img src={endTypePicUrl} alt="" className="pic-default" />
                <div className="file-con">
                  <div className="file-name">{tryGet(fileList[0], "name")}</div>
                  <div className="file-size">
                    {formatFileSize(tryGet(fileList[0], "originFile.size"))}
                  </div>
                </div>
              </div>

              <Button
                className="replace-btn"
                icon={<IconSync />}
                size="mini"
                onClick={() => {
                  setFileList([]);
                  setUploadStatus("default");
                  onChange && onChange([], null);
                  setTimeout(() => {
                    document.getElementById("uploadTrigger").click();
                  }, 200);
                }}
              >
                替换
              </Button>
            </div>
          )}
        </div>
      </Upload>
      {tempUrl && (
        <div
          className="down-temp"
          onClick={() => {
            downTemplate();
          }}
        >
          <IconToBottom />
          下载模版
        </div>
      )}
    </div>
  );
};
export default SingleUpload;
