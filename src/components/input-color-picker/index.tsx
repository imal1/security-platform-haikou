import { Input, ColorPicker, InputProps } from "@arco-design/web-react";
import { useState, useEffect } from "react";
import "./index.less";

const InputColorPIcker = (props: InputProps) => {
  const [value, setValue] = useState(props.value || props.defaultValue);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  return (
    <Input
      {...props}
      className={`input-color-picker ${props.className}`}
      value={value}
      onChange={(val, e) => {
        setValue(val);
        props.onChange && props.onChange(val, e);
      }}
      suffix={
        <ColorPicker
          value={value}
          size={"small"}
          // format="rgb"
          onChange={(val) => {
            setValue(val);
            props.onChange && props.onChange(val, null);
          }}
        />
      }
    />
  );
};

export default InputColorPIcker;
