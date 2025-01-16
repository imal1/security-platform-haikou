import styles from "./index.module.less";
import React, { useState, useMemo, useEffect } from "react";
import classNames from "classnames";
import Container from "./Container";
import { useLocation } from 'react-router-dom';
import JX from "@/assets/img/place-manage/icons/JX.png";
import CIRCLE from "@/assets/img/place-manage/icons/CIRCLE.png";
import DBX from "@/assets/img/place-manage/icons/DBX.png";
import { geometryData } from "../../../../../mockData/index";
import { getVenueId } from "../../../../../kit/util";
const venueId = getVenueId();


interface FeatureRegionProps {
  store: any;
  onClose: () => void;
}

interface FeatureRegionColumn {
  key: string;
  title: string;
  icon: string;
  GeometryType: string;
}

const columns: FeatureRegionColumn[] = [
  {
    key: "JX",
    title: "矩形",
    icon: JX,
    GeometryType: "RECTANGLE",
  },
  {
    key: "CIRCLE",
    title: "圆形",
    icon: CIRCLE,
    GeometryType: "CIRCLE",
  },
  {
    key: "DBX",
    title: "多边形",
    icon: DBX,
    GeometryType: "POLYGON",
  },
];

const FeatureRegion: React.FC<FeatureRegionProps> = ({ store, onClose }) => {
  const [selected, setSelected] = useState<FeatureRegionColumn>();
  const { viewer, selectedPlan, selectedFeature } = store;
  let geometry = {};
  let geometryData = {}
  const location = useLocation();

  const handleColumnClick = (column: FeatureRegionColumn) => {
    setSelected(column);
    const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
    console.log(store.isPlanSelect, 'isPla333nSelectisPlanSelect')
    geometryUtil.draw({
      type: window["KMapUE"].GeometryType[column.GeometryType],
      geometryStyle: { fillColor: '#FF6806B3' },
      // type: 444,
      onComplete: (res) => {
        geometry = res
        geometryData = res.getData();
        const acce = {
          type: location.pathname === '/site_manage' ? 'inherent' : "temporary",
          venueId,
          planId: location.pathname === '/site_manage' ? 'inherent' : selectedPlan?.id,
          parentId: -1,
          featureStyle: '', // 默认
          featureType: selectedFeature?.featureType,
          featureCode: selectedFeature?.featureCode,
          featureName: selectedFeature?.featureName,
          geometry: JSON.stringify(geometryData),

        };
        store.changeState({
          editFeature: null,
          geometryObj: geometry,
          addFeatureStorage: acce,
          isAttributes: true,
          selectedFeature: null

        });
      },
    });
  };

  return (
    <Container
      className={styles["feature-region"]}
      title="区域绘制类型"
      onClose={onClose}
    >
      <div className="feature-columns">
        {columns.map((v) => (
          <div
            className="column-item"
            key={v.key}
            onClick={() => handleColumnClick(v)}
          >
            <div
              className={classNames("column-item-icon", {
                active: selected?.key === v.key,
              })}
            >
              <img src={v.icon} width={40} />
            </div>
            <div className="column-item-title">{v.title}</div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FeatureRegion;
