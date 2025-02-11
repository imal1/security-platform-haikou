import store from "@/store";
import { Button, Form, Input, Message } from "@arco-design/web-react";
import { useState } from "react";
import { encodeWithRSA, tryGet } from "../../kit";
import { encodeLogin, getLoginSecret } from "./webapi";

const Login = () => {
  const [form] = Form.useForm();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const formError = async () => {
    try {
      const values = await form.validate();
      const { name, password } = values;
      if (!password || !password.trim()) {
        if (!name || !name.trim()) {
          throw new Error("请输入登录账号密码！");
        }
        throw new Error("请输入登录密码！");
      }
      if (!name || !name.trim()) {
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
  const handleLogin = async () => {
    try {
      const values = await formError();
      setLoading(true);
      const loginSecret = await getLoginSecret();
      const loginData = {
        userName: values.name,
        password: encodeWithRSA(values.password, loginSecret),
      };
      await encodeLogin(loginData);
      await store.initialPlatform();
      setLoading(false);
    } catch (error) {
      const newError = loginError(error) || error;
      setLoading(false);
      setErrMsg(newError.message);
      console.error(newError);
    }
  };
  return (
    <div className="m-auto text-center bg-blue-300 p-6">
      <Form.Provider onFormSubmit={handleLogin} onFormValuesChange={formError}>
        <Form form={form} autoComplete="off" wrapperCol={{ span: 24 }}>
          <h1>海口市大型活动安保平台</h1>
          <div>孪生智慧 安保未来</div>
          <div className="h-8 leading-8 text-left text-sm text-red-500">
            {errMsg}
          </div>
          <Form.Item field="name">
            <Input placeholder="请输入登录账号" />
          </Form.Item>
          <Form.Item field="password">
            <Input.Password
              placeholder="请输入密码"
              onPaste={(e) => {
                Message.warning("禁止粘贴");
                e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" long>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Form.Provider>
    </div>
  );
};

export default Login;
