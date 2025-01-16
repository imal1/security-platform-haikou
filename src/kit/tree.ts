/**
 * 封装树方法（类）
 *
 * @export
 * @class Trees
 */
export default class Trees {
  /**
   * antd提供的获取需要展开父节点的方法
   *
   * @static
   * @param {string} key 节点Key
   * @param {Array} tree 树列表
   * @returns {string} 返回父节点
   * @memberof Trees
   */
  static getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (
          node.children.some((item) => {
            return item.key === key;
          })
        ) {
          parentKey = node.key;
        } else {
          const keyFind = Trees.getParentKey(key, node.children);
          if (keyFind) parentKey = keyFind;
        }
      }
    }
    return parentKey;
  };
  /**
   * 为了获取第一个根节点的展开keys
   * @param tree 
   * @param key 
   * @param field 
   * @returns 
   */
  static getFirstRootKeys = (tree, key = "key", field = "children") => {
    const keys = [];
    function traverse(nodes) {
      if (!nodes || nodes.length === 0) return;
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        if (node[field]) {
          if (index == 0) {
            keys.push(node[key]);
          }
          traverse(node[field]);
        }
      }
    }
    traverse(tree);
    return keys;
  };
  /**
   * 获取第一个子节点
   *
   * @static
   * @param {Array} array（树节点列表）
   * @param {string} field（子级字段名称）
   * @param {boolean} lastHas（最后一级节点是否存在子级字段）
   * @returns {object} 返回第一个子节点
   * @memberof Trees
   */
  static getFirstChild = (array, field = "children", lastHas = true) => {
    let child = null;
    const forFn = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!!node[field] && !!node[field].length) {
          forFn(node[field]);
        } else if (!child && lastHas && (!node[field] || !node[field].length)) {
          child = node;
        } else if (!child && !lastHas && !node[field]) {
          child = node;
        }
      }
    };
    forFn(array);
    return child;
  };

  /**
   * 生成扁平化的节点数组
   *
   * @static
   * @param {Array} data 树列表
   * @param {Array} 生成扁平化的节点数组
   * @returns {Array} 生成扁平化的节点数组
   * @memberof Trees
   */
  static generateList = (data, arrayToChange) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title, children = [] } = node;
      arrayToChange.push({ key, title, children });
      if (node.children) {
        Trees.generateList(node.children, arrayToChange);
      }
    }
  };
  static generateListNew = (data, arrayToChange, field = "children") => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      arrayToChange.push({ ...node, [field]: null });
      if (node[field]) {
        Trees.generateListNew(node[field], arrayToChange, field);
      }
    }
  };
  /**
   * 树查询条件字段配置
   *
   * @static
   * @memberof Trees
   */
  static createAssociationTreeOption = {
    searchField: "title", // 需要匹配搜索内容的字段
    childrenField: "children", // 需要搜索的子级字段
    hasChildrenField: "hasChildren", //判断子级节点存在的字段（可选）
  };

  /**
   * 根据搜索内容删除不匹配的子节点
   *
   * @static
   * @param {Array} data 树列表
   * @param {string} searchContent 搜索内容
   * @param {any} options 搜索选项
   * @returns {Array} 搜索结果
   * @memberof Trees
   */
  static filterUsefulChildren = (origin, searchContent, options) => {
    const { searchField, childrenField, hasChildrenField } = options;
    const searchList = origin[childrenField];
    const usefulChildren = [];
    searchList.forEach((node) => {
      const { [searchField]: nodeContent, [childrenField]: children } = node;
      if (children && children.length)
        Trees.filterUsefulChildren(node, searchContent, options);
      if (
        (nodeContent && nodeContent.indexOf(searchContent) > -1) ||
        (node[childrenField] && node[childrenField].length)
      )
        usefulChildren.push(node);
    });
    if (usefulChildren.length) {
      origin[childrenField] = usefulChildren.filter(
        (node) =>
          (!!node[childrenField] && !!node[childrenField].length) ||
          !node[childrenField] ||
          node[hasChildrenField] === false
      );
    } else {
      origin[childrenField] = [];
    }
  };

  /**
   * 根据搜索内容生成相关树
   *
   * @static
   * @param {Array} sourceTree 需要过滤的树信息
   * @param {string} searchContent 搜索内容
   * @param {any} options 搜索选项
   * @returns {Array} 搜索结果
   * @memberof Trees
   */
  static createAssociationTree = (
    sourceTree,
    searchContent,
    options = Trees.createAssociationTreeOption
  ) => {
    const sourceTreeCloned = JSON.parse(JSON.stringify(sourceTree));
    const { childrenField } = options;
    let result = [];
    if (sourceTree && sourceTree.length) {
      const origin = { [childrenField]: sourceTreeCloned };
      Trees.filterUsefulChildren(origin, searchContent, options);
      if (origin[childrenField]) result = origin[childrenField];
    }
    return result;
  };
  /**
   * 根据key获取树的节点
   * @param data
   * @param key
   * @param field
   * @returns
   */
  static getNodeDataByCode = (
    data,
    key,
    field = "children",
    keyField = "key"
  ) => {
    const findNode = (data, key) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i][keyField] === key) {
          return data[i];
        } else if (data[i][field]) {
          const result = findNode(data[i][field], key);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
    return findNode(data, key);
  };
  /**
   * 根据key值添加参数
   * @param treeData
   * @param key
   * @param params
   * @param keyField
   * @param field
   * @returns
   */
  static addParamsToTree = (
    treeData,
    key,
    params,
    keyField = "key",
    field = "children"
  ) => {
    // 遍历树数据
    return treeData.map((node) => {
      // 判断当前节点是否是目标节点
      if (node[keyField] === key) {
        // 添加参数到当前节点
        return {
          ...node,
          ...params,
        };
      }
      // 判断当前节点是否有子节点
      if (node[field]) {
        // 递归遍历子节点，并添加参数
        return {
          ...node,
          [field]: Trees.addParamsToTree(
            node[field],
            key,
            params,
            keyField,
            field
          ),
        };
      }
      // 返回当前节点
      return node;
    });
  };
  /**
   * 将tree数据中的key转为字符串
   * @param treeData
   * @param keyField
   * @param field
   * @returns
   */
  static convertTreeKeyToString = (
    treeData,
    keyField = "key",
    field = "children"
  ) => {
    // 遍历树数据
    return treeData.map((node) => {
      // 将key转为字符串
      const newKey = node[keyField].toString();
      // 判断当前节点是否有子节点
      if (node[field]) {
        // 递归遍历子节点，并转换key为字符串
        return {
          ...node,
          [keyField]: newKey,
          [field]: Trees.convertTreeKeyToString(node[field], keyField, field),
        };
      }
      // 返回当前节点
      return {
        ...node,
        [keyField]: newKey,
      };
    });
  };
}
