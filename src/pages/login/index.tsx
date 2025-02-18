import store from "@/store";
import { Button, Checkbox, Form, Input, Message } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import {
  delCookie,
  encodeWithRSA,
  getCookie,
  getProjectRelativePath,
  getQueryString,
  microAppHistory,
  removeQueryString,
  setCookie,
  tryGet,
} from "../../kit";
import Styles from "./index.module.less";
import { encodeLogin, getLoginSecret } from "./webapi";

const projectRelativePath = getProjectRelativePath();

const Login = () => {
  const [form] = Form.useForm();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const formError = async () => {
    try {
      const values = await form.validate();
      const { userName, password } = values;
      if (!password || !password.trim()) {
        if (!userName || !userName.trim()) {
          throw new Error("请输入登录账号密码！");
        }
        throw new Error("请输入登录密码！");
      }
      if (!userName || !userName.trim()) {
        throw new Error("请输入登录账号！");
      }
      setErrMsg("");
      return values;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const loginError = (error: any) => {
    let errMsg = error
      ? typeof error === "object"
        ? tryGet(error, "message") || "登录失败"
        : error
      : "登录失败";

    if (errMsg.includes("404 Not Found") || errMsg.includes("code 404")) {
      errMsg = "服务未找到";
    } else if (errMsg.includes("500 Service") || errMsg.includes("code 500")) {
      errMsg = "服务内部错误";
    } else if (errMsg.includes("503 Service") || errMsg.includes("code 503")) {
      errMsg = "服务不可用";
    }

    return new Error(errMsg);
  };
  const loginRemember = (values) => {
    const remember = form.getFieldValue("remember");
    if (remember) {
      setCookie("userName", window.btoa(values.userName), 7);
      setCookie("password", window.btoa(values.password), 7);
      setCookie("remember", "true", 7);
    } else {
      delCookie("userName");
      delCookie("password");
      delCookie("remember");
    }
  };
  const handleLogin = async (e) => {
    try {
      const values = await formError();
      setLoading(true);
      const loginSecret = await getLoginSecret();
      const loginData = {
        userName: values.userName,
        password: encodeWithRSA(values.password, loginSecret),
      };
      const { sysToken } = await encodeLogin(loginData);
      store.serverToken = sysToken;
      localStorage.setItem("server-token", sysToken);
      await store.initialPlatform();
      loginRemember(values);
      setLoading(false);
      goNextPage();
    } catch (error) {
      const newError = loginError(error) || error;
      setLoading(false);
      setErrMsg(newError.message);
      console.error(newError);
    }
  };
  const goNextPage = () => {
    try {
      let redirectUrl = "/activity-manage";
      const hash = window.location.hash.split("#")[1];
      if (hash) {
        //获取回调地址（若存在则更新）
        const backUrl = getQueryString(hash, "backUrl");
        if (backUrl) {
          redirectUrl = backUrl;

          //回调地址中若包含jwtToken且已过期则更新
          // const token = localStorage.getItem('server-token');
          // const jwtToken = getQueryString(redirectUrl, "jwtToken");
          // if (jwtToken && jwtToken !== token) {
          //   redirectUrl = redirectUrl.replace(
          //     new RegExp(`jwtToken=[^&]*`, "gi"),
          //     `jwtToken=${token}`,
          //   );
          // }
        }
      }

      //判断是否为路由地址
      if (
        !redirectUrl.includes("http://") &&
        !redirectUrl.includes("https://")
      ) {
        //进行路由页面跳转
        microAppHistory.push(redirectUrl);
      } else {
        //移除子平台回调参数
        removeQueryString(["backUrl"]);

        //获取子平台唯一标识
        const platformUniqueId = getQueryString(
          redirectUrl,
          "platformUniqueId",
        );

        //打开新页面显示
        window.open(redirectUrl, platformUniqueId);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const remember = getCookie("remember") === "true";
    if (remember) {
      form.setFieldsValue({
        userName: window.atob(getCookie("userName")),
        password: window.atob(getCookie("password")),
        remember,
      });
    }
  }, [form]);

  return (
    <div className={Styles["login-page"]}>
      <video
        className={Styles["login-video"]}
        src={`${projectRelativePath}/static/login-video.mp4`}
        autoPlay
        loop
        muted
      ></video>
      <div className={Styles["login-box"]}>
        <div className="px-[5px]">
          <div className="relative m-auto w-[96px]">
            <img
              className="animate-pulse absolute w-[25px] top-[2px] translate-x-[calc(-100%-34px)]"
              src={require("@/assets/img/title-login-decoration.png")}
            />
            <img src={require("@/assets/img/title-login.png")} />
            <img
              className="animate-pulse absolute w-[25px] top-[2px] right-0 translate-x-[calc(100%+30px)] rotate-180"
              src={require("@/assets/img/title-login-decoration.png")}
            />
          </div>
          <img
            className="mt-[80px]"
            src={require("@/assets/img/海口市大型活动安保平台.png")}
          />
          <img
            className="mt-[25px]"
            src={require("@/assets/img/孪生智慧安保未来.png")}
          />
        </div>
        <Form.Provider
          onFormSubmit={handleLogin}
          onFormValuesChange={loginError}
        >
          <Form
            form={form}
            className={Styles["login-form"]}
            autoComplete="off"
            wrapperCol={{ span: 24 }}
          >
            <div className="h-8 leading-8 text-left text-sm text-red-500">
              {errMsg}
            </div>
            <Form.Item field="userName">
              <div className={Styles["login-input-name"]}>
                <Input placeholder="请输入登录账号" />
              </div>
            </Form.Item>
            <Form.Item field="password">
              <Input.Password
                className={Styles["login-input-password"]}
                placeholder="请输入密码"
                onPaste={(e) => {
                  Message.warning("禁止粘贴");
                  e.preventDefault();
                }}
              />
            </Form.Item>
            <Form.Item field="remember" triggerPropName="checked">
              <Checkbox className={Styles["login-checkbox"]}>记住密码</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                className={Styles["login-btn"]}
                loading={loading}
                type="primary"
                htmlType="submit"
                long
              >
                安全登录
              </Button>
            </Form.Item>
          </Form>
        </Form.Provider>
      </div>
    </div>
  );
};

export default Login;
