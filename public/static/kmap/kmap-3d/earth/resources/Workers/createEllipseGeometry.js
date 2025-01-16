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
define(["./Matrix3-65932166","./defaultValue-0ab18f7d","./EllipseGeometry-faf80a34","./Math-422cd179","./Transforms-7e6ffc4e","./Matrix2-82a3f96e","./RuntimeError-e5c6a8b9","./combine-4598d225","./ComponentDatatype-c4eaff65","./WebGLConstants-f27a5e29","./EllipseGeometryLibrary-30a075f8","./GeometryAttribute-62355954","./GeometryAttributes-eb2609b7","./GeometryInstance-340fedcb","./GeometryOffsetAttribute-cc320d7d","./GeometryPipeline-42a041a3","./AttributeCompression-7fdb1de9","./EncodedCartesian3-ef0d760e","./IndexDatatype-9c4154c8","./IntersectionTests-07480e0f","./Plane-23695f18","./VertexFormat-84d83549"],(function(e,t,r,a,n,i,o,f,s,c,d,l,m,b,p,u,y,G,E,C,x,A){"use strict";return function(a,n){return t.defined(n)&&(a=r.EllipseGeometry.unpack(a,n)),a._center=e.Cartesian3.clone(a._center),a._ellipsoid=e.Ellipsoid.clone(a._ellipsoid),r.EllipseGeometry.createGeometry(a)}}));
