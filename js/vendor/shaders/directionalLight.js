/**
 * @author Kastor
 *
 * this shader simulates pixelwise directional light
 *
 */

THREE.DirectionalLightShader = {

  uniforms: {
    baseMap:  { type: "t", value: 0, texture: null },
    bumpMap:  { type: "t", value: 0, texture: null },
    bumpiness: { type: "f", value: 1.0 },
    specularPower: { type: "f", value: 6.0 },
    vLightPosition:    { type: "v3", value: new THREE.Vector3( 1000.0, 1000.0, 2000.0 ) },
    diffuseR:  { type: "f", value: 1.0 },
    diffuseG:  { type: "f", value: 1.0 },
    diffuseB:  { type: "f", value: 1.0 },
    specularR:  { type: "f", value: 1.0 },
    specularG:  { type: "f", value: 1.0 },
    specularB:  { type: "f", value: 1.0 }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D baseMap;",
    "uniform sampler2D bumpMap;",
    "uniform float bumpiness;",
    "uniform float specularPower;",
    "uniform vec3 vLightPosition;",
    "uniform float diffuseR;",
    "uniform float diffuseG;",
    "uniform float diffuseB;",
    "uniform float specularR;",
    "uniform float specularG;",
    "uniform float specularB;",

    "varying vec2 vUv;",

    "void main() {",
    "vec3 fvLightDirection;",
    "vec3 fvNormal;",
    "vec3 smoo;",
    "float fNDotL;",
    "vec3 fvReflection;",
    "vec3 fvViewDirection;",
    "float fRDotV;",
    "vec4 fvBaseColor;",
    "vec4 fvTotalDiffuse;",
    "vec4 fvTotalSpecular;",
    "vec4 vSpecular;",
    "vec4 vDiffuse;",

    "vSpecular = vec4(specularR, specularG, specularB, 1.0);",
    "vDiffuse = vec4(diffuseR, diffuseG, diffuseB, 1.0);",

    "smoo = vec3( 0.500000, 0.500000, 1.00000);",
    "fvLightDirection = normalize( vLightPosition );",
    "fvNormal = texture2D( bumpMap, vUv).xyz ;",
    "fvNormal = mix( smoo, fvNormal, vec3( bumpiness));",
    "fvNormal = normalize( ((fvNormal * 2.00000) - 1.00000) );",
    "fNDotL = dot( fvNormal, fvLightDirection);",
    "fvReflection = normalize( (((2.00000 * fvNormal) * fNDotL) - fvLightDirection) );",
    "fvViewDirection = normalize( vLightPosition );",
    "fRDotV = max( 0.000000, dot( fvReflection, fvViewDirection));",
    "fvBaseColor = texture2D( baseMap,vUv);",
    "fvTotalDiffuse = ((vDiffuse * fNDotL) * fvBaseColor);",
    "fvTotalSpecular = (vSpecular * pow( fRDotV, specularPower));",
    "gl_FragColor = clamp( (fvTotalDiffuse + fvTotalSpecular) ,0.0, 1.0);",
    "}"

  ].join("\n")

};
