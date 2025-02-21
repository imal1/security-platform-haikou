import { Icon } from "@/components";
import globalState from "@/globalState";
import {
  Cascader,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
  Upload,
} from "@arco-design/web-react";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import { IconEdit } from "@arco-design/web-react/icon";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import activityStore from "../../activity-manage/store";
import style from "../index.module.less";
import { getSceneServiceList, getSceneTypes, ISceneInfo } from "../webapi";
import MapPick from "./map-pick";

const SceneForm = ({ form }: { form: FormInstance<ISceneInfo> }) => {
  const formRef = useRef();
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState<UploadItem>();
  const [values, setValues] = useState<ISceneInfo>();
  const [sceneTypes, setSceneTypes] = useState<
    { code: string; name: string }[]
  >([]);
  const [sceneServiceList, setSceneServiceList] = useState<
    { serviceCode: string; serviceName: string }[]
  >([]);

  const fetchSceneTypes = async () => {
    const types = await getSceneTypes();
    setSceneTypes(types);
  };

  const fetchSceneServiceList = async () => {
    const { userName, roleCode } = globalState.get("userInfo");
    const list = await getSceneServiceList({
      ueUserName: userName,
      ueUserRole: roleCode,
    });
    setSceneServiceList(list);
  };

  const onValuesChange = (_, vals: ISceneInfo) => {
    setValues({ ...values, ...vals });
  };

  const onSubmit = async () => {
    try {
      const values = await form.validate();
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSceneTypes();
    fetchSceneServiceList();
    activityStore.getRegionAndChildren();
  }, []);

  return (
    <Form.Provider onFormSubmit={onSubmit} onFormValuesChange={onValuesChange}>
      <Form
        ref={formRef}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="场景名称"
          field="sceneName"
          rules={[{ required: true, message: "请输入场景名称" }]}
        >
          <Input placeholder="请输入场景名称" allowClear />
        </Form.Item>
        <Form.Item
          label="场景类型"
          field="sceneType"
          rules={[{ required: true, message: "请选择场景类型" }]}
        >
          <Select placeholder="请选择场景类型">
            {sceneTypes.map((item) => (
              <Select.Option key={item.code} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="场景服务"
          field="sceneServiceCode"
          rules={[{ required: true, message: "请选择场景服务" }]}
        >
          <Select
            placeholder="请选择场景服务"
            onChange={(value, option) => {
              console.log(option);
              // const sceneServiceName = option.label;
              // setValues({ ...values, sceneServiceName });
            }}
          >
            {sceneServiceList.map((item) => (
              <Select.Option key={item.serviceCode} value={item.serviceCode}>
                {item.serviceName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="场景中心点"
          field="sceneCenter"
          rules={[{ required: true, message: "请输入经纬度" }]}
        >
          <Input.Search
            searchButton={
              <>
                <Icon
                  type="anbao-pick-up"
                  className="text-[20px] align-[-4px] mr-[4px]"
                />
                拾取
              </>
            }
            onSearch={() => setVisible(true)}
            placeholder="请输入经纬度"
            allowClear
          />
          <Modal
            visible={visible}
            title="拾取经纬度"
            onCancel={() => setVisible(false)}
            onConfirm={() => setVisible(false)}
            getPopupContainer={() => formRef.current}
            style={{
              position: "fixed",
              inset: 0,
              borderRadius: 0,
              width: "100%",
              padding: 0,
            }}
            wrapStyle={{
              padding: 0,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <MapPick />
          </Modal>
        </Form.Item>
        <Form.Item
          label="所属行政区"
          field="regionId"
          rules={[{ required: true, message: "请选择所属行政区" }]}
          normalize={(value) => value.join(",")}
          formatter={(value) => value && value.split(",")}
        >
          <Cascader
            showSearch={true}
            placeholder="请选择行政区"
            allowClear={true}
            options={activityStore.areaTree}
            fieldNames={{
              label: "name",
              value: "id",
            }}
            onChange={(value, options) => {
              const regionName = options.map((item) => item.name).join();
              setValues({ ...values, regionName });
            }}
          />
        </Form.Item>
        <Form.Item label="场景面积" field="sceneArea">
          <Input
            placeholder="请输入场景面积"
            className="w-[calc(100%-32px)] mr-[8px]"
            allowClear
          />
          m²
        </Form.Item>
        <Form.Item label="场景图片" field="sceneThumbnail">
          <Upload
            fileList={file ? [file] : []}
            listType="picture-card"
            accept=".jpg,.jpeg,.png"
            showUploadList={false}
            className={style["scene-upload"]}
            onChange={(_, currentFile) => {
              setFile({
                ...currentFile,
                url: URL.createObjectURL(currentFile.originFile),
              });
            }}
          >
            {file?.url ? (
              <div className={style["arco-upload-list-item-picture"]}>
                <img src={file.url} />
                <div className="arco-upload-list-item-picture-mask leading-[88px]">
                  <IconEdit />
                </div>
              </div>
            ) : (
              <div className={style["arco-upload-trigger-picture"]}>
                <div className={style["arco-upload-trigger-picture-text"]}>
                  <Icon type="anbao-newly-added" />
                  <div className="mt-[2px] font-[600]">上传</div>
                </div>
              </div>
            )}
          </Upload>
          <div className={style["upload-desc"]}>
            支持上传JPG/JPEG/PNG格式文件，文件大小不超过10M
          </div>
        </Form.Item>
        <Form.Item label="场景说明" field="remark">
          <Input.TextArea
            placeholder="请输入场景说明"
            maxLength={200}
            autoSize={{ minRows: 4 }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Form.Provider>
  );
};

export default observer(SceneForm);
