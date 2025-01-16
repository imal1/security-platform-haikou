import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { observer } from "mobx-react";
import { debounce } from "lodash";
import AppStore from "@/store";
import { Menu } from "@arco-design/web-react";
import { microAppHistory, tryGet } from "@/kit";
import globalState from "@/globalState";
import menuArrow from "@/assets/img/nav/menu_icon_arrow.svg";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const routeImgObj = {};

const CustomMenu = (props) => {
  const { navigationList = [], parentPath } = props;
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    AppStore.historyChange(location.pathname);
    setSelectedKeys([location.pathname]);
    if (parentPath) {
      setSelectedKeys([parentPath]);
    }
  }, [location.pathname, parentPath]);
  const init = async () => {};
  const { pathname } = AppStore;
  const generateMenu = (data) => {
    return data.map((item) => {
      if (
        item.navigationType === "menu" &&
        item.children &&
        item.children.length > 0
      ) {
        return (
          <SubMenu
            key={item.navigationCode}
            title={
              <div className="submenu-wrap">
                {routeImgObj[item.navigationCode] && (
                  <img src={routeImgObj[item.navigationCode]} />
                )}
                <label>{item.navigationName}</label>
              </div>
            }
          >
            {generateMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <MenuItem key={item.linkUrl}>
            <div className="submenu-wrap">
              {routeImgObj[item.navigationCode] && (
                <img src={routeImgObj[item.navigationCode]} />
              )}
              <label>{item.navigationName}</label>
            </div>
          </MenuItem>
        );
      }
    });
  };
  const onClickMenuItem = (key, event, keyPath) => {
    // console.log(key, event, keyPath, "menuli");
    microAppHistory.push(key);
  };
  return (
    <div className="header-menu-wrap">
      <Menu
        mode="horizontal"
        className="home-menu-wrap menu-left"
        selectedKeys={selectedKeys}
        ellipsis={false}
        triggerProps={{
          className: "nav-menu-popover",
          showArrow: false,
          duration: { exit: 100 },
          getPopupContainer: () => document.querySelector(".header-menu-wrap"),
        }}
        icons={{
          horizontalArrowDown: (
            <img
              src={menuArrow}
              className="arco-icon-down"
              style={{ marginTop: 10 }}
            />
          ),
        }}
        onClickMenuItem={debounce(onClickMenuItem, 300)}
      >
        {generateMenu(navigationList.slice(0, 4) || [])}
      </Menu>
      <Menu
        mode="horizontal"
        className="home-menu-wrap menu-right"
        selectedKeys={selectedKeys}
        ellipsis={false}
        triggerProps={{
          className: "nav-menu-popover",
          showArrow: false,
          duration: { exit: 100 },
          getPopupContainer: () => document.querySelector(".header-menu-wrap"),
        }}
        icons={{
          horizontalArrowDown: (
            <img
              src={menuArrow}
              className="arco-icon-down"
              style={{ marginTop: 10 }}
            />
          ),
        }}
        onClickMenuItem={debounce(onClickMenuItem, 300)}
      >
        {generateMenu(navigationList.slice(4) || [])}
      </Menu>
    </div>
  );
};

export default observer(CustomMenu);
