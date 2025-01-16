import "./index.less";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { Table, TableProps, Tooltip } from "@arco-design/web-react";

import NoData from "../no-data";
import { debounce } from "lodash";
import { useMediaQuery } from "../../kit/hooks";

const KArcoTable = (
  props: TableProps & {
    limitColumnFields?: string[];
    isSearchNotFound?: boolean;
    noDataStyle?: CSSProperties;
  } & Record<string, any>
) => {
  const {
    columns = [],
    className = "k-arco-table",
    border = { headerCell: true },
    limitColumnFields = [],
    isSearchNotFound = false,
    noDataStyle = {},
    data = [],
  } = props;

  const { isLaptop } = useMediaQuery();
  const tableColumns = columns.filter(
    (i) => !limitColumnFields.includes(i["dataIndex"])
  );
  // 用于动态切换表格元素的提示框的逻辑状态
  const tableRef = useRef<HTMLDivElement>();
  const [updateSizeFlag, setUpdateSizeFlag] = useState(false);
  useEffect(() => {
    const onResize = debounce(() => setUpdateSizeFlag((v) => !v), 100);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div ref={tableRef}>
      <Table
        noDataElement={
          <NoData
            status={isSearchNotFound}
            height={isLaptop ? 400 : 650}
            style={{ ...noDataStyle }}
          />
        }
        {...props}
        data={data}
        columns={tableColumns}
        components={{
          ...props?.components,
          body: {
            cell: (props) => {
              // console.log("cell props:", props);
              const elemRef = useRef<HTMLSpanElement>(null);
              const [showTooltip, setShowTooltip] = useState(false);
              useEffect(() => {
                // 统一清理自动加上的title
                if (elemRef.current) {
                  elemRef.current.parentElement.removeAttribute("title");
                }
                // 没设置宽度，或设置了 ellipsis 属性，且内容超出时，才显示 tooltip
                // 添加动态的popover组件, 且只有当内容超出时才显示
                if (props?.column?.autoEllipsisCheck) {
                  setShowTooltip(
                    elemRef.current?.getBoundingClientRect().width >
                      elemRef.current?.parentElement?.getBoundingClientRect()
                        .width
                  );
                }
              }, [props?.column?.width, updateSizeFlag]);

              // 超出默认容器，更换为tooltip
              if (showTooltip)
                return (
                  <Tooltip content={props.children} position="tl">
                    <span
                      className={props.className}
                      style={{
                        color: "red!important",
                      }}
                    >
                      {props.children}
                    </span>
                  </Tooltip>
                );
              // 返回默认展示的内容
              return (
                <span ref={elemRef} className={props.className}>
                  {props.children}
                </span>
              );
            },
          },
        }}
        className={`table-resizable-column k-arco-table ${className} ${
          props.className ?? ""
        } ${data.length === 0 ? "k-acro-table-no-data" : ""}`}
        border={border}
      />
    </div>
  );
};

export default KArcoTable;
