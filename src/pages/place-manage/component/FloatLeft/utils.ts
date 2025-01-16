import { TreeDataType } from "@arco-design/web-react/es/Tree/interface";
import { getTemporaryFeatureDetail } from "../../store/webapi";
import { getFeatureTreeData, objectArrUnique } from "@/kit";

export function handleDeviceTree(data, type = "inherent") {
  data.map((node, index) => {
    node.type = type;
    if (node.children?.length) {
      node.id = `${node.id}-${type}`;
      handleDeviceTree(node.children, type);
    } else {
      if (node.devices) {
        node.children = [
          ...objectArrUnique(node.devices, "gbid").map((item) => {
            return {
              ...item,
              id: `${item.gbid}-${node.id}-${type}`,
              featureName: item.deviceName,
              isLeaf: true,
            };
          }),
        ];
      }
    }
  });
}
export function childrenMergeDevices(data = [], type = "inherent") {
  data = getFeatureTreeData(data);
  handleDeviceTree(data, type);
  return data;
}

export async function featureRedraw(dataRef: TreeDataType) {}

export async function geometryRedraw(dataRef: TreeDataType, checked) {
  const { viewer, id, featureType, featureCode, featureName, geometry } =
    dataRef;
  const detailData = await getTemporaryFeatureDetail(id);
  const {
    featureStyle: featureStyleString,
    visualAngle,
    switchAnimation,
    showModel,
    position,
    iconPosition,
  } = detailData || {};
  const redrawData = JSON.parse(geometry || "{}");

  const featureStyle = JSON.parse(featureStyleString || "null");
  console.log("获取回显的几何数据的详细信息", detailData);
  let geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });

  // 区域上图和隐藏
  if (featureType === "SITE_DRAWING" && checked) {
    let geometryStyle: any = {};
    featureStyle &&
      featureStyle.fillColor &&
      (geometryStyle.fillColor = featureStyle.fillColor);
    featureStyle &&
      featureStyle.outlineColor &&
      (geometryStyle.outlineColor = featureStyle.outlineColor);
    featureStyle &&
      featureStyle.outlineWidth &&
      (geometryStyle.outlineWidth = featureStyle.outlineWidth);
    redrawData.Style = geometryStyle;
    if (featureCode === "WALL") {
      let closureStyle: any = {};
      closureStyle.type = "2";
      featureStyle &&
        featureStyle.scale &&
        (closureStyle.scale = featureStyle.scale);
      featureStyle &&
        featureStyle.brightness &&
        (closureStyle.brightness = featureStyle.brightness);
      featureStyle &&
        featureStyle.fillColor &&
        (closureStyle.fillColor = featureStyle.fillColor);
      redrawData.closureStyle = closureStyle;
    }
    if (featureCode === "ROUTE") {
      let routeStyle: any = {};
      featureStyle &&
        featureStyle.routeColor &&
        (routeStyle.routeColor = featureStyle.routeColor);
      featureStyle &&
        featureStyle.routeWidth &&
        (routeStyle.routeWidth = featureStyle.routeWidth);
      featureStyle &&
        featureStyle.opacity &&
        (routeStyle.routeOpacity = featureStyle.opacity / 100);
      redrawData.routeStyle = routeStyle;
    }

    return new Promise((resolve, reject) => {
      geometryUtil.redraw({
        data: [redrawData],
        onComplete: (res) => {
          // if (switchAnimation && visualAngle) {
          //   const duration = JSON.parse(switchAnimation).animationTime;
          //   const rotation = JSON.parse(visualAngle).rotation;
          //   viewer.flyTo({ ...rotation, duration });
          // }
          resolve(res.get(redrawData.Id));
        },
        onError: (res) => {
          reject(res);
        },
      });
    });
  } else if (!checked) {
    if (featureCode === "WALL") {
      console.log("redrawData", redrawData);
      geometryUtil.remove({
        ids: [redrawData?.Id],
        wallIds: [redrawData?.wallId],
      });
    } else {
      geometryUtil.remove({ ids: [redrawData?.Id] });
    }
  }

  // WuFang 上图
  if (featureType === "PHYSICAL_DEFENSE" && checked) {
    const element = new window["KMapUE"].SecurityElement({
      viewer,
      options: {
        id: [redrawData],
        featureStyle,
        height: JSON.parse(iconPosition).height,
        type: showModel ? "model" : "icon",
        elementType: featureCode,
        position:
          showModel &&
          ["KNIFE_REST", "ANTI_COLLISION", "GUARDRAIL"].includes(featureCode)
            ? JSON.parse(position)
            : JSON.parse(iconPosition).position,
      },
    });

    // if (switchAnimation && visualAngle) {
    //   const duration = JSON.parse(switchAnimation).animationTime;
    //   const rotation = JSON.parse(visualAngle).rotation;
    //   viewer.flyTo({ ...rotation, duration });
    // }

    return element;
  } else if (featureType === "PHYSICAL_DEFENSE" && !checked) {
    const element = new window["KMapUE"].SecurityElementBatch({
      viewer,
    });
    // element.removeById(redrawData);
  }

  // 设施 上图
  if (featureType === "VENUE_FACILITY") {
    if (featureCode === "TEXT") {
      let fontStyle: any = {};
      featureStyle &&
        featureStyle.fontColor &&
        (fontStyle.fontColor = featureStyle.fontColor);
      featureStyle &&
        featureStyle.fontSize &&
        (fontStyle.fontSize = featureStyle.fontSize);
      featureStyle &&
        featureStyle.backgroundColor &&
        (fontStyle.backgroundColor = featureStyle.backgroundColor);
      const TEXT = new window["KMapUE"].Label({
        viewer,
        options: {
          text: featureName,
          position: JSON.parse(iconPosition).position,
          style: fontStyle,
        },
      });
      return TEXT;
    } else {
      const element = new window["KMapUE"].SecurityElement({
        viewer,
        options: {
          id: redrawData,
          height: JSON.parse(iconPosition).height,
          type: "icon",
          elementType: featureCode,
          position: showModel
            ? JSON.parse(position)
            : JSON.parse(iconPosition).position,
        },
      });

      // if (switchAnimation && visualAngle) {
      //   const duration = JSON.parse(switchAnimation).animationTime;
      //   const rotation = JSON.parse(visualAngle).rotation;
      //   viewer.flyTo({ ...rotation, duration });
      // }

      return element;
    }
  }
}

// export function featureRemove(dataRef: TreeDataType) {
//   const { viewer, id, featureType, featureCode, featureName, geometry } =
//     dataRef;

//   if (featureCode === "WALL") {
//     geometryUtil.remove({
//       ids: [redrawData?.Id],
//       wallIds: [redrawData?.wallId],
//     });
//   } else {
//     geometryUtil.remove({ ids: [redrawData?.Id] });
//   }

// }
