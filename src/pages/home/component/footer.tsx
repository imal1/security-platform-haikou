import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react";
import store from "../store";
import { Button } from "@arco-design/web-react";
import homeUrl from "@/assets/img/home/nav/home.png";
import homeHoverUrl from "@/assets/img/home/nav/home-hover.png";
import fkqUrl from "@/assets/img/home/nav/fkq.png";
import fkqHoverUrl from "@/assets/img/home/nav/fkq-hover.png";
import zrqUrl from "@/assets/img/home/nav/zrq.png";
import zrqHoverUrl from "@/assets/img/home/nav/zrq-hover.png";
import ajmUrl from "@/assets/img/home/nav/ajm.png";
import ajmHoverUrl from "@/assets/img/home/nav/ajm-hover.png";
import xclxUrl from "@/assets/img/home/nav/xclx.png";
import xclxHoverUrl from "@/assets/img/home/nav/xclx-hover.png";
import navArrowUrl from "@/assets/img/home/nav-arrow.png";
import navArrowHoverUrl from "@/assets/img/home/nav-arrow-hover.png";
import navHoverUrl from "@/assets/img/home/nav/nav-hover.png";
import navUrl from "@/assets/img/home/nav/nav.png";
import fkffUrl from "@/assets/img/home/nav/fkff.png";
import fkffHoverUrl from "@/assets/img/home/nav/fkff-hover.png";
import jdbqUrl from "@/assets/img/home/nav/jdbq.png";
import jdbqHoverUrl from "@/assets/img/home/nav/jdbq-hover.png";
import footShowUrl from "@/assets/img/home/foot-show.png";
import { Message } from "@arco-design/web-react";
import appStore from "@/store";
import classNames from "classnames";
import { debounce } from "lodash";

const xclxList = [{ label: "领导参展路线", value: "ldczlx" }];
const Footer = () => {
  const [headerNav, setHeaderNav] = useState([]);
  const [navList, setNavList] = useState([
    { label: "首页", value: "sy", icon: homeUrl, iconHover: homeHoverUrl },
    {
      label: "防控区",
      value: "CONTROL_AREA",
      icon: fkqUrl,
      iconHover: fkqHoverUrl,
    },
    {
      label: "责任区",
      value: "RESPONSIBILITY_AREA",
      icon: zrqUrl,
      iconHover: zrqHoverUrl,
    },
    {
      label: "检查站",
      value: "CHECKPOINT",
      icon: ajmUrl,
      iconHover: ajmHoverUrl,
    },
    {
      label: "机动备勤",
      value: "MOBILE_STANDBY",
      icon: jdbqUrl,
      iconHover: jdbqHoverUrl,
    },
    {
      label: "反恐防范",
      value: "ANTI_TERRORISM_PREVENTION",
      icon: fkffUrl,
      iconHover: fkffHoverUrl,
    },
    {
      label: "安保路线",
      value: "VEHICLE_ROUTE",
      icon: xclxUrl,
      iconHover: xclxHoverUrl,
    },
  ]);
  const [value, setValue] = useState("sy");
  const [childValue, setChildValue] = useState("");
  const [navShow, setNavShow] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const [navIndex, setnavIndex] = useState(1);
  const headerNavRef = useRef(null);

  useEffect(() => {
    store.tab = value;
    store.track = false;
    // store.setDevicePerspective(true);
  }, [value]);
  useEffect(() => {
    if (store.planId != "planId") {
      store.getChildMenu(value);
    }
  }, [value, store.planId]);
  useEffect(() => {
    store.track = false;
    store.childTab = childValue;
    store.threePageData = null;
    store.removeAllFeature();
    if (childValue) {
      store.getThreePage();
    } else {
      store.resetSplitBuildGroup();
      setTimeout(() => {
        store.changeState({
          currentBuild: [],
          currentKey: "1",
          buildList2: [],
          buildList1: [],
        });
      }, 600);
    }
  }, [childValue]);

  useEffect(() => {
    setTimeout(() => {
      const container = headerNavRef.current;
      if (container) {
        setShowArrows(container.scrollWidth > container.clientWidth);
      }
    }, 400);
  }, [headerNav, value]);

  const scrollToItem = (direction) => {
    const container = headerNavRef.current;
    if (!container) return;

    const scrollAmount = 780; // Adjust this value as needed
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`home-footer-wrap ${navShow ? "" : "nav-hide"}`}
      style={{ display: store.navPanelVisible ? "block" : "none" }}
    >
      <div className={`home-nav-wrap`}>
        <div className="nav-list">
          {store.childMenuList?.length > 0 && (
            <div
              className={classNames("header-nav-wrap")}
              style={{
                left: store.childMenuList?.length > 4 ? "50%" : "50%",
              }}
            >
              {showArrows && (
                <Button
                  onClick={() => scrollToItem("left")}
                  type="text"
                  className={"nav-arrow-btn arrow--btn-left"}
                >
                  <img src={navArrowUrl} className="arrow-pic" />
                  {/* <img src={navArrowHoverUrl} className="arrow-pic-hover" /> */}
                </Button>
              )}
              <div
                className={classNames(
                  "header-nav",
                  showArrows && "header-nav-scrooll"
                )}
                ref={headerNavRef}
              >
                {store.childMenuList.map((item) => (
                  <div
                    className={classNames(
                      "header-nav-li",
                      childValue === item.value && "active"
                    )}
                    key={item.value}
                    onClick={debounce(() => {
                      store.setDeviceVisible(false);
                      store.callVisible = false;
                      store.selectMemberVisible = false;
                      store.trackType = "";
                      store.trackVisible = false;
                      store.historyVisible = false;
                      setChildValue(item.value);
                    }, 600)}
                  >
                    <label htmlFor="">{item.label}</label>
                  </div>
                ))}
              </div>
              {showArrows && (
                <Button
                  onClick={() => scrollToItem("right")}
                  type="text"
                  className={"nav-arrow-btn"}
                >
                  <img src={navArrowUrl} className="arrow-pic" />
                  {/* <img src={navArrowHoverUrl} className="arrow-pic-hover" /> */}
                </Button>
              )}
            </div>
          )}
          {navList.map((item, index) => (
            <div
              className={`nav-li ${value === item.value ? "active" : ""}`}
              key={item.value}
              onClick={debounce(() => {
                store.verifyFrame(() => {
                  setValue(item.value);
                  setChildValue("");
                  store.setDeviceVisible(false);
                  store.callVisible = false;
                  store.selectMemberVisible = false;
                  store.trackType = "";
                  store.historyVisible = false;
                  store.trackVisible = false;
                  if (index) {
                    setnavIndex(index + 1);
                  }
                  if (item.value == "sy") {
                    store.getWorkGroup();
                  }
                  // 底部切换的时候 警情详情页隐藏
                  if (store.selectedPoliceRemark?.readOnly) {
                    store.homePoliceRemarkVisible = false;
                  }
                }, "footer");
              }, 600)}
            >
              <img src={item.icon} className="nav-icon pic" alt="" />
              <img src={navUrl} className="pic" alt="" />
              <img src={navHoverUrl} className="pic-hover" alt="" />
              <img src={item.iconHover} className="nav-icon pic-hover" alt="" />
              <div className="name">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <img
        src={footShowUrl}
        alt=""
        className="footer-arrow"
        onClick={() => {
          setNavShow(!navShow);
          store.navPanelCollapse = navShow;
        }}
      />
    </div>
  );
};
export default observer(Footer);
