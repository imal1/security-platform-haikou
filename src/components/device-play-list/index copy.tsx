//设备播放列表
import React, { useState, useEffect, memo } from "react";
import { Grid } from "@arco-design/web-react";
import { IconClose } from "@arco-design/web-react/icon";
import { KMediaUniContent } from "@/components";
import classNames from "classnames";
import styles from "./index.module.less";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { deep } from "@/kit";
const { Row, Col } = Grid;

let currentIndex = 0;
interface DevicePalyListPorps {
  className?: string;
  style?: React.CSSProperties;
  onChange?: (val) => void;
  count?: number;
  current?: any;
}
const DevicePalyList = (props: DevicePalyListPorps) => {
  const { className, style, onChange, count = 4 } = props;
  const [data, setData] = useState(Array(count).fill({}));
  const gutter = count == 4 ? 14 : 18;
  useEffect(() => {
    if (props.current) {
      addVideo(props.current);
    }
  }, [props.current]);
  const addVideo = (current) => {
    const list = deep(data);
    const cIndex = list.findIndex((item) => item.gbid == current.gbid);
    if (cIndex > -1) return;
    const index = list.findIndex((item) => !item.gbid);
    if (index > -1) {
      list[index] = current;
      currentIndex = 0;
    } else {
      list[currentIndex] = current;
      if (currentIndex + 1 >= count) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
    }
    setData(list);
  };
  const onClose = (index) => {
    const list = deep(data);
    list[index] = "";
    setData(list);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setData(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="device-play-list"
        direction="horizontal"
        or="vertical"
      >
        {(provided) => (
          <Row
            className={classNames(styles["device-paly-list-wrap"], className)}
            style={style}
            gutter={[gutter, gutter]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {data.map((item, index) => (
              <Draggable
                key={index}
                draggableId={`item-${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <Col
                    span={count == 4 ? 12 : 8}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      ...(snapshot.isDragging
                        ? { boxShadow: "0px 0px 10px 2px #0c82d2 inset" }
                        : { cursor: "move" }),
                      height: count == 4 ? "50%" : "33.333%",
                    }}
                    // style={{ height: count == 4 ? "50%" : "33.333%" }}
                  >
                    <div className="device-paly-li">
                      {item.gbid && (
                        <>
                          <div className="device-header text-overflow">
                            {item.deviceName || item.name || item.title}
                          </div>
                          <div
                            className="device-close"
                            onClick={() => {
                              onClose(index);
                            }}
                          >
                            <IconClose />
                            <div className="box-border"></div>
                          </div>
                          <KMediaUniContent
                            devId={item.gbid}
                            id={`videoRetrieval-${item.gbid}`}
                          />
                        </>
                      )}
                    </div>
                  </Col>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Row>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default memo(DevicePalyList);
