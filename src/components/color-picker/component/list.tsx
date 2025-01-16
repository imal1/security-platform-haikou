import { Component } from "react";
import reactCSS from "reactcss";
import { CustomPicker, CirclePicker } from "react-color";
import {
  Hue,
  Saturation,
  Alpha
} from "react-color/lib/components/common";

import ConfirmButton from "../../../components/common/ConfirmButton";

const quickSelectColor = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
];
const inlineStyles = {
  saturationPointer: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    border: "2px solid #FFF",
  },
  alphaPointer: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    border: "2px solid #FFF",
    transform: "translateX(-50%)",
  },
  huePointer: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    border: "2px solid #FFF",
    transform: "translateY(-50%)",
  },
};

const SaturationPointer = () => {
  return <div style={inlineStyles.saturationPointer} />;
};

const AlphaPointer = () => {
  return <div style={inlineStyles.alphaPointer} />;
};

const HuePointer = () => {
  return <div style={inlineStyles.huePointer} />;
};

class List extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: {
        r: "241",
        g: "112",
        b: "19",
        a: "1",
      },
      position: {
        top: 0,
        left: 0,
      },
    };
  }

  componentDidMount() {
    try {
      const { color } = this.props;
      this.setState({ color: color });
    } catch (error) {}
  }

  render() {
    const { position } = this.state;
    const { style } = this.props;

    const styles = reactCSS({
      default: {
        color: {
          width: "10.3px",
          height: "10.3px",
          borderRadius: "1.87px",
          background: this.props.hex,
        },
        swatch: {
          padding: "1.85px",
          background: "#fff",
          borderRadius: "1.87px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
      },
    });
    return (
      <div className="color-picker-component" style={style}>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div
            id="color-out-container"
            className="color-out-container"
            style={position}
          >
            <div
              className="color-picker-mask"
              onClick={(event) => {
                try {
                  this.handleClose();

                  const { onClose } = this.props;
                  if (onClose) onClose(event);
                } catch (error) {}
              }}
            />
            <div className="color-picker-container">
              <div className="saturation-wrapper wrapper">
                <Saturation
                  {...this.props}
                  onChange={this.handleChange}
                  pointer={SaturationPointer}
                />
              </div>
              <div className="alpha-wrapper wrapper">
                <Alpha
                  {...this.props}
                  onChange={this.handleChange}
                  pointer={AlphaPointer}
                />
              </div>
              <div className="circle-wrapper wrapper">
                <CirclePicker
                  width="210px"
                  circleSize={14}
                  circleSpacing={14}
                  colors={quickSelectColor}
                  onChange={this.handleChange}
                />
              </div>
              <div className="hue-wrapper wrapper">
                <Hue
                  {...this.props}
                  direction="vertical"
                  pointer={HuePointer}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-wrapper">
                {/* <div className="simulation-input">
                  <div
                    className="simulation-color"
                    style={{ background: this.props.hex }}
                  />
                  <EditableInput
                    value={this.props.hex}
                    onChange={this.handleChange}
                  />
                </div> */}
                <ConfirmButton size="small" onClick={this.confirmColor}>
                  <span>确定</span>
                </ConfirmButton>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * 点击出现颜色选择器
   * @param event
   */
  private handleClick = (event) => {
    try {
      //阻止冒泡
      event.stopPropagation();

      //只显示一个选择器
      const dom = document.getElementById("color-out-container");
      if (dom) dom.style.display = "none";

      //获取操作变量值
      const elPosition = event.target.getBoundingClientRect();
      const pickerHeight = 255; //颜色器高度
      const pickerWidth = 233; //颜色器宽度
      const chooseWidth = 14; //选择器宽度
      const margin = 10; //外边距
      const windowHeight = document.body.clientHeight; //页面可视区高度
      const windowWidth = document.body.clientWidth; //页面可视区宽度

      let top;
      let left;

      //判断弹框所在Top位置（如果超过页面可视区高度则需要重置位置）
      if (
        windowHeight - elPosition.top - pickerHeight - margin - chooseWidth >
        0
      ) {
        top = elPosition.top + chooseWidth + margin;
      } else {
        top = elPosition.top - pickerHeight - margin;
      }

      //判断弹框所在Left位置（如果超过页面可视区宽度则需要重置位置）
      if (
        windowWidth - elPosition.left - pickerWidth - margin - chooseWidth >
        0
      ) {
        left = elPosition.left;
      } else {
        left = elPosition.left - pickerWidth + chooseWidth;
      }

      this.setState({
        displayColorPicker: !this.state.displayColorPicker,
        position: { top, left },
      });

      const { onSwitch } = this.props;
      if (onSwitch) onSwitch(event);
    } catch (error) {}
  };

  /**
   * 关闭
   */
  private handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  /**
   * 选择事件
   * @param color
   * @param event
   */
  private handleChange = (color, event) => {
    try {
      event.stopPropagation();

      const { onChange } = this.props;
      if (onChange) onChange(color, event);
    } catch (error) {}
  };

  /**
   * 确定事件
   * @param e
   */
  private confirmColor = (e) => {
    try {
      e.stopPropagation();

      const { onConfirmColor, id, item } = this.props;
      if (onConfirmColor) onConfirmColor(this.props.hex, id, item);

      this.handleClose();
    } catch (error) {}
  };
}

export default CustomPicker(List);
