/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.99
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
define(["exports","./Matrix3-65932166","./defaultValue-0ab18f7d","./Transforms-7e6ffc4e","./Math-422cd179","./Matrix2-82a3f96e"],(function(t,n,a,e,o,r){"use strict";const s=Math.cos,i=Math.sin,c=Math.sqrt,g={computePosition:function(t,n,e,o,r,g,u){const h=n.radiiSquared,l=t.nwCorner,C=t.boundingRectangle;let S=l.latitude-t.granYCos*o+r*t.granXSin;const d=s(S),M=i(S),w=h.z*M;let f=l.longitude+o*t.granYSin+r*t.granXCos;const X=d*s(f),Y=d*i(f),m=h.x*X,p=h.y*Y,x=c(m*X+p*Y+w*M);if(g.x=m/x,g.y=p/x,g.z=w/x,e){const n=t.stNwCorner;a.defined(n)?(S=n.latitude-t.stGranYCos*o+r*t.stGranXSin,f=n.longitude+o*t.stGranYSin+r*t.stGranXCos,u.x=(f-t.stWest)*t.lonScalar,u.y=(S-t.stSouth)*t.latScalar):(u.x=(f-C.west)*t.lonScalar,u.y=(S-C.south)*t.latScalar)}}},u=new r.Matrix2;let h=new n.Cartesian3;const l=new n.Cartographic;let C=new n.Cartesian3;const S=new e.GeographicProjection;function d(t,a,e,o,s,i,c){const g=Math.cos(a),l=o*g,d=e*g,M=Math.sin(a),w=o*M,f=e*M;h=S.project(t,h),h=n.Cartesian3.subtract(h,C,h);const X=r.Matrix2.fromRotation(a,u);h=r.Matrix2.multiplyByVector(X,h,h),h=n.Cartesian3.add(h,C,h),i-=1,c-=1;const Y=(t=S.unproject(h,t)).latitude,m=Y+i*f,p=Y-l*c,x=Y-l*c+i*f,G=Math.max(Y,m,p,x),R=Math.min(Y,m,p,x),y=t.longitude,O=y+i*d,P=y+c*w,W=y+c*w+i*d;return{north:G,south:R,east:Math.max(y,O,P,W),west:Math.min(y,O,P,W),granYCos:l,granYSin:w,granXCos:d,granXSin:f,nwCorner:t}}g.computeOptions=function(t,n,a,e,s,i,c){let g,u=t.east,h=t.west,M=t.north,w=t.south,f=!1,X=!1;M===o.CesiumMath.PI_OVER_TWO&&(f=!0),w===-o.CesiumMath.PI_OVER_TWO&&(X=!0);const Y=M-w;g=h>u?o.CesiumMath.TWO_PI-h+u:u-h;const m=Math.ceil(g/n)+1,p=Math.ceil(Y/n)+1,x=g/(m-1),G=Y/(p-1),R=r.Rectangle.northwest(t,i),y=r.Rectangle.center(t,l);0===a&&0===e||(y.longitude<R.longitude&&(y.longitude+=o.CesiumMath.TWO_PI),C=S.project(y,C));const O=G,P=x,W=r.Rectangle.clone(t,s),_={granYCos:O,granYSin:0,granXCos:P,granXSin:0,nwCorner:R,boundingRectangle:W,width:m,height:p,northCap:f,southCap:X};if(0!==a){const t=d(R,a,x,G,0,m,p);M=t.north,w=t.south,u=t.east,h=t.west,_.granYCos=t.granYCos,_.granYSin=t.granYSin,_.granXCos=t.granXCos,_.granXSin=t.granXSin,W.north=M,W.south=w,W.east=u,W.west=h}if(0!==e){a-=e;const t=r.Rectangle.northwest(W,c),n=d(t,a,x,G,0,m,p);_.stGranYCos=n.granYCos,_.stGranXCos=n.granXCos,_.stGranYSin=n.granYSin,_.stGranXSin=n.granXSin,_.stNwCorner=t,_.stWest=n.west,_.stSouth=n.south}return _};var M=g;t.RectangleGeometryLibrary=M}));
