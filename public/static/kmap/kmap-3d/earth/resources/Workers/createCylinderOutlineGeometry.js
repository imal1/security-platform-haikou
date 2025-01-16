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
define(["./Transforms-7e6ffc4e","./Matrix2-82a3f96e","./Matrix3-65932166","./ComponentDatatype-c4eaff65","./CylinderGeometryLibrary-dcd0c601","./defaultValue-0ab18f7d","./GeometryAttribute-62355954","./GeometryAttributes-eb2609b7","./GeometryOffsetAttribute-cc320d7d","./IndexDatatype-9c4154c8","./Math-422cd179","./combine-4598d225","./RuntimeError-e5c6a8b9","./WebGLConstants-f27a5e29"],(function(t,e,i,n,o,r,a,s,u,f,c,d,l,m){"use strict";const b=new e.Cartesian2;function p(t){const e=(t=r.defaultValue(t,r.defaultValue.EMPTY_OBJECT)).length,i=t.topRadius,n=t.bottomRadius,o=r.defaultValue(t.slices,128),a=Math.max(r.defaultValue(t.numberOfVerticalLines,16),0);this._length=e,this._topRadius=i,this._bottomRadius=n,this._slices=o,this._numberOfVerticalLines=a,this._offsetAttribute=t.offsetAttribute,this._workerName="createCylinderOutlineGeometry"}p.packedLength=6,p.pack=function(t,e,i){return i=r.defaultValue(i,0),e[i++]=t._length,e[i++]=t._topRadius,e[i++]=t._bottomRadius,e[i++]=t._slices,e[i++]=t._numberOfVerticalLines,e[i]=r.defaultValue(t._offsetAttribute,-1),e};const y={length:void 0,topRadius:void 0,bottomRadius:void 0,slices:void 0,numberOfVerticalLines:void 0,offsetAttribute:void 0};return p.unpack=function(t,e,i){e=r.defaultValue(e,0);const n=t[e++],o=t[e++],a=t[e++],s=t[e++],u=t[e++],f=t[e];return r.defined(i)?(i._length=n,i._topRadius=o,i._bottomRadius=a,i._slices=s,i._numberOfVerticalLines=u,i._offsetAttribute=-1===f?void 0:f,i):(y.length=n,y.topRadius=o,y.bottomRadius=a,y.slices=s,y.numberOfVerticalLines=u,y.offsetAttribute=-1===f?void 0:f,new p(y))},p.createGeometry=function(c){let d=c._length;const l=c._topRadius,m=c._bottomRadius,p=c._slices,y=c._numberOfVerticalLines;if(d<=0||l<0||m<0||0===l&&0===m)return;const _=2*p,h=o.CylinderGeometryLibrary.computePositions(d,l,m,p,!1);let A,R=2*p;if(y>0){const t=Math.min(y,p);A=Math.round(p/t),R+=t}const G=f.IndexDatatype.createTypedArray(_,2*R);let O,V=0;for(O=0;O<p-1;O++)G[V++]=O,G[V++]=O+1,G[V++]=O+p,G[V++]=O+1+p;if(G[V++]=p-1,G[V++]=0,G[V++]=p+p-1,G[V++]=p,y>0)for(O=0;O<p;O+=A)G[V++]=O,G[V++]=O+p;const L=new s.GeometryAttributes;L.position=new a.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:h}),b.x=.5*d,b.y=Math.max(m,l);const g=new t.BoundingSphere(i.Cartesian3.ZERO,e.Cartesian2.magnitude(b));if(r.defined(c._offsetAttribute)){d=h.length;const t=c._offsetAttribute===u.GeometryOffsetAttribute.NONE?0:1,e=new Uint8Array(d/3).fill(t);L.applyOffset=new a.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:e})}return new a.Geometry({attributes:L,indices:G,primitiveType:a.PrimitiveType.LINES,boundingSphere:g,offsetAttribute:c._offsetAttribute})},function(t,e){return r.defined(e)&&(t=p.unpack(t,e)),p.createGeometry(t)}}));
