/**
 * 动态引入script
 * @param {string} url 资源地址
 * @param {function} callback 回调事件
 * @returns
 */
export const loadJS = (url: string, callback: any) => {
  try {
    let script: any = document.createElement('script'),
      fn = callback || function () {};
    script.type = 'text/javascript';
    //IE
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (
          script.readyState === 'loaded' ||
          script.readyState === 'complete'
        ) {
          script.onreadystatechange = null;
          fn();
        }
      };
    } else {
      //其他浏览器
      script.onload = function () {
        fn();
      };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  } catch (error) {}
};
