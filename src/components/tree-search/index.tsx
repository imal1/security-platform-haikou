/**
 * tree搜索框
 */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Input, InputProps } from "@arco-design/web-react";
import { debounce } from "lodash";

interface TreeSearchProps extends InputProps {
  treeData: any[]; //树全量数据
  fieldNames: any;
  onCallback?: (val) => void; //搜索回调
}
const TreeSearch = (props: TreeSearchProps) => {
  const {
    treeData = [],
    fieldNames = {
      key: "key",
      title: "title",
      children: "children",
    },
    onCallback,
    ...other
  } = props;
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (!inputValue) {
      onCallback && onCallback(treeData);
    } else {
      const result = searchData(inputValue);
      onCallback && onCallback(result);
    }
  }, [inputValue]);

  //辖区树搜索
  const searchData = (inputValue) => {
    const { key, title, children } = fieldNames;
    inputValue = inputValue.trim();
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        if (
          item[title].toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
          (typeof item[key] === "string" &&
            item[key].toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
        ) {
          result.push({ ...item });
        } else if (item[children]) {
          const filterData = loop(item[children]);

          if (filterData?.length) {
            result.push({ ...item, [children]: filterData });
          }
        }
      });
      return result;
    };
    return loop(treeData);
  };

  return (
    <Input.Search
      {...other}
      onChange={debounce(setInputValue, 600)}
      onSearch={debounce(setInputValue, 600)}
    />
  );
};
export default observer(TreeSearch);
