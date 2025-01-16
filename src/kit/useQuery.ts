import { useLayoutEffect, useRef, useState } from "react";

type ApiTaskFunction<T> = () => Promise<T>;

interface IOption<T> {
  // 异步任务，返回接口数据的函数
  apiTask: ApiTaskFunction<T>;
  // 是否自动执行异步任务，还是手动控制（默认自动执行）
  auto?: boolean;
  onSuccess?: (data?: T) => Function | void | Promise<Function | void>;
  onError?: (err?: any) => any;
  // 支持初始化一个数据
  initData?: T | undefined;
  // 支持监听其他数据变化，变化后重新请求
  watch?: React.DependencyList;
  // 定时任务
  interval?: number;
}

/**
 * A custom hook for making API requests and handling the response.
 * @template T - The expected response data type.
 * @param {Object} options - The options object.
 * @param {Function} options.apiTask - The function that makes the API request.
 * @param {Function} [options.onSuccess] - The function to be called on successful API response.
 * @param {Function} [options.onError] - The function to be called on API error.
 * @param {boolean} [options.auto=true] - A boolean indicating whether to make the API request automatically on component mount.
 * @param {T} [options.initData] - The initial data to be set before the API request is made.
 * @param {Array} [options.watch=[]] - An array of values to watch for changes and trigger a new API request.
 * @param {number} [options.interval] - The interval in milliseconds to automatically refetch the API data.
 * @returns {Object} - An object containing the API response data, loading and fetching states, error, refetch function, cancelInterval function, and runBeforeUnmountCallback function.
 */
export const useQuery = <T>({
  apiTask,
  onSuccess,
  onError,
  auto = true,
  initData,
  watch = [],
  interval,
}: IOption<T>) => {
  // 首次渲染是为true，后续都是false
  const [loading, setLoading] = useState<boolean>(true);
  // 没错请求都为true，请求结束为false
  const [fetching, setFetching] = useState<boolean>(auto);
  const autoRef = useRef<boolean>(auto);
  const [data, setData] = useState<T | undefined>(initData);
  const [error, setError] = useState<any>(undefined);
  const [flag, setFlag] = useState<boolean>(true);
  const refetch = () => setFlag((prev) => !prev);
  const timer = useRef<NodeJS.Timeout>();

  const cancelInterval = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  const runBeforeUnmountRef = useRef<Function>(() => {});

  useLayoutEffect(() => {
    let successCallback: Function | undefined = undefined;
    if (autoRef.current === true) {
      setFetching(true);
      apiTask()
        .then((res) => {
          setError(undefined);
          setData(res);
          let _successCallback = onSuccess?.(res);
          if (_successCallback instanceof Function) {
            successCallback = _successCallback;
          }
          setLoading(false);
          if (interval) {
            timer.current = setTimeout(() => {
              refetch();
            }, interval);
          }
        })
        .catch((err) => {
          setError(err);
          onError?.(err);
        })
        .finally(() => {
          setFetching(false);
        });
    }
    autoRef.current = true;
    return () => {
      cancelInterval();
      runBeforeUnmountRef.current?.();
      successCallback?.();
    };
  }, [flag, ...watch]);

  // 返回数据和状态，重新请求的方法
  return {
    data,
    loading,
    fetching,
    error,
    refetch,
    cancelInterval,
    // 提供一个函数，用于在组件卸载前执行某些需要的逻辑
    runBeforeUnmountCallback: (fc: Function) =>
      (runBeforeUnmountRef.current = fc),
  };
};
