import { Button, ButtonProps } from "@arco-design/web-react";

export default function(params: ButtonProps) {
  return <Button type="primary" {...params} data-confirm-btn/>;
}