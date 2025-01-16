import { Button, ButtonProps } from "@arco-design/web-react";

import { FC } from "react";

export const CustomPrimaryButton: FC<{ attrs: ButtonProps }> = ({ attrs }) => {
  return <Button {...attrs}>{attrs.children}</Button>;
};
