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
define(["./Matrix3-65932166","./defaultValue-0ab18f7d","./EllipseOutlineGeometry-22653cf8","./Math-422cd179","./Transforms-7e6ffc4e","./Matrix2-82a3f96e","./RuntimeError-e5c6a8b9","./combine-4598d225","./ComponentDatatype-c4eaff65","./WebGLConstants-f27a5e29","./EllipseGeometryLibrary-30a075f8","./GeometryAttribute-62355954","./GeometryAttributes-eb2609b7","./GeometryOffsetAttribute-cc320d7d","./IndexDatatype-9c4154c8"],(function(e,t,r,i,n,a,l,o,c,f,s,u,d,m,p){"use strict";return function(i,n){return t.defined(n)&&(i=r.EllipseOutlineGeometry.unpack(i,n)),i._center=e.Cartesian3.clone(i._center),i._ellipsoid=e.Ellipsoid.clone(i._ellipsoid),r.EllipseOutlineGeometry.createGeometry(i)}}));
