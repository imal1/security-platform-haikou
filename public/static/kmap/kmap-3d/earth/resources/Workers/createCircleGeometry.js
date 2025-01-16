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
define(["./Matrix3-65932166","./defaultValue-0ab18f7d","./EllipseGeometry-faf80a34","./VertexFormat-84d83549","./Math-422cd179","./Transforms-7e6ffc4e","./Matrix2-82a3f96e","./RuntimeError-e5c6a8b9","./combine-4598d225","./ComponentDatatype-c4eaff65","./WebGLConstants-f27a5e29","./EllipseGeometryLibrary-30a075f8","./GeometryAttribute-62355954","./GeometryAttributes-eb2609b7","./GeometryInstance-340fedcb","./GeometryOffsetAttribute-cc320d7d","./GeometryPipeline-42a041a3","./AttributeCompression-7fdb1de9","./EncodedCartesian3-ef0d760e","./IndexDatatype-9c4154c8","./IntersectionTests-07480e0f","./Plane-23695f18"],(function(e,t,i,r,o,n,s,a,l,d,m,c,u,p,y,_,f,x,G,h,g,E){"use strict";function w(e){const r=(e=t.defaultValue(e,t.defaultValue.EMPTY_OBJECT)).radius,o={center:e.center,semiMajorAxis:r,semiMinorAxis:r,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,vertexFormat:e.vertexFormat,stRotation:e.stRotation,shadowVolume:e.shadowVolume};this._ellipseGeometry=new i.EllipseGeometry(o),this._workerName="createCircleGeometry"}w.packedLength=i.EllipseGeometry.packedLength,w.pack=function(e,t,r){return i.EllipseGeometry.pack(e._ellipseGeometry,t,r)};const A=new i.EllipseGeometry({center:new e.Cartesian3,semiMajorAxis:1,semiMinorAxis:1}),M={center:new e.Cartesian3,radius:void 0,ellipsoid:e.Ellipsoid.clone(e.Ellipsoid.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,vertexFormat:new r.VertexFormat,stRotation:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0,shadowVolume:void 0};return w.unpack=function(o,n,s){const a=i.EllipseGeometry.unpack(o,n,A);return M.center=e.Cartesian3.clone(a._center,M.center),M.ellipsoid=e.Ellipsoid.clone(a._ellipsoid,M.ellipsoid),M.height=a._height,M.extrudedHeight=a._extrudedHeight,M.granularity=a._granularity,M.vertexFormat=r.VertexFormat.clone(a._vertexFormat,M.vertexFormat),M.stRotation=a._stRotation,M.shadowVolume=a._shadowVolume,t.defined(s)?(M.semiMajorAxis=a._semiMajorAxis,M.semiMinorAxis=a._semiMinorAxis,s._ellipseGeometry=new i.EllipseGeometry(M),s):(M.radius=a._semiMajorAxis,new w(M))},w.createGeometry=function(e){return i.EllipseGeometry.createGeometry(e._ellipseGeometry)},w.createShadowVolume=function(e,t,i){const o=e._ellipseGeometry._granularity,n=e._ellipseGeometry._ellipsoid,s=t(o,n),a=i(o,n);return new w({center:e._ellipseGeometry._center,radius:e._ellipseGeometry._semiMajorAxis,ellipsoid:n,stRotation:e._ellipseGeometry._stRotation,granularity:o,extrudedHeight:s,height:a,vertexFormat:r.VertexFormat.POSITION_ONLY,shadowVolume:!0})},Object.defineProperties(w.prototype,{rectangle:{get:function(){return this._ellipseGeometry.rectangle}},textureCoordinateRotationPoints:{get:function(){return this._ellipseGeometry.textureCoordinateRotationPoints}}}),function(i,r){return t.defined(r)&&(i=w.unpack(i,r)),i._ellipseGeometry._center=e.Cartesian3.clone(i._ellipseGeometry._center),i._ellipseGeometry._ellipsoid=e.Ellipsoid.clone(i._ellipseGeometry._ellipsoid),w.createGeometry(i)}}));
