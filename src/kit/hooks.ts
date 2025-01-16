import { useEffect, useRef, useState } from "react";

export const useModalStatus = () => {
  const [visible, setVisible] = useState(false);

  return {
    visible, setVisible
  }
}
/**
 * 分页状态数据
 * @returns 
 */
export const useTablePagination = () => {
  const [pageParams, setPageParams] = useState({
    pageNo: 1,
    pageSize: 20
  })
  return {
    pageParams, setPageParams
  }
}

/**
 * 带搜索的分页状态数据
 * @returns 
 */
export const useTablePaginationWithQuery = () => {
  const [query, setQuery] = useState('');
  const params = useTablePagination();
  return {
    ...params,
    query, setQuery
  }
}

/**
 * 媒体查询，常用于表单滚动高度设置
 * @returns 
 */
export const useMediaQuery = () => {
  const [isLaptop, setIsLaptop] = useState(false);
  const [isPC, setIsPC] = useState(false);
  const [is4KScreen, setIs4KScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth < 1400);
      setIsPC(window.innerWidth >= 1400 && window.innerWidth < 2000);
      setIs4KScreen(window.innerWidth >= 2000);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [])
  return {
    isLaptop, isPC, is4KScreen
  }
}

/**
 * 用于获取父元素的高度，有助于表单的滚动设置
 * @param selector 父元素选择器
 * @returns 父元素的高度和ref
 */
export const useParentHeight = (selector: string) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    const parentElement = document.querySelector(selector);
    if (parentElement) {
      setHeight(parentElement.clientHeight);
    }
    const onResize = () => {
      if (parentElement) {
        setHeight(parentElement.clientHeight);
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [])
  return {
    elementRef, height
  }
}

/**
 * 根据选择器选中的父元素高度，计算表格的滚动高度，减去topOffset，常用于表格滚动设置
 * @param selector 
 * @param topOffset 
 * @returns 表格滚动属性
 */
export const useTableScrollHeight = (selector: string, topOffset = 200) => {
  const { height } = useParentHeight(selector);
  const [scroll, setScroll] = useState<{ y: number }>({y: 0});
  useEffect(() => {
    if (height) {
      setScroll({
        y: height - topOffset
      });
    } else {
      setScroll({y: 0});
    }
  }, [height])
  return scroll
}
