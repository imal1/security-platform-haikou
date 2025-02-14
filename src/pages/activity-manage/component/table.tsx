import noDataUrl from "@/assets/img/no-data/no-data.svg";
import noServerUrl from "@/assets/img/no-data/no-search.svg";
import {
  Empty,
  Modal,
  Table,
  TableColumnProps,
  Tooltip,
} from "@arco-design/web-react";
import { IconDelete, IconFile } from "@arco-design/web-react/icon";
import { observer } from "mobx-react";
import store from "../store";
// import {IconDelete} from "@arco-iconbox/react-kdesign-icon"

interface IndexProps {
  data: Array<any>;
  loading: boolean;
  dataStatus: boolean;
  getList: () => void;
}
const Index = (props: IndexProps) => {
  const { data, loading, dataStatus, getList } = props;
  const columns: TableColumnProps[] = [
    {
      title: "活动封面",
      dataIndex: "videoFusionCode",
      width: 200,
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "活动名称",
      dataIndex: "name",
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "场景编码",
      dataIndex: "sceneCode",
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "活动场景",
      dataIndex: "serviceName",
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "活动类型",
      dataIndex: "serviceCode",
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "举办时间",
      dataIndex: "updatedTime",
      ellipsis: true,
      width: 180,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "举办单位",
      dataIndex: "serviceCode",
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "活动安保等级",
      dataIndex: "serviceCode",
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "活动状态",
      dataIndex: "serviceCode",
      ellipsis: true,
      render(col, item, index) {
        return <span title={col}>{col || "-"}</span>;
      },
    },
    {
      title: "操作",
      dataIndex: "Operation",
      width: 160,
      render(col, item, index) {
        return (
          <div className="operation">
            <Tooltip
              color="#fff"
              content={<span style={{ color: "#1d2129" }}>查看</span>}
            >
              <IconFile onClick={() => {}} />
            </Tooltip>
            <Tooltip
              color="#fff"
              content={<span style={{ color: "#1d2129" }}>编辑</span>}
            >
              <IconFile onClick={() => {}} />
            </Tooltip>
            <Tooltip
              color="#fff"
              content={<span style={{ color: "#1d2129" }}>复制</span>}
            >
              <IconFile onClick={() => {}} />
            </Tooltip>
            <Tooltip
              color="#fff"
              content={<span style={{ color: "#1d2129" }}>删除</span>}
            >
              <IconDelete
                onClick={() => {
                  onDel(item);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const onDel = async (row) => {
    Modal.info({
      title: "提示",
      content: "活动正在进行中，不可删除！",
    });
    Modal.confirm({
      title: "确定删除该条活动数据？",
      content: "删除后数据不可恢复，活动下的方案数据将同步被清除。",
      closable: true,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        // await store.deleteVideoFusion(row.id);
        store.clearPager();
        await getList();
      },
    });
  };
  const { pager } = store;
  return (
    <div className="activity-manage-table-warp">
      <Table
        className="custom-table"
        rowKey={(record) => record.id}
        columns={columns}
        data={data}
        borderCell={false}
        border={false}
        style={{ width: "auto" }}
        loading={loading}
        pagination={{
          ...pager,
          sizeCanChange: true,
          style: { marginTop: 50 },
          onChange: store.pagerChange,
        }}
        scroll={
          {
            // x: 1400,
            // y: 360,
          }
        }
        noDataElement={
          <Empty
            className="table-arco-empty"
            style={{ height: 400 }}
            imgSrc={dataStatus ? noServerUrl : noDataUrl}
            description={dataStatus ? "未搜索到相关结果~" : "暂无数据"}
          />
        }
      />
    </div>
  );
};

export default observer(Index);
