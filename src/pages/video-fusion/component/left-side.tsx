import { observer } from "mobx-react";
import Title from "../../home/component/title";
import { Button, Checkbox } from "@arco-design/web-react";
import store from "../store";

const options = [
  {
    label: "会展中心会标背后山坡",
    value: "0",
  },
  {
    label: "4号厅外侧",
    value: "1",
  },
  {
    label: "会议中心正门西",
    value: "2",
  },
  {
    label: "D区15号馆外侧楼梯",
    value: "3",
  },
  {
    label: "11号展厅中部通道",
    value: "4",
  },
  {
    label: "6号展厅西",
    value: "5",
  },
];

const LeftSide = () => {
  return (
    <>
      <Title title="漫游路线" style={{ marginTop: 0, marginBottom: 4 }} />
      {options.map((item, key) => {
        return (
          <div style={{ position: "relative" }}>
            <div className={"video-item"} >
              {item.label}
            </div>
            {store.isWandering && key === store.wanderOrder && (
              <span
                style={{
                  position: "absolute",
                  right: 20,
                  top: 10,
                  fontSize: 14,
                  color: "#4DBF62",
                }}
              >
                正在漫游
              </span>
            )}
          </div>
        );
      })}
      <Button
        disabled={store.isWandering}
        className={"video-route-btn"}
        onClick={() => {
          store.wanderRoute();
        }}
      >
        {!store.isWandering ? "开始漫游" : "结束漫游"}
      </Button>
    </>
  );
};

export default observer(LeftSide);
