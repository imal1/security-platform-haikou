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
define(["exports","./Matrix3-65932166","./Math-422cd179","./Transforms-55fddd23"],(function(t,a,e,n){"use strict";const i={},r=new a.Cartesian3,s=new a.Cartesian3,o=new n.Quaternion,l=new a.Matrix3;function c(t,e,i,c,C,y,u,m,h,x){const M=t+e;a.Cartesian3.multiplyByScalar(c,Math.cos(M),r),a.Cartesian3.multiplyByScalar(i,Math.sin(M),s),a.Cartesian3.add(r,s,r);let d=Math.cos(t);d*=d;let f=Math.sin(t);f*=f;const z=y/Math.sqrt(u*d+C*f)/m;return n.Quaternion.fromAxisAngle(r,z,o),a.Matrix3.fromQuaternion(o,l),a.Matrix3.multiplyByVector(l,h,x),a.Cartesian3.normalize(x,x),a.Cartesian3.multiplyByScalar(x,m,x),x}const C=new a.Cartesian3,y=new a.Cartesian3,u=new a.Cartesian3,m=new a.Cartesian3;i.raisePositionsToHeight=function(t,e,n){const i=e.ellipsoid,r=e.height,s=e.extrudedHeight,o=n?t.length/3*2:t.length/3,l=new Float64Array(3*o),c=t.length,h=n?c:0;for(let e=0;e<c;e+=3){const o=e+1,c=e+2,x=a.Cartesian3.fromArray(t,e,C);i.scaleToGeodeticSurface(x,x);const M=a.Cartesian3.clone(x,y),d=i.geodeticSurfaceNormal(x,m),f=a.Cartesian3.multiplyByScalar(d,r,u);a.Cartesian3.add(x,f,x),n&&(a.Cartesian3.multiplyByScalar(d,s,f),a.Cartesian3.add(M,f,M),l[e+h]=M.x,l[o+h]=M.y,l[c+h]=M.z),l[e]=x.x,l[o]=x.y,l[c]=x.z}return l};const h=new a.Cartesian3,x=new a.Cartesian3,M=new a.Cartesian3;i.computeEllipsePositions=function(t,n,i){const r=t.semiMinorAxis,s=t.semiMajorAxis,o=t.rotation,l=t.center,m=8*t.granularity,d=r*r,f=s*s,z=s*r,_=a.Cartesian3.magnitude(l),O=a.Cartesian3.normalize(l,h);let p=a.Cartesian3.cross(a.Cartesian3.UNIT_Z,l,x);p=a.Cartesian3.normalize(p,p);const w=a.Cartesian3.cross(O,p,M);let P=1+Math.ceil(e.CesiumMath.PI_OVER_TWO/m);const T=e.CesiumMath.PI_OVER_TWO/(P-1);let I=e.CesiumMath.PI_OVER_TWO-P*T;I<0&&(P-=Math.ceil(Math.abs(I)/T));const g=n?new Array(3*(P*(P+2)*2)):void 0;let E=0,V=C,A=y;const R=4*P*3;let W=R-1,S=0;const B=i?new Array(R):void 0;let v,Q,b,G,H;for(I=e.CesiumMath.PI_OVER_TWO,V=c(I,o,w,p,d,z,f,_,O,V),n&&(g[E++]=V.x,g[E++]=V.y,g[E++]=V.z),i&&(B[W--]=V.z,B[W--]=V.y,B[W--]=V.x),I=e.CesiumMath.PI_OVER_TWO-T,v=1;v<P+1;++v){if(V=c(I,o,w,p,d,z,f,_,O,V),A=c(Math.PI-I,o,w,p,d,z,f,_,O,A),n){for(g[E++]=V.x,g[E++]=V.y,g[E++]=V.z,b=2*v+2,Q=1;Q<b-1;++Q)G=Q/(b-1),H=a.Cartesian3.lerp(V,A,G,u),g[E++]=H.x,g[E++]=H.y,g[E++]=H.z;g[E++]=A.x,g[E++]=A.y,g[E++]=A.z}i&&(B[W--]=V.z,B[W--]=V.y,B[W--]=V.x,B[S++]=A.x,B[S++]=A.y,B[S++]=A.z),I=e.CesiumMath.PI_OVER_TWO-(v+1)*T}for(v=P;v>1;--v){if(I=e.CesiumMath.PI_OVER_TWO-(v-1)*T,V=c(-I,o,w,p,d,z,f,_,O,V),A=c(I+Math.PI,o,w,p,d,z,f,_,O,A),n){for(g[E++]=V.x,g[E++]=V.y,g[E++]=V.z,b=2*(v-1)+2,Q=1;Q<b-1;++Q)G=Q/(b-1),H=a.Cartesian3.lerp(V,A,G,u),g[E++]=H.x,g[E++]=H.y,g[E++]=H.z;g[E++]=A.x,g[E++]=A.y,g[E++]=A.z}i&&(B[W--]=V.z,B[W--]=V.y,B[W--]=V.x,B[S++]=A.x,B[S++]=A.y,B[S++]=A.z)}I=e.CesiumMath.PI_OVER_TWO,V=c(-I,o,w,p,d,z,f,_,O,V);const N={};return n&&(g[E++]=V.x,g[E++]=V.y,g[E++]=V.z,N.positions=g,N.numPts=P),i&&(B[W--]=V.z,B[W--]=V.y,B[W--]=V.x,N.outerPositions=B),N};var d=i;t.EllipseGeometryLibrary=d}));
