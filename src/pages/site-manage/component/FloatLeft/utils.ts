
export const childrenMergeDevices = (data = []) => {
  const target = data?.map((v) => {
    if (v.devices) {
      const children = childrenMergeDevices(v.children);
      const devices = v.devices?.map((d) => ({
        ...d,
        featureType: d.deviceType,
        featureName: d.deviceName,
      }));
      return { ...v, children: children.concat(devices) };
    }
    return v;
  });

  return target;
};
