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
define(["exports","./Matrix2-82a3f96e","./Matrix3-65932166","./defaultValue-0ab18f7d","./WebGLConstants-f27a5e29","./Transforms-7e6ffc4e"],(function(t,e,n,a,r,i){"use strict";var o=Object.freeze({NONE:0,TRIANGLES:1,LINES:2,POLYLINES:3});const s={POINTS:r.WebGLConstants.POINTS,LINES:r.WebGLConstants.LINES,LINE_LOOP:r.WebGLConstants.LINE_LOOP,LINE_STRIP:r.WebGLConstants.LINE_STRIP,TRIANGLES:r.WebGLConstants.TRIANGLES,TRIANGLE_STRIP:r.WebGLConstants.TRIANGLE_STRIP,TRIANGLE_FAN:r.WebGLConstants.TRIANGLE_FAN,isLines:function(t){return t===s.LINES||t===s.LINE_LOOP||t===s.LINE_STRIP},isTriangles:function(t){return t===s.TRIANGLES||t===s.TRIANGLE_STRIP||t===s.TRIANGLE_FAN},validate:function(t){return t===s.POINTS||t===s.LINES||t===s.LINE_LOOP||t===s.LINE_STRIP||t===s.TRIANGLES||t===s.TRIANGLE_STRIP||t===s.TRIANGLE_FAN}};var u=Object.freeze(s);function I(t){t=a.defaultValue(t,a.defaultValue.EMPTY_OBJECT),this.attributes=t.attributes,this.indices=t.indices,this.primitiveType=a.defaultValue(t.primitiveType,u.TRIANGLES),this.boundingSphere=t.boundingSphere,this.geometryType=a.defaultValue(t.geometryType,o.NONE),this.boundingSphereCV=t.boundingSphereCV,this.offsetAttribute=t.offsetAttribute}I.computeNumberOfVertices=function(t){let e=-1;for(const n in t.attributes)if(t.attributes.hasOwnProperty(n)&&a.defined(t.attributes[n])&&a.defined(t.attributes[n].values)){const a=t.attributes[n];e=a.values.length/a.componentsPerAttribute}return e};const N=new n.Cartographic,T=new n.Cartesian3,c=new e.Matrix4,l=[new n.Cartographic,new n.Cartographic,new n.Cartographic],L=[new e.Cartesian2,new e.Cartesian2,new e.Cartesian2],f=[new e.Cartesian2,new e.Cartesian2,new e.Cartesian2],E=new n.Cartesian3,p=new i.Quaternion,m=new e.Matrix4,y=new e.Matrix2;I._textureCoordinateRotationPoints=function(t,a,r,o){let s;const u=e.Rectangle.center(o,N),I=n.Cartographic.toCartesian(u,r,T),b=i.Transforms.eastNorthUpToFixedFrame(I,r,c),C=e.Matrix4.inverse(b,c),h=L,A=l;A[0].longitude=o.west,A[0].latitude=o.south,A[1].longitude=o.west,A[1].latitude=o.north,A[2].longitude=o.east,A[2].latitude=o.south;let x=E;for(s=0;s<3;s++)n.Cartographic.toCartesian(A[s],r,x),x=e.Matrix4.multiplyByPointAsVector(C,x,x),h[s].x=x.x,h[s].y=x.y;const d=i.Quaternion.fromAxisAngle(n.Cartesian3.UNIT_Z,-a,p),S=n.Matrix3.fromQuaternion(d,m),P=t.length;let G=Number.POSITIVE_INFINITY,R=Number.POSITIVE_INFINITY,_=Number.NEGATIVE_INFINITY,O=Number.NEGATIVE_INFINITY;for(s=0;s<P;s++)x=e.Matrix4.multiplyByPointAsVector(C,t[s],x),x=n.Matrix3.multiplyByVector(S,x,x),G=Math.min(G,x.x),R=Math.min(R,x.y),_=Math.max(_,x.x),O=Math.max(O,x.y);const g=e.Matrix2.fromRotation(a,y),w=f;w[0].x=G,w[0].y=R,w[1].x=G,w[1].y=O,w[2].x=_,w[2].y=R;const V=h[0],M=h[2].x-V.x,v=h[1].y-V.y;for(s=0;s<3;s++){const t=w[s];e.Matrix2.multiplyByVector(g,t,t),t.x=(t.x-V.x)/M,t.y=(t.y-V.y)/v}const F=w[0],W=w[1],Y=w[2],B=new Array(6);return e.Cartesian2.pack(F,B),e.Cartesian2.pack(W,B,2),e.Cartesian2.pack(Y,B,4),B},t.Geometry=I,t.GeometryAttribute=function(t){t=a.defaultValue(t,a.defaultValue.EMPTY_OBJECT),this.componentDatatype=t.componentDatatype,this.componentsPerAttribute=t.componentsPerAttribute,this.normalize=a.defaultValue(t.normalize,!1),this.values=t.values},t.GeometryType=o,t.PrimitiveType=u}));
