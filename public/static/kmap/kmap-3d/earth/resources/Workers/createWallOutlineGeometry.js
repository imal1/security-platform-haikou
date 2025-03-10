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
define(["./defaultValue-0ab18f7d","./Matrix3-65932166","./Transforms-7e6ffc4e","./ComponentDatatype-c4eaff65","./GeometryAttribute-62355954","./GeometryAttributes-eb2609b7","./IndexDatatype-9c4154c8","./Math-422cd179","./WallGeometryLibrary-01e62045","./Matrix2-82a3f96e","./RuntimeError-e5c6a8b9","./combine-4598d225","./WebGLConstants-f27a5e29","./arrayRemoveDuplicates-33a8febf","./PolylinePipeline-58dfa5d1","./EllipsoidGeodesic-ca606535","./EllipsoidRhumbLine-e32e4fe7","./IntersectionTests-07480e0f","./Plane-23695f18"],(function(e,i,t,n,o,a,s,r,l,m,d,u,p,c,f,h,g,y,_){"use strict";const E=new i.Cartesian3,C=new i.Cartesian3;function H(t){const n=(t=e.defaultValue(t,e.defaultValue.EMPTY_OBJECT)).positions,o=t.maximumHeights,a=t.minimumHeights,s=e.defaultValue(t.granularity,r.CesiumMath.RADIANS_PER_DEGREE),l=e.defaultValue(t.ellipsoid,i.Ellipsoid.WGS84);this._positions=n,this._minimumHeights=a,this._maximumHeights=o,this._granularity=s,this._ellipsoid=i.Ellipsoid.clone(l),this._workerName="createWallOutlineGeometry";let m=1+n.length*i.Cartesian3.packedLength+2;e.defined(a)&&(m+=a.length),e.defined(o)&&(m+=o.length),this.packedLength=m+i.Ellipsoid.packedLength+1}H.pack=function(t,n,o){let a;o=e.defaultValue(o,0);const s=t._positions;let r=s.length;for(n[o++]=r,a=0;a<r;++a,o+=i.Cartesian3.packedLength)i.Cartesian3.pack(s[a],n,o);const l=t._minimumHeights;if(r=e.defined(l)?l.length:0,n[o++]=r,e.defined(l))for(a=0;a<r;++a)n[o++]=l[a];const m=t._maximumHeights;if(r=e.defined(m)?m.length:0,n[o++]=r,e.defined(m))for(a=0;a<r;++a)n[o++]=m[a];return i.Ellipsoid.pack(t._ellipsoid,n,o),n[o+=i.Ellipsoid.packedLength]=t._granularity,n};const b=i.Ellipsoid.clone(i.Ellipsoid.UNIT_SPHERE),A={positions:void 0,minimumHeights:void 0,maximumHeights:void 0,ellipsoid:b,granularity:void 0};return H.unpack=function(t,n,o){let a;n=e.defaultValue(n,0);let s=t[n++];const r=new Array(s);for(a=0;a<s;++a,n+=i.Cartesian3.packedLength)r[a]=i.Cartesian3.unpack(t,n);let l,m;if(s=t[n++],s>0)for(l=new Array(s),a=0;a<s;++a)l[a]=t[n++];if(s=t[n++],s>0)for(m=new Array(s),a=0;a<s;++a)m[a]=t[n++];const d=i.Ellipsoid.unpack(t,n,b),u=t[n+=i.Ellipsoid.packedLength];return e.defined(o)?(o._positions=r,o._minimumHeights=l,o._maximumHeights=m,o._ellipsoid=i.Ellipsoid.clone(d,o._ellipsoid),o._granularity=u,o):(A.positions=r,A.minimumHeights=l,A.maximumHeights=m,A.granularity=u,new H(A))},H.fromConstantHeights=function(i){const t=(i=e.defaultValue(i,e.defaultValue.EMPTY_OBJECT)).positions;let n,o;const a=i.minimumHeight,s=i.maximumHeight,r=e.defined(a),l=e.defined(s);if(r||l){const e=t.length;n=r?new Array(e):void 0,o=l?new Array(e):void 0;for(let i=0;i<e;++i)r&&(n[i]=a),l&&(o[i]=s)}return new H({positions:t,maximumHeights:o,minimumHeights:n,ellipsoid:i.ellipsoid})},H.createGeometry=function(m){const d=m._positions,u=m._minimumHeights,p=m._maximumHeights,c=m._granularity,f=m._ellipsoid,h=l.WallGeometryLibrary.computePositions(f,d,p,u,c,!1);if(!e.defined(h))return;const g=h.bottomPositions,y=h.topPositions;let _=y.length,H=2*_;const b=new Float64Array(H);let A,k=0;for(_/=3,A=0;A<_;++A){const e=3*A,t=i.Cartesian3.fromArray(y,e,E),n=i.Cartesian3.fromArray(g,e,C);b[k++]=n.x,b[k++]=n.y,b[k++]=n.z,b[k++]=t.x,b[k++]=t.y,b[k++]=t.z}const w=new a.GeometryAttributes({position:new o.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:b})}),x=H/3;H=2*x-4+x;const G=s.IndexDatatype.createTypedArray(x,H);let L=0;for(A=0;A<x-2;A+=2){const e=A,t=A+2,n=i.Cartesian3.fromArray(b,3*e,E),o=i.Cartesian3.fromArray(b,3*t,C);if(i.Cartesian3.equalsEpsilon(n,o,r.CesiumMath.EPSILON10))continue;const a=A+1,s=A+3;G[L++]=a,G[L++]=e,G[L++]=a,G[L++]=s,G[L++]=e,G[L++]=t}return G[L++]=x-2,G[L++]=x-1,new o.Geometry({attributes:w,indices:G,primitiveType:o.PrimitiveType.LINES,boundingSphere:new t.BoundingSphere.fromVertices(b)})},function(t,n){return e.defined(n)&&(t=H.unpack(t,n)),t._ellipsoid=i.Ellipsoid.clone(t._ellipsoid),H.createGeometry(t)}}));
