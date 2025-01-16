import "./index.less";

import { Tree, TreeSelectProps, TreeProps } from "@arco-design/web-react";
/**
 * 如果要整行展开收起renderTitle必填
 * renderTitle必填
 * setExpandedKeys参数为设置展开收起方法
 * onRenderTitleClick为自定义设置展开收起方法
 * setExpandedKeys和onRenderTitleClick根据选择使用（优先选择使用setExpandedKeys参数）
 */

const KArcoTree = (props: any) => {
  const {
    renderTitle,
    onRenderTitleClick,
    className,
    setExpandedKeys,
    ...others
  }: any = props;

  let RenderTitle = renderTitle;
  let RenderTitle_L = renderTitle;

  if (RenderTitle_L) {
    RenderTitle_L = (props) => (
      <>
        <div
          className="K-Arco-Tree-RenderTitle"
          onClick={(e) => {
            if (onRenderTitleClick) {
              onRenderTitleClick(props, e);
            } else if (setExpandedKeys) {
              handleTitleClick(props);
            }
          }}
        >
          <RenderTitle {...props} />
        </div>
      </>
    );
  }
  const handleTitleClick = (node) => {
    const { expandedKeys } = props;
    const key = node._key;
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== key));
    } else {
      setExpandedKeys([...expandedKeys, key]);
    }
  };
  props = Object.assign({}, props, { renderTitle: RenderTitle_L });

  return (
    <Tree
      {...props}
      className={`K-Arco-Tree ${className ?? ""}`}
      {...others}
    ></Tree>
  );
};

export default KArcoTree;
