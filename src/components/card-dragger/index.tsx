import React, { useState } from "react";
import styles from "./index.module.less";

const CardDragger = (props) => {
  const [data, setData] = useState(props.data);
  const [dragged, setDragged] = useState(null);
  const [target, setTarget] = useState(null);

  const handleData = () => {
    if (dragged !== target) {
      const newData = [...data];
      newData.splice(target, 0, newData.splice(dragged, 1)[0]);
      setData(newData);
      setDragged(target);
    }
  };

  const dragStart = (e) => {
    setDragged(parseInt(e.target.dataset.id));
  };

  const drop = (e) => {
    e.preventDefault();
    setDragged(null);
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
    if (e.target.tagName !== "LI") {
      return;
    }
    setTarget(parseInt(e.target.dataset.id));
    e.target.style.opacity = "0.2";
    e.target.style.transform = "scale(1.1)";
    handleData();
  };

  const listItems = data.map((item, index) => {
    return (
      <li
        data-id={index}
        key={index}
        style={{ background: item.bgColor }}
        draggable="true"
        onDragEnter={dragEnter}
        onDrop={drop}
        onDragOver={dragOver}
        onDragStart={dragStart}
        data-item={JSON.stringify(item)}
      >
        {item.index}
      </li>
    );
  });

  return <ul className={styles["card-dragger-wrap"]}>{listItems}</ul>;
};

export default CardDragger;
