import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import { deep } from "@/kit";
import store from "../store";
import {
  Input,
  Form,
  Radio,
  Checkbox,
  Empty,
  Tag,
  Tooltip,
  Popconfirm,
  DatePicker,
  List,
  Message,
  Button,
} from "@arco-design/web-react";

import Title from "../component/title";
import KeywordHighlighter from "./keyword-hightlight";
import noDataUrl, { NoData } from "@/assets/img/no-data/no-data.png";
import timeIcon from "@/assets/img/home/time-icon.png";
import locIcon from "@/assets/img/home/loc-icon.png";
import editWebp from "@/assets/img/home/edit-icon.png";
import deleteWebp from "@/assets/img/home/delete-icon.png";

import { debounce } from "lodash";
import dayjs from "dayjs";

import * as webApi from "../store/policeRemarkApi";

import { IconDelete } from "@arco-design/web-react/icon";

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const InputSearch = Input.Search;
const FormItem = Form.Item;

const dateList = [
  {
    label: "今日",
    value: "today",
  },
  {
    label: "昨日",
    value: "lastDay",
  },
  {
    label: "七日内",
    value: "lastSev",
  },
];

const LOCCOLORSENUM = {
  "0C": "#FD8022",
  "0Bd": "#D7722A",
  "0Bg": "rgba(215,114,42,0.4)",
  "1C": "#00B7FF",
  "1Bd": "#2AADD7",
  "1Bg": "rgba(42,173,215,0.4)",
  "2C": "#00C897",
  "2Bd": "#00c897",
  "2Bg": "rgba(0,200,151,0.4)",
};
// 状态对应的不通标签颜色
const COLORSENUM = {
  "0C": "#FD8022",
  "0Bd": "#D7722A",
  "0Bg": "rgba(215,114,42,0.2)",
  "1C": "#00B7FF",
  "1Bd": "#2AADD7",
  "1Bg": "rgba(42,173,215,0.2)",
  "2C": "#00C897",
  "2Bd": "#00C897",
  "2Bg": "rgba(0,200,151,0.2)",
};

interface PoliceRemarkProps {
  style?: React.CSSProperties;
}

// 保存当前页面所有已经绘制过的标注点，下次绘制直接进行show和hide， 避免多次绘制
let pageDataBack = [];

const PoliceRemark = (props: PoliceRemarkProps) => {
  const { style } = props;
  const [statusKeys, setStatusKeys] = useState(["0"]);
  const [selectAll, setSelectAll] = useState(false);
  const [calTime, setCalTime]: any = useState([]);
  const [dateValue, setDateValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [detailId, setDetailId] = useState(""); // 当前选中查看详情的

  // 状态复选框操作
  const setListStatusKeys = (val) => {
    // 是否全选
    setSelectAll(val?.length === 3);
    // 当前的statusKeys-
    setStatusKeys(val);
  };
  // 列表点击选中
  const setListSelected = (val, item) => {
    let data = deep(tableData);
    let obj = data.find((i) => i.id === item.id);
    obj.isSelected = val;
    setTableData(data);
  };

  // 编辑警情标注
  const handleEdit = (item) => {
    store.selectedPoliceRemark = { ...item };
    store.homePoliceRemarkVisible = true;
  };
  //删除警情标注
  const handleDeletePoliceRemark = (item) => {
    webApi
      .deletePoliceRemark(item.id)
      .then((res) => {
        if (res === 1) {
          Message.success("删除成功");
          getData();
        } else {
          Message.error("删除失败");
        }
      })
      .catch(() => {
        Message.error("删除失败");
      });
  };
  // 顶部按钮"清除标注"
  const handleRemoveRemark = () => {
    // 全选状态下清除，则直接触发全选状态改变事件即可
    if (selectAll) {
      setSelectAll(false);
    } else {
      // 非全选状态下勾选，便利取消勾选状态
      let newTableData = deep(tableData);
      newTableData.forEach((i) => {
        i.isSelected = false;
      });
      setTableData(newTableData);
    }
  };
  // 自定义元素-警情标注元素
  const getElement = (item) => {
    const { dealStatus, isClicked } = item;
    const backgroundColor = LOCCOLORSENUM[`${dealStatus}Bd`];
    const borderColor = "#fff";
    const color = "#fff";

    const txt = store.policeRemarkStatusNameEnum[dealStatus];
    // 点击状态下的图标
    let clickedImg = `${window.location.origin}${window.location.pathname}static/police-remark-flag-ing.png`;
    // 常态下的图标
    let staticImg = `${window.location.origin}${window.location.pathname}static/police-remark-flag-animation.png`;
    let imgUrl = isClicked ? clickedImg : staticImg;
    return (
      '<div style="cursor:pointer;display: flex; flex-direction: column; align-items: center;"><div style="position:relative; bottom:-16px; font-size: 14px; width:46px; text-align:center; padding: 0 4px; line-height: 18px;background-color:' +
      backgroundColor +
      ";border: 1px solid " +
      borderColor +
      "; font-weight:bold; border-radius:1px;color: " +
      color +
      ';">' +
      txt +
      '</div><img style="width: 124px;height: 86px;" src="' +
      imgUrl +
      '" alt=""/></div>'
    );
  };
  // 绘制警情标注
  const drawPoliceRemark = (item) => {
    const { position, isSelected, remarkObj } = item;
    let location =
      typeof position === "object"
        ? position
        : position && JSON.parse(position);
    //  兼容一下老数据数组形式
    let centerPoint = {};
    if (Array.isArray(location)) {
      centerPoint = {
        lng: location[0],
        lat: location[1],
        alt: 20,
      };
    } else {
      centerPoint = { ...location };
    }
    // 选中状态下
    if (isSelected) {
      if (remarkObj) {
        remarkObj && remarkObj.show && remarkObj.show();
      } else {
        item.remarkObj = new window["KMapUE"].CustomOverlay({
          viewer: store.viewer,
          options: {
            id: `police-remark-${item.id}`,
            isFixedScale: true,
            position: centerPoint,
            element: getElement(item),
            customProps: String(item.id), //存入id， 点击的时候用于获取详情数据
            onComplete: (res) => {
              item.remarkObj?.on("click", (res) => {
                store.homePoliceRemarkVisible = false;
                // 选中元素， 重建元素， 背景色重新处理
                const id = res.property.customProps;
                let obj = tableData.find((i) => i.id == id);
                if (obj) {
                  // 存入详情数据，用于弹窗页面展示
                  store.selectedPoliceRemark = {
                    ...obj,
                    readOnly: true, //  只读状态
                  };
                  // 打开详情页面
                  store.homePoliceRemarkVisible = true;
                  setDetailId(obj.id); // 左侧选中
                  redrawClickedPoliceRemark(item);
                }
              });
              // 处理鼠标移到范围内展示可点击状态
              item.remarkObj?.on("mouseover", (res) => {
                document.body.style.cursor = "pointer";
              });
              item.remarkObj?.on("mouseout", (res) => {
                document.body.style.cursor = "default";
              });
            },
            onError: (err?) => {},
          },
        });
      }
    } else {
      // 隐藏会乱掉， show对应的hide
      // remarkObj && remarkObj.hide && remarkObj.hide();
      // 直接remove掉（hide后期再跟着实例清除会比较麻烦）
      remarkObj && remarkObj.remove && remarkObj.remove();
      item.remarkObj = null;
    }
  };

  // 处理列表接口请求参数
  const getListParam = () => {
    let today = dayjs().format("YYYY-MM-DD");
    // 默认当天
    let param = {
      startDate: today,
      endDate: today,
      name: inputValue,
      dealStatus: statusKeys,
    };
    if (calTime?.length) {
      param.startDate = calTime[0];
      param.endDate = calTime[1];
    }
    if (dateValue === "lastDay") {
      param.startDate = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      param.endDate = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    }
    if (dateValue === "lastSev") {
      param.startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      param.endDate = today;
    }
    return param;
  };

  useEffect(() => {
    return () => {
      //  清除标记
      pageDataBack.forEach((i) => {
        i.isSelected = false;
        drawPoliceRemark(i);
      });
      // 关闭新增警情标注弹窗
      store.homePoliceRemarkVisible = false;
      // 关闭对应责任区弹窗
      store.homeSecurityInfoVisible = false;
    };
  }, []);

  // 渲染
  const drawPagePoliceRemarks = (flag) => {
    let ids = tableData.map((i) => i.id);
    tableData.forEach((i) => {
      let t = pageDataBack.find((it) => it.id === i.id);
      if (!t) {
        pageDataBack.push(i);
      } else {
        t.dealStatus = i.dealStatus;
        t.isSelected = i.isSelected;
      }
    });
    pageDataBack.forEach((i) => {
      if (!ids.includes(i.id)) {
        i.isSelected = false; //本次筛选不在范围的， 就要隐藏
      }
      if (flag === "again" && i.remarkObj) {
        i.remarkObj = null;
      }
      drawPoliceRemark(i);
    });
  };

  //
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      drawPagePoliceRemarks("direct");
    }, 600);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [tableData]);

  //点击全选，取消全选的逻辑
  useEffect(() => {
    let list = deep(tableData);
    list.forEach((i) => {
      i.isSelected = selectAll;
    });
    setTableData(list);
  }, [selectAll]);

  //选项变动，触发列表重新加载数据
  useEffect(() => {
    // 切换选项,  处理列表值
    console.log("切换的  日期选项值", dateValue);
    if (store.homeLeftSideActive !== "2") return;
    // 保存， 发生变动
    if (
      store.policeRemarkRefresh &&
      store.latestSavedPoliceRemark &&
      store.latestSavedPoliceRemark.id
    ) {
      //保存之后，
      let obj = pageDataBack.find(
        (i) => i.id === store.latestSavedPoliceRemark.id
      );
      if (obj?.remarkObj) {
        obj.remarkObj && obj.remarkObj.remove && obj.remarkObj.remove();
        obj.remarkObj = null; // 重置，下次重新渲染
      }
    }
    // if (!dateValue && !(calTime?.length === 2) && !store.policeRemarkRefresh) return;
    if (!dateValue && !(calTime?.length === 2)) return;
    // 重置可刷新状态
    store.policeRemarkRefresh = false;
    getData();
  }, [dateValue, calTime, store.policeRemarkRefresh, inputValue, statusKeys]);

  // 切换左侧面板的时候要同步清除之前绘制的内容
  useEffect(() => {
    if (store.homeLeftSideActive === "2") {
      store.removeDeviceLayer("toolDevice");
      store.location = null;
      setDateValue("today");
      // 判断此时如果是从别的页面切换过来
      // if (tableData?.length && pageDataBack?.length) {
      //   drawPagePoliceRemarks("again");
      // }
      if (!tableData?.length && pageDataBack?.length) {
        pageDataBack = [];
      }
    } else {
      // 清掉所有绘制的，重新处理
      // pageDataBack.forEach(i => {
      //   i.remarkObj?.remove && i.remarkObj.remove();
      // });
    }
  }, [store.homeLeftSideActive]);
  // 清掉所有绘制的
  const clearMark = () => {
    try {
      pageDataBack.forEach((i) => {
        i.remarkObj?.remove && i.remarkObj.remove();
      });
    } catch (error) {}
  };
  const getData = () => {
    setLoading(true);
    setDetailId("");
    store.homePoliceRemarkVisible = false; // 关闭弹窗
    setTableData([]);
    webApi
      .getPoliceRemarkList({
        ...getListParam(),
        pageSize: 1000,
        pageNo: 1,
      })
      .then((res) => {
        setLoading(false);
        // 请求获取当前tab日期情况下的列表数据数据
        let sou = res.data || [];
        sou.forEach((i) => {
          //根据当前选择的状态展示
          i.isSelected = statusKeys.includes(i.dealStatus);
        });
        // 重置点击状态
        pageDataBack?.forEach((i) => (i.isClicked = false));

        if (
          store.latestSavedPoliceRemark &&
          store.latestSavedPoliceRemark.position
        ) {
          //找到对应的id
          let l = store.latestSavedPoliceRemark.position;
          let findItem = sou.find((i, index) => {
            const { lng, lat, alt } =
              (i.position && JSON.parse(i.position)) || {};
            if (l.lng == lng && l.lat == lat && l.alt == alt) {
              return i;
            }
          });
          // 标记选中， 进行上图
          if (findItem) {
            findItem.isSelected = true;
          }
        }
        setTableData(sou);
        // 重置可刷新状态
        store.policeRemarkRefresh = false;
      })
      .catch(() => {
        setTableData([]);
        setLoading(false);
      });
  };

  // 每次点击警情详情时，警情图片更换
  const redrawClickedPoliceRemark = (item) => {
    if (!item) return;
    //  重复点击
    if (item.isClicked) return;
    // 之前点击的恢复
    let list = pageDataBack.filter((i) => i.isClicked);
    list.forEach((i) => {
      i.isClicked = false;
      i.remarkObj?.remove && i.remarkObj?.remove();
      i.remarkObj = null;
      drawPoliceRemark(i);
    });
    // 新点击的重绘制
    item.isClicked = true;
    item.remarkObj?.remove && item.remarkObj?.remove();
    item.remarkObj = null;
    drawPoliceRemark(item);
  };
  return (
    <div className="box-con" style={style}>
      <Title
        title={<span style={{ fontSize: 24 }}>警情标注</span>}
        after={
          <Popconfirm title="是否确定清除标注？" onOk={handleRemoveRemark}>
            <Button
              type="text"
              className="index-police-remark-clear-select"
              icon={<IconDelete style={{ fontSize: 18 }} />}
            >
              清除标注
            </Button>
          </Popconfirm>
        }
        textLength={4}
      />
      <div className="arrange-wrap index-police-remark">
        <div className="flex-date-tab">
          <div className="flex-date-tab-left">
            <RadioGroup
              type="button"
              name="lang"
              className={"home-radio-group"}
              value={dateValue}
              options={dateList}
              onChange={debounce((val) => {
                setDateValue(val);
                setCalTime([]);
              }, 600)}
              style={{ marginBottom: 2, marginTop: 5 }}
            />
          </div>
          {/*<img className="flex-date-tab-right" src={timeUrl} alt="" />*/}
          <div
            className={
              calTime?.length === 2
                ? "flex-date-tab-right is-selected"
                : "flex-date-tab-right"
            }
          >
            <DatePicker.RangePicker
              className={
                calTime?.length === 2
                  ? "flex-date-calendar is-selected"
                  : "flex-date-calendar"
              }
              style={{ width: "50px" }}
              value={calTime}
              showTime
              format="YYYY-MM-DD"
              onVisibleChange={(val) => {
                if (val) {
                  setTimeout(() => {
                    const dom: any = document.getElementsByClassName(
                      "arco-picker-btn-select-time"
                    );
                    if (dom?.length) {
                      dom[0].style.display = "none";
                    }
                  }, 200);
                }
              }}
              onOk={(dateString, date) => {
                // 设置时间
                setCalTime(dateString);
                // 清除当前三个tab选项
                setDateValue("");
              }}
              disabledDate={(current) =>
                current.isAfter(dayjs()) ||
                current.isBefore(dayjs().subtract(1, "month"))
              }
            />
          </div>
        </div>
        <Form
          layout="vertical"
          form={form}
          style={{
            padding: "0 0 0 10px",
          }}
        >
          <FormItem field="keyword" style={{ marginBottom: 10 }}>
            <InputSearch
              autoComplete="off"
              allowClear
              placeholder="请输入关键字搜索"
              size="large"
              onSearch={debounce((val) => {
                setInputValue(val);
              }, 600)}
              onChange={debounce((val) => {
                setInputValue(val);
              }, 600)}
              value={inputValue}
              defaultValue=""
            />
          </FormItem>
        </Form>
        <div className="choice-list-wrap">
          <div className="choice-list-left">
            <Checkbox
              key={"mapRemark"}
              checked={selectAll}
              onChange={debounce((val) => {
                setSelectAll(val);
                if (val) {
                  setStatusKeys(["0", "1", "2"]);
                } else {
                  setStatusKeys([]);
                }
              }, 300)}
              value={selectAll}
            >
              {/*<span>{selectAll ? "全选" : "取消全选"}</span>*/}
              <span>全选</span>
            </Checkbox>
            <CheckboxGroup
              value={statusKeys}
              onChange={debounce((val) => {
                setListStatusKeys(val);
              }, 300)}
              className="def-checkGroup2"
            >
              {store?.policeRemarkStatusEnum?.map((item) => (
                <Checkbox key={item.value} value={item.value}>
                  <span>{item.label}</span>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
          <span className="count-number">共{tableData.length}条</span>
        </div>
        {calTime?.length > 0 && (
          <div className="display-date-range-wrap">
            <div className="display-date-range">
              查询范围：
              <span>
                {calTime[0]} 至 {calTime[1]}
              </span>
            </div>
          </div>
        )}
        {tableData?.length > 0 && (
          <List
            split={false}
            size="small"
            defaultCurrent={1}
            className="police-remark-list public-scrollbar"
            bordered={false}
            scrollLoading={!loading ? "无更多数据" : "数据加载中..."}
            loading={loading}
            dataSource={tableData}
            virtualListProps={{ height: "100%", threshold: 100 }}
            render={(item, index) => {
              return (
                <List.Item
                  key={index}
                  className={item.id === detailId ? "selected-focused" : ""}
                  onClick={debounce(() => {
                    // setListSelected(!item.isSelected, item);
                  }, 300)}
                  actions={[]}
                >
                  <div className="li-left">
                    <Checkbox
                      value={item.isSelected}
                      key={item.id + "-" + index}
                      checked={item.isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={debounce((val) => {
                        setListSelected(val, item);
                      }, 300)}
                    />
                  </div>
                  <div
                    className="li-right"
                    onClick={debounce((e) => {
                      store.homePoliceRemarkVisible = false;
                      // 手动帮助上图
                      if (!item.isSelected) {
                        setListSelected(true, item);
                      }
                      // 查看详情-样式变化
                      setDetailId(item.id);
                      // 查看详情
                      store.selectedPoliceRemark = {
                        ...item,
                        readOnly: true, //  只读状态
                      };
                      // 飞行地图中心改变
                      let pos = item.position && JSON.parse(item.position);
                      if (pos) {
                        store.viewer.flyTo({
                          lng: pos.lng,
                          lat: pos.lat,
                          alt: 100,
                          pitch: -90,
                          duration: 600,
                        });
                        setTimeout(() => {
                          // 打开详情页面
                          store.homePoliceRemarkVisible = true;
                        }, 600);
                        // 重绘点击的图标
                        redrawClickedPoliceRemark(
                          pageDataBack.find((i) => i.id === item.id)
                        );
                      }
                    }, 300)}
                  >
                    <div className="top">
                      <Tag
                        bordered
                        size="small"
                        style={{
                          backgroundColor: COLORSENUM[`${item.dealStatus}Bg`],
                          borderColor: COLORSENUM[`${item.dealStatus}Bd`],
                          color: COLORSENUM[`${item.dealStatus}C`],
                          margin: "0 5px 0 0 ",
                        }}
                      >
                        {store.policeRemarkStatusNameEnum[item.dealStatus]}
                      </Tag>
                      <Tooltip content={item.name}>
                        <p className="text-overflow">
                          <KeywordHighlighter
                            text={item.name}
                            keyword={inputValue}
                          />
                        </p>
                      </Tooltip>
                    </div>
                    <div className="bottom">
                      <img src={locIcon} alt="" />
                      {/*<Tooltip content={item.address}>*/}
                      {/*</Tooltip>*/}
                      <p className="location text-overflow">
                        {item.address || "-"}
                      </p>
                    </div>
                    <div className="bottom">
                      <img src={timeIcon} alt="" />
                      <p className="time">{item.createdTime}</p>
                      <div
                        className="edit-delete-wrap"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Tooltip content="编辑">
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            src={editWebp}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="确定删除该警情标注？"
                          onOk={debounce(() => {
                            handleDeletePoliceRemark(item);
                          }, 600)}
                        >
                          <Tooltip content="删除">
                            <img src={deleteWebp} />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
        {!tableData?.length && (
          <div style={{ height: "100%" }}>
            <Empty
              className={"no-data-jingli"}
              imgSrc={noDataUrl}
              description="暂无数据"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ObserverPoliceRemark = observer(PoliceRemark);
export default ObserverPoliceRemark;
