import * as icon from "@arco-iconbox/react-hkzbh";
interface IconBoxProps {
  type: string;
}
const IconBox = (props: IconBoxProps) => {
  const { type, ...other } = props;
  const Icon = icon[type];
  return (
    <Icon
      // 添加缺失的属性以满足类型要求
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
      {...other}
    />
  );
};
export default IconBox;
