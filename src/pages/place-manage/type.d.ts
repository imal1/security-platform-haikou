interface PlanInfo {
  civilIllustrate: string;
  createdBy: string;
  createdTime: string;
  enable: number;
  eventId: string;
  id: number;
  physicalIllustrate: string;
  planIllustrate: string;
  planName: string;
  status: string;
  technicalIllustrate: string;
  updatedBy: string;
  updatedTime: string;
  venueId: string;
  version: number;
}

interface StatisticsVO {
  count: number;
  featureName: string;
  featureCode: string;
}

interface FeatureTreeProps {
  id: number;
  parentId: number;
  pid: number;
  planId: number;
  children: FeatureTreeProps[];
  cid: number;
  featureCode: string;
  featureName: string;
  featureType: string;
  geometry: string;
}

interface FeatureProps {
  featureCode: string;
  featureName: string;
  featureType: string;
  id: number;
  ueStyle: string;
  filePath: string;
}
