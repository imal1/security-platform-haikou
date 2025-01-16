import { HTMLProps } from "react";
import icon from "@/assets/img/common/error.svg";
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  return <img src={icon} {...props} alt="" />;
}
