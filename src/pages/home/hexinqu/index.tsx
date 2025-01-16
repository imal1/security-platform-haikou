import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import store from "../store";
import LeftBox from "../component/left-box";
import RightBox from "../component/right-box";
import { getPlanId, getVenueId } from "../../../kit/util";
import { coreDetail, frameDetail } from "../store/webapi";
import LeftSide from "./left-side"
import RightSide from "./right-side"

const HeXinQu = () => {

  const { viewer } = store
  const venueId = getVenueId();

  const getCoreDetail = async () => {
    const planId = await getPlanId();
    frameDetail(venueId, planId)

    const res = await coreDetail(venueId, planId)
    res?.forEach(v => {
      if (!v.geometry) return
      const geometry = JSON.parse(v.geometry).geometry
      const featureStyle = JSON.parse(v.featureStyle);
      const params = {
        scale: featureStyle.scale,
        brightness: featureStyle.brightness,
        color: featureStyle.fillColor,
      };

      console.log(JSON.parse(v.featureStyle).type, 'JSON.parse(v.featureStyle).type')
      const closure = new window["KMapUE"].Closure({
        viewer,
        options: {
          type: '2',
          geometry,
          ...params,
          onComplete: (res) => {
            // do sth.
          },
          onError: (err) => {
            // do sth.
          }
        }
      });
    })
    frameDetail(venueId, planId).then(
      res => {

      }
    )
  }

  useEffect(() => {
    getCoreDetail()
    return () => {
      if (viewer) {
        const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
        geometryUtil.removeAll();
      }
    }
  }, [])


  return (
    <div className="souye-wrap">
      <LeftBox>
        <LeftSide />
      </LeftBox>
      <RightBox>
        <RightSide />
      </RightBox>
    </div>
  );
};
const ObserverHeXinQu = observer(HeXinQu);
export default ObserverHeXinQu;
